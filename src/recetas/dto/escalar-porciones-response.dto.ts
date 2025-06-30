// ingrediente-escalado.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class IngredienteEscaladoDto {
  @ApiProperty()
  nombreIngrediente: string;

  @ApiProperty()
  unidad: string;

  @ApiProperty()
  cantidadOriginal: number;

  @ApiProperty()
  cantidadEscalada: number;
}
