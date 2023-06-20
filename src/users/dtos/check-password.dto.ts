import { ApiHideProperty, PickType } from '@nestjs/swagger';
import { CoreOutput } from 'src/common/dtos/core.dto';
import { User } from '../entities/user.entity';

export class CheckPasswordInput extends PickType(User, ['password'] as const) {}

export class CheckPasswordOutput extends CoreOutput {
  @ApiHideProperty()
  result?: boolean;
}
