import { ApiProperty } from '@nestjs/swagger';

export class ValidateDTO {
  @ApiProperty()
  code: string;

  @ApiProperty()
  username: string;


  @ApiProperty()
  password: string;
  
}