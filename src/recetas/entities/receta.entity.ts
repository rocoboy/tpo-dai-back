import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Usuario } from '../../users/entities/user.entity';
import { TipoReceta } from './tipo-receta.entity';
import { Paso } from './paso.entity';
import { Calificacion } from './calificacion.entity';
import { Utilizado } from './utilizado.entity';
import { Foto } from './foto.entity';
import { EstadoReceta } from '../enums/estado-receta.enum';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Entidad principal de una receta de cocina.
 */
@Entity('recetas')
export class Receta {
  /** Identificador único de la receta */
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ example: 'uuid', description: 'Identificador único de la receta' })
  idReceta: string;

  /** Nombre de la receta */
  @Column()
  @ApiProperty({ example: 'Tarta de manzana', description: 'Nombre de la receta' })
  nombreReceta: string;
  
  /** Promedio de calificaciones */
  @Column({ type: 'float', default: 0 })
  @ApiProperty({ example: 4.5, description: 'Promedio de calificaciones de la receta' })
  promedioCalificacion: number;

  /** Descripción de la receta */
  @Column('text')
  @ApiProperty({ example: 'Receta tradicional de tarta de manzana...', description: 'Descripción de la receta' })
  descripcionReceta: string;

  /** Cantidad de porciones */
  @Column()
  @ApiProperty({ example: 8, description: 'Cantidad de porciones que rinde la receta' })
  porciones: number;

  /** Cantidad de personas sugeridas */
  @Column()
  @ApiProperty({ example: 4, description: 'Cantidad de personas sugeridas' })
  cantidadPersonas: number;

  /** Usuario creador de la receta */
  @ManyToOne(() => Usuario, (usuario) => usuario.recetas)
  @ApiProperty({ description: 'Usuario creador de la receta', type: () => Usuario })
  usuario: Usuario;

  /** Tipo o categoría de la receta */
  @ManyToOne(() => TipoReceta, (tipoReceta) => tipoReceta.recetas)
  @ApiProperty({ description: 'Tipo o categoría de la receta', type: () => TipoReceta })
  tipoReceta: TipoReceta;

  /** Pasos de la receta */
  @OneToMany(() => Paso, (paso) => paso.receta, { cascade: true, eager: true })
  @ApiProperty({ description: 'Pasos de la receta', type: () => [Paso] })
  pasos: Paso[];
  
  /** Calificaciones de la receta */
  @OneToMany(() => Calificacion, (calificacion) => calificacion.receta)
  @ApiProperty({ description: 'Calificaciones de la receta', type: () => [Calificacion] })
  calificaciones: Calificacion[];

  /** Ingredientes utilizados en la receta */
  @OneToMany(() => Utilizado, (utilizado) => utilizado.receta)
  @ApiProperty({ description: 'Ingredientes utilizados en la receta', type: () => [Utilizado] })
  utilizados: Utilizado[];

  /** Fotos asociadas a la receta */
  @OneToMany(() => Foto, (foto) => foto.receta)
  @ApiProperty({ description: 'Fotos asociadas a la receta', type: () => [Foto] })
  fotos: Foto[];

  /** Fecha de creación de la receta */
  @CreateDateColumn()
  @ApiProperty({ description: 'Fecha de creación de la receta' })
  fechaCreacion: Date;

  /** Fecha de última modificación de la receta */
  @UpdateDateColumn()
  @ApiProperty({ description: 'Fecha de última modificación de la receta' })
  fechaModificacion: Date;

  /** Estado de la receta (pendiente, aprobada, rechazada) */
  @Column({
    type: 'enum',
    enum: EstadoReceta,
    default: EstadoReceta.PENDIENTE,
  })
  @ApiProperty({ example: 'APROBADA', description: 'Estado de la receta (pendiente, aprobada, rechazada)' })
  estado: EstadoReceta;
}
