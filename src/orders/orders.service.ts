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
import { ToggleLikeOutput } from './dtos/toggle-like.dto';
import Like from './entities/like.entity';
import { Chat } from './entities/chat.entity';
import { AddChatInput, AddChatOutput } from './dtos/add-chat.dto';
import { Room } from './entities/room.entity';
import { ReadMyChatsOutput } from './dtos/read-mychat.dto';

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
    @InjectRepository(Like) private readonly likes: Repository<Like>,
    @InjectRepository(Chat) private readonly chats: Repository<Chat>,
    @InjectRepository(Room) private readonly rooms: Repository<Room>,
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
    {
      startAddress,
      title,
      startCity,
      endAddress,
      endCity,
      pay,
    }: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    try {
      const start: LocationType = await this.getLocationData(startAddress);
      const end: LocationType = await this.getLocationData(endAddress);
      start.name = startCity;
      end.name = endCity;

      const order = await this.orders.save(
        this.orders.create({
          client,
          title,
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
        // where: { state: OrderState.Ready },
        order: { createdAt: 'DESC' },
        loadRelationIds: {
          relations: ['likes'],
        },
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

    if (order.state !== OrderState.Ready) {
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
        delivery: user,
      }),
    );

    return {
      ok: true,
    };
  }

  async toggleLike(user: User, orderId: number): Promise<ToggleLikeOutput> {
    const order = await this.orders.findOne({
      where: {
        id: orderId,
      },
    });

    if (!order) throw new HttpException('주문 확인 불가', HttpStatus.NOT_FOUND);

    const like = await this.likes.findOne({
      where: {
        user: {
          id: user.id,
        },
        order: {
          id: orderId,
        },
      },
    });

    try {
      if (!like) {
        await this.likes.save(
          this.likes.create({
            user,
            order,
          }),
        );
      } else {
        await this.likes.delete(like.id);
      }

      return {
        ok: true,
      };
    } catch {
      throw new HttpException(
        '찜 / 찜 취소 도중 에러 발생',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addChat(
    user: User,
    { orderId, message }: AddChatInput,
  ): Promise<AddChatOutput> {
    // 주문 검증
    const order = await this.orders.findOne({ where: { id: orderId } });
    if (!order)
      throw new HttpException(
        '주문 정보 조회 실패, (주문번호 확인 요망)',
        HttpStatus.NOT_FOUND,
      );

    // 유저 검증 (자신이 업로드한 글에 직접 채팅 시도시 x)
    if (user.id === order.client.id)
      throw new HttpException(
        '직접 등록한 주문에 채팅 불가',
        HttpStatus.BAD_REQUEST,
      );

    // 채팅방 확인
    let room = await this.rooms.findOne({
      where: {
        order: {
          id: order.id,
        },
        userList: {
          id: user.id,
        },
      },
    });

    // 채팅방 없을시 채팅방 개설
    if (!room) {
      room = await this.rooms.save(
        this.rooms.create({
          userList: [user, order.client],
          order,
          chatList: [],
        }),
      );
    }

    // 채팅 추가
    const newChat: Chat = await this.chats.save(
      this.chats.create({
        message,
        user,
        room,
      }),
    );

    if (!newChat)
      throw new HttpException(
        '채팅 업로드 중 실패',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    // 채팅방에 채팅 연결 및 저장
    room.chatList.push(newChat);
    await this.rooms.save(
      this.rooms.create({
        ...room,
      }),
    );

    return {
      ok: true,
    };
  }

  async myChatList(user: User): Promise<ReadMyChatsOutput> {
    const [results, total] = await this.rooms.findAndCount({
      where: {
        userList: {
          id: user.id,
        },
      },
    });

    return {
      ok: true,
      results,
      total,
    };
  }
}
