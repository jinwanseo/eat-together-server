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
    if (order.data === 'order') {
      console.log(order);
      // this.server.emit('order', { data:  });
    } else if (order.data === 'me') {
      this.server.emit('order', { data: 'jinwan' });
    }
  }
}
