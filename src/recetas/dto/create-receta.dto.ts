import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { FotoUploadDto } from './foto-upload.dto';
import { IngredienteUtilizadoDto } from './ingrediente-utilizado.dto';
import { PasoDto } from './create-paso.dto';

export class CreateRecetaDto {
  @ApiProperty({ example: 'Tarta de manzana', description: 'Nombre de la receta' })
  @IsString()
  nombreReceta: string;

  @ApiProperty({ example: 'Receta clásica de tarta con masa casera.', description: 'Descripción general de la receta' })
  @IsString()
  descripcionReceta: string;

  @ApiProperty({ example: 4, description: 'Cantidad de porciones que rinde la receta' })
  @IsNumber()
  porciones: number;

  @ApiProperty({ example: 2, description: 'Cantidad de personas para las que está pensada la receta' })
  @IsNumber()
  cantidadPersonas: number;

  @ApiProperty({ example: 'uuid-del-tipo', description: 'ID del tipo de receta (dulce, salada, etc.)' })
  @IsString()
  idTipo: string;

  @ApiProperty({ type: [FotoUploadDto], description: 'Fotos principales del plato' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FotoUploadDto)
  fotos: FotoUploadDto[];

  @ApiProperty({ type: [IngredienteUtilizadoDto], description: 'Ingredientes utilizados en la receta' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngredienteUtilizadoDto)
  utilizados: IngredienteUtilizadoDto[];

  @ApiProperty({ type: [PasoDto], description: 'Lista de pasos para preparar la receta' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PasoDto)
  pasos: PasoDto[];
}
