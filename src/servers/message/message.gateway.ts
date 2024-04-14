import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from './message.service';

const clientMap = new Map();

@WebSocketGateway({
  cors: true,
})
export class MessageGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messageService: MessageService) {}

  @SubscribeMessage('connection')
  async handleConnection(@ConnectedSocket() client: Socket) {
    clientMap.set(client.id, client);
  }

  @SubscribeMessage('test')
  async handleMessage(@MessageBody() body) {
    this.server.emit('receiveMessage', {});
  }
}
