import { PaginationOutput } from '../../common/dtos/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Order } from '../entities/order.entity';

export class ReadOrdersOutput extends PaginationOutput {
  @ApiProperty()
  results?: Order[];
}
