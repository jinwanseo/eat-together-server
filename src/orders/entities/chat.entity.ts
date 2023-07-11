import { CoreEntity } from 'src/common/entities/core.entity';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Room } from './room.entity';

@Entity()
export class Chat extends CoreEntity {
  @IsString()
  @ApiProperty({
    type: String,
    title: '채팅 내용',
    required: true,
  })
  message: string;

  @ManyToOne((type) => User, (user: User) => user.chatList, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne((type) => Room, (room: Room) => room.chatList, {
    onDelete: 'CASCADE',
  })
  room: Room;
}
