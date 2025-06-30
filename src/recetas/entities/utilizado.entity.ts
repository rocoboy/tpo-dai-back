import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Receta } from './receta.entity';
import { Ingrediente } from './ingrediente.entity';
import { Unidad } from './unidad.entity';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Relación N:M entre receta e ingrediente, con cantidad y unidad.
 */
@Entity('utilizados')
export class Utilizado {
  /** Identificador único de la relación */
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ example: 'uuid', description: 'Identificador único de la relación' })
  idUtilizado: string;

  /** Receta asociada */
  @ManyToOne(() => Receta, (receta) => receta.utilizados)
  @ApiProperty({ description: 'Receta asociada', type: () => Receta })
  receta: Receta;

  /** Ingrediente asociado */
  @ManyToOne(() => Ingrediente, (ingrediente) => ingrediente.utilizados)
  @ApiProperty({ description: 'Ingrediente asociado', type: () => Ingrediente })
  ingrediente: Ingrediente;

  /** Unidad de medida */
  @ManyToOne(() => Unidad, (unidad) => unidad.utilizados)
  @ApiProperty({ description: 'Unidad de medida', type: () => Unidad })
  unidad: Unidad;

  /** Cantidad utilizada */
  @Column({ type: 'float' })
  @ApiProperty({ example: 200, description: 'Cantidad utilizada' })
  cantidad: number;

  /** Observaciones adicionales */
  @Column('text', { nullable: true })
  @ApiProperty({ example: 'Cortado en cubos', description: 'Observaciones adicionales', required: false })
  observaciones: string;
}
