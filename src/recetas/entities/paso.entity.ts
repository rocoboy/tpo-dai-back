import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Receta } from './receta.entity';
import { Multimedia } from './multimedia.entity';
import { ApiProperty } from '@nestjs/swagger';


@Entity('pasos')
export class Paso {

  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ example: 'uuid', description: 'Identificador único del paso' })
  idPaso: string;


  @Column()
  @ApiProperty({ example: 1, description: 'Número de orden del paso' })
  nroPaso: number;


  @Column('text')
  @ApiProperty({ example: 'Pelar y cortar las manzanas...', description: 'Texto descriptivo del paso' })
  texto: string;

  @ManyToOne(() => Receta, (receta) => receta.pasos, { onDelete: 'CASCADE' })
  @ApiProperty({ description: 'Receta a la que pertenece el paso', type: () => Receta })
  receta: Receta;
  


  @OneToMany(() => Multimedia, (multimedia) => multimedia.paso)
  @ApiProperty({ description: 'Elementos multimedia asociados al paso', type: () => [Multimedia] })
  multimedia: Multimedia[];
}
