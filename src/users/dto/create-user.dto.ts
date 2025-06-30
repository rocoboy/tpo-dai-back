import { ApiProperty } from '@nestjs/swagger';


export class CreateUserDto {
  @ApiProperty()
  mail: string;

  @ApiProperty()
  nickname: string;

  @ApiProperty()
  password: string;

  @ApiProperty({ required: false })
  nombre?: string;

  @ApiProperty({ required: false })
  direccion?: string;

  @ApiProperty({ required: false })
  avatar?: string;

  @ApiProperty({ enum: ['Usuario', 'Alumno'] })
  tipoUsuario: 'Usuario' | 'Alumno';

}