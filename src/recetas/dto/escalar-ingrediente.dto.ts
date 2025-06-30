// dto/scale-by-ingredient.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumber, Min } from 'class-validator';

export class EscalarIngredienteDTO {
  @ApiProperty({ description: 'ID de la receta' })
  @IsUUID()
  recipeId: string;

  @ApiProperty({ description: 'ID del ingrediente base' })
  @IsUUID()
  ingredientId: string;

  @ApiProperty({ description: 'Cantidad actual de ese ingrediente en la receta' })
  @IsNumber()
  @Min(0.01)
  recetaCantidad: number;

  @ApiProperty({ description: 'Cantidad deseada para recalcular' })
  @IsNumber()
  @Min(0.01)
  nuevaCantidad: number;
}
