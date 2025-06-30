import { Type } from "class-transformer";
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { MultimediaUploadDto } from './multimedia-upload.dto'
import { ApiProperty } from "@nestjs/swagger";


export class PasoDto {
    @ApiProperty({ example: 1, description: 'Número de paso en la receta' })
    @IsNumber()
    nroPaso: number;
  
    @ApiProperty({ example: 'Mezclar los ingredientes secos', description: 'Descripción del paso' })
    @IsString()
    texto: string;
  
    @ApiProperty({ type: [MultimediaUploadDto], required: false, description: 'Multimedia asociada al paso' })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MultimediaUploadDto)
    multimedia?: MultimediaUploadDto[];
  }
  