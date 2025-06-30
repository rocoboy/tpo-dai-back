import { ApiProperty } from '@nestjs/swagger';

export class RecetaResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  nombre: string;

  @ApiProperty()
  autor: string;

  @ApiProperty()
  porciones: number;

  @ApiProperty()
  imagen: string;

  @ApiProperty()
  promedioCalificacion: number;
}
