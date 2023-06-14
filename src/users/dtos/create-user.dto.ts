import { PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { CoreOutput } from '../../common/dtos/core.dto';

export class CreateUserInput extends PickType(User, [
  'email',
  'password',
  'role',
  'name',
] as const) {}

export class CreateUserOutput extends CoreOutput {}
