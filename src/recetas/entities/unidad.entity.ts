import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Utilizado } from './utilizado.entity';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Unidad de medida para ingredientes.
 */
@Entity('unidades')
export class Unidad {
  /** Identificador único de la unidad */
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ example: 'uuid', description: 'Identificador único de la unidad' })
  idUnidad: string;

  /** Descripción de la unidad */
  @Column()
  @ApiProperty({ example: 'gramos', description: 'Descripción de la unidad' })
  descripcion: string;

  /** Utilizaciones de esta unidad en recetas */
  @OneToMany(() => Utilizado, (utilizado) => utilizado.unidad)
  @ApiProperty({ description: 'Utilizaciones de esta unidad en recetas', type: () => [Utilizado] })
  utilizados: Utilizado[];
}
