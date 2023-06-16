import { ApiProperty, PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { CoreOutput } from '../../common/dtos/core.dto';

export class LoginUserInput extends PickType(User, [
  'email',
  'password',
] as const) {}

export class LoginUserOutput extends CoreOutput {
  @ApiProperty()
  token?: string;
  @ApiProperty()
  user?: any;
}
