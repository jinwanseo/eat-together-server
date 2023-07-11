import { CoreEntity } from '../../common/entities/core.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { IsEnum, IsNumber, IsObject, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import Like from './like.entity';
import { Chat } from './chat.entity';
import { Room } from './room.entity';

class Address {
  @IsString()
  name: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}

export enum OrderState {
  Ready = 'Ready',
  Start = 'Start',
  End = 'End',
}

@Entity()
export class Order extends CoreEntity {
  @IsNumber()
  @Column()
  @ApiProperty()
  pay: number;

  @IsString()
  @Column()
  @ApiProperty()
  title: string;

  @IsObject()
  @Column({ type: 'json' })
  @ApiProperty()
  start: Address;

  @IsObject()
  @Column({ type: 'json' })
  @ApiProperty()
  end: Address;

  @IsEnum(OrderState)
  @Column({ type: 'enum', enum: OrderState })
  @ApiProperty()
  state: OrderState;

  @ManyToOne((type) => User, (user: User) => user.orderList, {
    onDelete: 'SET NULL',
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'clientPk' })
  client?: User;

  @ManyToOne((type) => User, (user: User) => user.todoList)
  @JoinColumn({ name: 'deliveryPk' })
  delivery?: User;

  @OneToMany((type) => Like, (like: Like) => like.order)
  likes: Like[];

  @OneToMany((type) => Chat, (chat: Chat) => chat.room, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  roomList?: Room[];
}
