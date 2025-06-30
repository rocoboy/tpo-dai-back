import { ApiProperty } from '@nestjs/swagger';

export class CreateAlumnoDto {
  @ApiProperty()
  dni: number;

  @ApiProperty()
  numeroTarjeta: string;

  @ApiProperty()
  dniFrente: string;

  @ApiProperty()
  dniFondo: string;

  @ApiProperty()
  tramite: string;

  @ApiProperty({ required: false })
  cuentaCorriente?: number;

  @ApiProperty()
  tipoTarjeta: string;
}
