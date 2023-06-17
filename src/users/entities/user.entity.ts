import { CoreEntity } from '../../common/entities/core.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
export enum UserRole {
  Admin = 'Admin',
  Client = 'Client',
}

@Entity()
export class User extends CoreEntity {
  @IsEmail()
  @Column({ unique: true })
  @ApiProperty({ default: 'jinwanseo@gmail.com' })
  email: string;

  @IsString()
  @Column({ select: false })
  @ApiProperty({ default: '12345' })
  password: string;

  @IsEnum(UserRole)
  @IsOptional()
  @Column({ type: 'enum', enum: UserRole, default: UserRole.Client })
  @ApiProperty({ default: UserRole.Admin })
  role: UserRole;

  @IsString()
  @Column()
  @ApiProperty({ default: 'jwseo' })
  name: string;

  @IsNumber()
  @Column({
    default: 0,
  })
  @ApiProperty({ default: 0 })
  money: number;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch {
        throw new InternalServerErrorException();
      }
    }
  }
  async comparePassword(password: string): Promise<boolean> {
    try {
      return bcrypt.compare(password, this.password);
    } catch {
      throw new InternalServerErrorException();
    }
  }
}
