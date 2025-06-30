import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Paso } from './paso.entity';
import { ApiProperty } from '@nestjs/swagger';


@Entity('multimedia')
export class Multimedia {

  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ example: 'uuid', description: 'Identificador único del elemento multimedia' })
  idElemento: string;


  @ManyToOne(() => Paso, (paso) => paso.multimedia, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idPaso' })
  @ApiProperty({ description: 'Paso al que pertenece el elemento multimedia', type: () => Paso })
  paso: Paso;


  @Column()
  @ApiProperty({ example: 'foto', description: 'Tipo de contenido: foto o video' })
  tipo_contenido: string;


  @Column()
  @ApiProperty({ example: 'jpg', description: 'Extensión del archivo' })
  extension: string;


  @Column()
  @ApiProperty({ example: 'https://ejemplo.com/video.mp4', description: 'URL o ruta del contenido' })
  urlContenido: string;
}
