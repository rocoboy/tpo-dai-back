import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class CreateCalificacionDto {
    
    @IsUUID()
    @ApiProperty()
    idReceta: string;
    @ApiProperty()
    valor: number;
    @ApiProperty()
    comentario?: string;
  }
  