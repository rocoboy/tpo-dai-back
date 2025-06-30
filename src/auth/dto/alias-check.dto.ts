import { ApiProperty } from '@nestjs/swagger';

export class AliasCheckDto {
  @ApiProperty()
  alias: string;
}