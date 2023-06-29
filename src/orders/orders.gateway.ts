import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class OrdersGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('order')
  handleOrder(@MessageBody() order: any): void {
    this.server.emit('order', order);
  }

  addOrder(order: any) {
    this.server.emit('order', { data: order });
  }
}
