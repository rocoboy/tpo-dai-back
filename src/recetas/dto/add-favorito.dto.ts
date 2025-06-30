import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class AddFavoritoDto {
  @ApiProperty()
  @IsUUID()
  idReceta: string;
}
