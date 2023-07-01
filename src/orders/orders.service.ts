import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderState } from './entities/order.entity';
import { Repository } from 'typeorm';
import { CreateOrderInput, CreateOrderOutput } from './dtos/create-order.dto';
import { User } from '../users/entities/user.entity';
import { ReadOrdersOutput } from './dtos/read-orders.dto';
import { ConfigService } from '@nestjs/config';
import { OrdersGateway } from './orders.gateway';
import { AcceptOrderOutput } from './dtos/accept-order.dto';

type LocationType = {
  name?: string;
  latitude: number;
  longitude: number;
};

@Injectable()
export class OrdersService {
  constructor(
    private readonly config: ConfigService,
    @InjectRepository(Order) private readonly orders: Repository<Order>,
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly ordersGateway: OrdersGateway,
  ) {}

  /**
   * @title Location Data GET
   */
  private async getLocationData(address: string): Promise<LocationType> {
    const response = await fetch(
      `https://dapi.kakao.com/v2/local/search/address.json?query=${address}`,
      {
        headers: {
          Authorization: `KakaoAK ${this.config.get('KAKAO_KEY')}`,
        },
      },
    );

    const data = await response.json();
    const result = data?.documents?.[0];

    return {
      latitude: result.y,
      longitude: result.x,
    };
  }

  async createOrder(
    client: User,
    { startAddress, startCity, endAddress, endCity, pay }: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    try {
      const start: LocationType = await this.getLocationData(startAddress);
      const end: LocationType = await this.getLocationData(endAddress);
      start.name = startCity;
      end.name = endCity;

      const order = await this.orders.save(
        this.orders.create({
          client,
          pay,
          start,
          end,
          state: OrderState.Ready,
        }),
      );

      // socket 전송
      this.ordersGateway.addOrder(order);

      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: error?.message ?? '주문 정보 저장 중 에러 발생',
      };
    }
  }

  async getOrders(): Promise<ReadOrdersOutput> {
    try {
      const [results, total] = await this.orders.findAndCount({
        where: { state: OrderState.Ready },
        order: { createdAt: 'DESC' },
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

  async acceptOrder(user: User, orderId: number): Promise<AcceptOrderOutput> {
    const order = await this.orders.findOne({ where: { id: orderId } });
    if (!order)
      throw new HttpException(
        '수락한 주문이 조회되지 않습니다. 수락한 주문 pk 재 확인',
        HttpStatus.BAD_REQUEST,
      );

    if (order.state !== OrderState.Start) {
      if (order?.delivery?.id === user.id) {
        throw new HttpException(
          '이미 수락한 주문건 입니다.',
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException(
        '이미 다른 사람이 수락한 주문입니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.orders.save(
      this.orders.create({
        ...order,
        state: OrderState.Start,
      }),
    );

    return {
      ok: true,
    };
  }
}
