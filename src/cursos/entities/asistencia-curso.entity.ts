import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Inscripcion } from './inscripcion.entity';

@Entity('asistenciaCursos')
export class AsistenciaCurso {
  @PrimaryGeneratedColumn('uuid')
  idAsistencia: string;

  @ManyToOne(() => Inscripcion, (inscripcion) => inscripcion.asistencias)
  inscripcion: Inscripcion;

  @Column()
  fecha: Date;

  @Column({ default: false })
  presente: boolean;
} 