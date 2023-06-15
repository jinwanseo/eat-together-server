import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderState } from './entities/order.entity';
import { Repository } from 'typeorm';
import { CreateOrderInput, CreateOrderOutput } from './dtos/create-order.dto';
import { User } from '../users/entities/user.entity';
import { ReadOrdersOutput } from './dtos/read-orders.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orders: Repository<Order>,
  ) {}

  async createOrder(
    client: User,
    createOrderInput: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    const usersOrderCount = await this.orders.count({
      where: { client: { id: client.id } },
    });
    try {
      // 유저 주문 수 확인
      if (usersOrderCount > 2)
        throw new Error(
          '최대 신청 오더는 2개 입니다. 진행 중인 오더 완료 혹은 취소 후 다시 시도해주세요',
        );
      // 주문 신청
      await this.orders.save(
        this.orders.create({
          client,
          ...createOrderInput,
        }),
      );
      // 여기에 푸시 알림 구현 예정
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: error?.message ?? '오더 신청 중 에러 발생',
      };
    }
  }

  async getOrders(): Promise<ReadOrdersOutput> {
    try {
      const [results, total] = await this.orders.findAndCount({
        where: { state: OrderState.Ready },
      });
      return {
        ok: true,
        results,
        total,
      };
    } catch (error) {
      return {
        ok: false,
        error: error?.message ?? '주문 리스트 조회 중 에러 발생',
      };
    }
  }
}
