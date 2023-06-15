import { CoreOutput } from '../../common/dtos/core.dto';
import { PickType } from '@nestjs/swagger';
import { Order } from '../entities/order.entity';

export class CreateOrderInput extends PickType(Order, ['price', 'store']) {}
export class CreateOrderOutput extends CoreOutput {}
