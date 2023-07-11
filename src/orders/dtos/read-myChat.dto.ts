import { ApiProperty } from '@nestjs/swagger';
import { Room } from '../entities/room.entity';
import { CoreOutput } from 'src/common/dtos/core.dto';

export class ReadMyChatsOutput extends CoreOutput {
  @ApiProperty({
    type: [Room],
    title: '채팅방 리스트',
  })
  results?: Room[];

  @ApiProperty({
    type: Number,
    title: '채팅방 개수',
  })
  total?: number;
}
