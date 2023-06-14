import { ApiProperty } from '@nestjs/swagger';

export class CoreOutput {
  @ApiProperty({ nullable: false })
  ok: boolean;

  @ApiProperty({ nullable: true })
  error?: string;
}
