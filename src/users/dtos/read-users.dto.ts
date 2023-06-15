import {
  PaginationInput,
  PaginationOutput,
} from '../../common/dtos/pagination.dto';
import { User } from '../entities/user.entity';
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReadUsersInput extends PaginationInput {
  @IsString()
  @IsOptional()
  @ApiProperty({ default: 'jw', required: false })
  keyword?: string;
}

export class ReadUsersOutput extends PaginationOutput {
  @ApiProperty()
  results?: User[];
}
