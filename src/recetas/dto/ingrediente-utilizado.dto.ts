import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class IngredienteUtilizadoDto {
  @ApiProperty({ description: 'ID del ingrediente' })
  @IsString()
  idIngrediente: string;

  @ApiProperty({ description: 'ID de la unidad de medida' })
  @IsString()
  idUnidad: string;

  @ApiProperty({ description: 'Cantidad del ingrediente' })
  cantidad: number;

  @ApiProperty({ required: false, description: 'Observaciones adicionales (opcional)' })
  @IsOptional()
  @IsString()
  observaciones?: string;
}
