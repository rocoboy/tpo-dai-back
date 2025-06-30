import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class BajaInscripcionDto {
  @ApiProperty()
  @IsString()
  idInscripcion: string;
} 