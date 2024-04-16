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
    console.log('✨  ~ MessageGateway ~ sendChatMessage ~ body:', body);
    console.log('sendChatMessage', body);
    const message = await this.messageService.createMessage(body);

    this.clientMap.get(body.receiver).emit('receiveChatMessage', message);
    this.clientMap.get(body.sender).emit('callbackChatMessage', message);
  }

  @SubscribeMessage('test')
  async handleMessage(@MessageBody() body) {
    // console.log('handle');

    this.server.emit('receiveChatMessage', { haha: 'haha', body });
  }
}
