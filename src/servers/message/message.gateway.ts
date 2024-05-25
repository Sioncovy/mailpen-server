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

@WebSocketGateway({
  cors: true,
})
export class MessageGateway {
  @WebSocketServer()
  server: Server;
  clientMap = new Map<string, Socket>();

  constructor(private readonly messageService: MessageService) {}

  // @SubscribeMessage('connection')
  // async handleConnection(@ConnectedSocket() client: Socket) {
  //   this.clientMap.set(client.id, client);
  // }

  @SubscribeMessage('login')
  async login(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { id: string },
  ) {
    this.clientMap.set(body.id, client);
  }

  @SubscribeMessage('sendChatMessage')
  async sendChatMessage(@MessageBody() body: CreateMessageDto) {
    const message = await this.messageService.createMessage(body);

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
}
