import { IsBoolean, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegistrarAsistenciaDto {
  @ApiProperty({
    example: '2025-07-15',
    description: 'Fecha de la clase a la que se quiere registrar asistencia',
  })

  @ApiProperty({
    example: true,
    description: 'Indica si el alumno estuvo presente o no',
  })
  @IsBoolean()
  presente: boolean;
}