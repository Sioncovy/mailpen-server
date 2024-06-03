import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageService } from './message.service';
import { forwardRef, Inject } from '@nestjs/common';
import { MessageDocument } from './entities/message.entity';
import { ConfigService } from '@nestjs/config';
import * as forge from 'node-forge';
import * as crypto from 'crypto-js';

@WebSocketGateway({
  cors: true,
})
export class MessageGateway {
  @WebSocketServer()
  server: Server;
  clientMap = new Map<string, Socket>();

  constructor(
    @Inject(forwardRef(() => MessageService))
    private readonly messageService: MessageService,
    private readonly configService: ConfigService,
  ) {}

  // @SubscribeMessage('connection')
  // async handleConnection(@ConnectedSocket() client: Socket) {
  //   this.clientMap.set(client.id, client);
  // }

  getAesKey() {
    return this.configService.get('AES_KEY');
  }

  @SubscribeMessage('login')
  async login(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { id: string; key: string },
  ) {
    const { id, key } = body;
    this.clientMap.set(id, client);

    const publicKey = forge.pki.publicKeyFromPem(key);
    const aesKey = this.getAesKey();

    const encryptedAesKey = publicKey.encrypt(aesKey, 'RSA-OAEP', {
      md: forge.md.sha256.create(),
    });

    const encryptedAesKeyBase64 = forge.util.encode64(encryptedAesKey);
    this.server.emit('onAesKey', { key: encryptedAesKeyBase64 });
  }

  @SubscribeMessage('sendChatMessage')
  async sendChatMessage(@MessageBody() body: CreateMessageDto) {
    const encryptedContent = body.content;
    const content = crypto.AES.decrypt(encryptedContent, this.getAesKey());
    const message = await this.messageService.createMessage({
      ...body,
      content,
    });
    message.content = crypto.AES.encrypt(
      message.content,
      this.getAesKey(),
    ).toString();
    console.log('✨  ~ MessageGateway ~ sendChatMessage ~ message:', message);

    this.clientMap.get(body.receiver).emit('receiveChatMessage', message);
    this.clientMap.get(body.sender).emit('callbackChatMessage', message);
  }

  @SubscribeMessage('call')
  async call(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    body: { sender: string; receiver: string; type: 'audio' | 'video' },
  ) {
    this.clientMap.get(body.receiver).emit('onCall', body);
  }

  // candidate
  @SubscribeMessage('candidate')
  async candidate(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { sender: string; receiver: string; candidate: any },
  ) {
    this.clientMap.get(body.receiver).emit('onCandidate', body);
  }

  // offer
  @SubscribeMessage('offer')
  async offer(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { sender: string; receiver: string; offer: any },
  ) {
    this.clientMap.get(body.receiver).emit('onOffer', body);
  }

  // answer
  @SubscribeMessage('answer')
  async answer(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { sender: string; receiver: string; answer: any },
  ) {
    this.clientMap.get(body.receiver).emit('onAnswer', body);
  }

  @SubscribeMessage('test')
  async handleMessage(@MessageBody() body) {
    this.server.emit('receiveChatMessage', { haha: 'haha', body });
  }

  @SubscribeMessage('readMessage')
  async readAll(@MessageBody() body: { id: string; receiver: string }) {
    this.messageService.read(body.id);
    this.clientMap.get(body.receiver).emit('onReadMessage', { id: body.id });
    this.server.emit('onReadMessage', { id: body.id });
  }

  async updateMessage(message: MessageDocument) {
    console.log('✨  ~ MessageGateway ~ updateMessage ~ message:', message);
    this.server.emit('onUpdateMessage', message);
  }

  @SubscribeMessage('withdrawMessage')
  async withdrawMessage(
    @MessageBody() body: { id: string; chatId: string; receiver: string },
  ) {
    this.clientMap
      .get(body.receiver)
      .emit('onWithdrawMessage', { id: body.id, chatId: body.chatId });
    this.server.emit('onWithdrawMessage', { id: body.id, chatId: body.chatId });
  }
}
