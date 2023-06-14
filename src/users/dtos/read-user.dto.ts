import { CoreOutput } from '../../common/dtos/core.dto';
import { User } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class ReadUserOutput extends CoreOutput {
  @ApiProperty()
  result?: User;
}
