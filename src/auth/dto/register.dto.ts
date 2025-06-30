import { ApiProperty } from '@nestjs/swagger';

export class RegisterInitDTO {
  @ApiProperty()
  mail: string;

  @ApiProperty()
  nickname: string;



}
