import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO {

    @ApiProperty()
    username: string;
    password: string;
}