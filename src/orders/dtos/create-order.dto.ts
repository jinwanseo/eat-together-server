import { CoreOutput } from '../../common/dtos/core.dto';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { Order } from '../entities/order.entity';
import { IsString } from 'class-validator';

export class CreateOrderInput extends PickType(Order, ['pay']) {
  @IsString()
  @ApiProperty()
  startAddress: string;

  @IsString()
  @ApiProperty()
  startCity: string;

  @IsString()
  @ApiProperty()
  endAddress: string;

  @IsString()
  @ApiProperty()
  endCity: string;
}
export class CreateOrderOutput extends CoreOutput {}
