import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsDate, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class CoreEntity {
  @IsNumber()
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @IsDate()
  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;

  @IsDate()
  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;
}
