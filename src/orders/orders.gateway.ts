import { InjectRepository } from '@nestjs/typeorm';
import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';

const orders = [];
const locations = [
  '삼성동',
  '잠원동',
  '서초동',
  '양재동',
  '가양동',
  '등촌동',
  '여의도동',
  '반포동',
  '논현동',
  '위례동',
];

const createOrder = () => {
  return {
    id: Math.random().toString(36).substring(2),
    start: {
      x: Math.random().toString(10).substring(2),
      y: Math.random().toString(10).substring(2),
    },
    end: {
      x: Math.random().toString(10).substring(2),
      y: Math.random().toString(10).substring(2),
    },
    location: locations[+(+Math.random().toString(10) * 10).toFixed()],
    pay: (Math.random() * 10000).toFixed(0),
    limit: (Math.random() * 120).toFixed(0),
  };
};

@WebSocketGateway()
export class OrdersGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('order')
  handleOrder(@MessageBody() order: any): void {
    console.log(order);
    if (order.data === 'order') {
      setInterval(() => {
        this.server.emit('order', { data: createOrder() });
      }, 2000);
    } else if (order.data === 'me') {
      this.server.emit('order', { data: 'jinwan' });
    }
  }
}
