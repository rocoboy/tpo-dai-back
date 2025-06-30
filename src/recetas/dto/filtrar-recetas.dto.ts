import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FiltrarRecetasDto {
  @ApiPropertyOptional({ description: 'Nombre o parte del nombre de la receta' })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiPropertyOptional({ description: 'Tipo de receta (ej. pasta, postre)' })
  @IsOptional()
  @IsString()
  tipo?: string;

  @ApiPropertyOptional({ description: 'Ingrediente que debe estar presente' })
  @IsOptional()
  @IsString()
  contieneIngrediente?: string;

  @ApiPropertyOptional({ description: 'Ingrediente que NO debe estar presente' })
  @IsOptional()
  @IsString()
  sinIngrediente?: string;

  @ApiPropertyOptional({ description: 'Autor de la receta' })
  @IsOptional()
  @IsString()
  autor?: string;
}
