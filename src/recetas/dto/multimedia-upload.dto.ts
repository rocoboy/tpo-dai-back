import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString } from "class-validator";

export class MultimediaUploadDto {
  @ApiProperty({ enum: ['foto', 'video'], description: 'Tipo de contenido multimedia' })
  @IsEnum(['foto', 'video'])
  tipo_contenido: 'foto' | 'video';

  @ApiProperty({ example: 'recetas/paso1.jpg', description: 'Ruta del archivo en Supabase' })
  @IsString()
  path: string;

  @ApiProperty({ example: 'image/jpeg', description: 'Tipo de contenido del archivo' })
  @IsString()
  extension: string;
}
