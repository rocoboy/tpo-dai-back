import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Receta } from './receta.entity';
import { Usuario } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';


@Entity('calificaciones')
export class Calificacion {

  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ example: 'uuid', description: 'Identificador único de la calificación' })
  idCalificacion: string;

  @ManyToOne(() => Receta, (receta) => receta.calificaciones, {cascade: true, eager: true, onDelete: 'CASCADE'})
  @ApiProperty({ description: 'Receta calificada', type: () => Receta })
  receta: Receta;

  @ManyToOne(() => Usuario, (usuario) => usuario.calificaciones)
  @ApiProperty({ description: 'Usuario que realizó la calificación', type: () => Usuario })
  usuario: Usuario;

  @Column('int')
  @ApiProperty({ example: 5, description: 'Valor numérico de la calificación' })
  valor: number;

  @Column('text', { nullable: true })
  @ApiProperty({ example: 'Muy buena receta', description: 'Comentario opcional', required: false })
  comentario: string | null;
  
  @Column({ default: false })
  @ApiProperty({ example: false, description: 'Indica si la calificación fue autorizada' })
  autorizado: boolean;


  @CreateDateColumn()
  @ApiProperty({ description: 'Fecha de la calificación' })
  fecha: Date;
}
