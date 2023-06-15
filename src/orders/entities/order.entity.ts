import { CoreEntity } from '../../common/entities/core.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

class Menu {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsString()
  @IsOptional()
  option?: string;
}

class Store {
  @IsString()
  address: string;

  @IsString()
  addressDetail: string;

  @IsString()
  storeName: string;

  @IsArray()
  menus: Menu[];
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
  price: number;

  @IsObject()
  @Column({ type: 'json' })
  @ApiProperty()
  store: Store;

  @IsEnum(OrderState)
  @Column({ type: 'enum', enum: OrderState, default: 'Ready' })
  @ApiProperty({ default: OrderState.Ready })
  state: OrderState;

  @OneToOne((type) => User, { eager: true })
  @JoinColumn({ name: 'clientPk' })
  client: User;

  @OneToOne((type) => User, { nullable: true })
  @JoinColumn({ name: 'deliveryPk' })
  delivery: User;
}
