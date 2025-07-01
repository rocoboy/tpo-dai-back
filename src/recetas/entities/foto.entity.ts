import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Receta } from './receta.entity';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Foto asociada a una receta.
 */
@Entity('fotos')
export class Foto {

  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ example: 'uuid', description: 'Identificador único de la foto' })
  idFoto: string;

  @ManyToOne(() => Receta, (receta) => receta.fotos, { onDelete: 'CASCADE', eager: true, cascade: true })
  @ApiProperty({ description: 'Receta a la que pertenece la foto', type: () => Receta })
  receta: Receta;


  @Column()
  @ApiProperty({ example: 'jpg', description: 'Extensión del archivo de la foto' })
  extension: string; // jpg, png, etc.

  @Column()
  @ApiProperty({ example: 'https://ejemplo.com/foto.jpg', description: 'URL o ruta de la foto' })
  url: string; // ruta al archivo o URL pública
}
