import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class FotoUploadDto {
  @ApiProperty({ example: 'alumnos/123/frente.jpg', description: 'Ruta del archivo en Supabase' })
  @IsString()
  path: string;

  @ApiProperty()
  @IsString()
  extension: string;
}

  