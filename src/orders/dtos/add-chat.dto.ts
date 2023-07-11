import { ApiProperty, PickType } from '@nestjs/swagger';
import { Chat } from '../entities/chat.entity';
import { IsNumber } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/core.dto';

export class AddChatInput extends PickType(Chat, ['message'] as const) {
  @IsNumber()
  @ApiProperty({
    type: Number,
    title: '채팅 대상 주문',
    example: 1,
  })
  orderId: number;
}

export class AddChatOutput extends CoreOutput {}
