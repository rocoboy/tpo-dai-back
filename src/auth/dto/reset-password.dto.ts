import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty()
  code: string;

  @ApiProperty()
  newPassword: string;
}