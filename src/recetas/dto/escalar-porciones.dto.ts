
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumber, Min } from 'class-validator';

export class EscalarPorcionesDTO {
  @ApiProperty({ description: 'ID de la receta a escalar' })
  @IsUUID()
  recipeId: string;

  @ApiProperty({ description: 'Cantidad de porciones deseadas' })
  @IsNumber()
  @Min(1)
  targetPortions: number;
}
