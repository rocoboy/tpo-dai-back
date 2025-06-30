import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class InscripcionCursoDto {
  @ApiProperty({ description: 'ID del curso' })
  @IsString()
  idCurso: string;

  @ApiProperty({ description: 'ID del cronograma elegido dentro del curso' })
  @IsString()
  idCronograma: string;

}
