import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '../users/entities/user.entity';
import { Role } from '../auth/role.decorator';
import AuthUser from '../auth/auth.decorator';
import { CreateUserOutput } from '../users/dtos/create-user.dto';
import { ReadOrdersOutput } from './dtos/read-orders.dto';
import { CreateOrderInput } from './dtos/create-order.dto';
import { AcceptOrderOutput } from './dtos/accept-order.dto';
import { ToggleLikeOutput } from './dtos/toggle-like.dto';
import { AddChatInput, AddChatOutput } from './dtos/add-chat.dto';
import { ReadMyChatsOutput } from './dtos/read-mychat.dto';

@ApiTags('주문 관리')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  @Role(['Client'])
  @Post()
  @ApiOperation({
    summary: '주문 신청',
    description: '주문 신청 API (1인당 최대 2개 동시 주문 가능)',
  })
  async createOrder(
    @AuthUser() user: User,
    @Body() createOrderInput: CreateOrderInput,
  ): Promise<CreateUserOutput> {
    return this.orderService.createOrder(user, createOrderInput);
  }

  /**
   * 주문 신청 리스트 조회 시, 키워드 조회 및 가격 조회 필터 기능 추가
   */
  @Role(['Client'])
  @Get('list')
  @ApiOperation({
    summary: '전체 주문 신청 리스트 조회',
    description: '전체 주문 리스트 조회 API',
  })
  async getOrders(): Promise<ReadOrdersOutput> {
    return this.orderService.getOrders();
  }

  // Accept Order
  @Role(['Client'])
  @Get('accept/:orderId')
  @ApiOperation({
    summary: '주문 수락',
    description: '주문 수락 API',
  })
  acceptOrder(
    @AuthUser() user: User,
    @Param('orderId') orderId: number,
  ): Promise<AcceptOrderOutput> {
    return this.orderService.acceptOrder(user, orderId);
  }

  // 내가 신청한 주문 리스트 조회

  // 이전 주문 내역 조

  // 좋아요, 좋아요 취소
  @Role(['Client'])
  @Get('like/:orderId')
  @ApiOperation({
    summary: '좋아요, 좋아요 취소',
    description: '좋아요, 좋아요 취소 API',
  })
  toggleLike(
    @AuthUser() user: User,
    @Param('orderId') orderId: number,
  ): Promise<ToggleLikeOutput> {
    return this.orderService.toggleLike(user, orderId);
  }

  // 채팅 추가
  @Role(['Client'])
  @Post('chat')
  @ApiOperation({
    summary: '채팅 추가',
    description: '채팅 추가 API',
  })
  addChat(
    @AuthUser() user: User,
    @Body() addChatInput: AddChatInput,
  ): Promise<AddChatOutput> {
    return this.orderService.addChat(user, addChatInput);
  }

  // 내 채팅 리스트
  @Role(['Client'])
  @Get('chat/me')
  @ApiOperation({
    summary: '내 채팅 조회',
    description: '내 채팅 조회 API',
  })
  myChatList(@AuthUser() user: User): Promise<ReadMyChatsOutput> {
    return this.orderService.myChatList(user);
  }
}
