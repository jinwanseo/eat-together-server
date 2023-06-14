import { CoreOutput } from './core.dto';
import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationInput {
  @IsNumber()
  @ApiProperty({ default: 1 })
  page: number;

  @IsNumber()
  @ApiProperty({ default: 3 })
  take: number;
}

export class PaginationOutput extends CoreOutput {
  @ApiProperty()
  total?: number;
}
