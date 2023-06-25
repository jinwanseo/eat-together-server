import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderState } from './entities/order.entity';
import { Repository } from 'typeorm';
import { CreateOrderInput, CreateOrderOutput } from './dtos/create-order.dto';
import { User } from '../users/entities/user.entity';
import { ReadOrdersOutput } from './dtos/read-orders.dto';
import { ConfigService } from '@nestjs/config';

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

      await this.orders.save(
        this.orders.create({
          client,
          pay,
          start,
          end,
          state: OrderState.Ready,
        }),
      );

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
