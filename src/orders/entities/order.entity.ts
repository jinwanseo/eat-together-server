import { CoreEntity } from '../../common/entities/core.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { IsEnum, IsNumber, IsObject, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

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

  @IsObject()
  @Column({ type: 'json' })
  @ApiProperty()
  start: Address;

  @IsObject()
  @Column({ type: 'json' })
  @ApiProperty()
  end: Address;

  @ManyToOne((type) => User, (user: User) => user.orderList, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'clientPk' })
  client?: User;

  @ManyToOne((type) => User, (user: User) => user.todoList)
  @JoinColumn({ name: 'deliveryPk' })
  delivery?: User;
}
