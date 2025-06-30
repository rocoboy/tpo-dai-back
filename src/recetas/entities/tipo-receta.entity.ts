import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Receta } from './receta.entity';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Tipo o categoría de receta.
 */
@Entity('tiposReceta')
export class TipoReceta {
  /** Identificador único del tipo de receta */
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ example: 'uuid', description: 'Identificador único del tipo de receta' })
  idTipo: string;

  /** Descripción del tipo de receta */
  @Column()
  @ApiProperty({ example: 'Postre', description: 'Descripción del tipo de receta' })
  descripcion: string;

  /** Recetas asociadas a este tipo */
  @OneToMany(() => Receta, (receta) => receta.tipoReceta)
  @ApiProperty({ description: 'Recetas asociadas a este tipo', type: () => [Receta] })
  recetas: Receta[];
}
