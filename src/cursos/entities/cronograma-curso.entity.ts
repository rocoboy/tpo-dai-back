import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Curso } from './curso.entity';
import { Sede } from './sede.entity';
import { Inscripcion } from './inscripcion.entity';
import { Clase } from './clases-curso.entity';

@Entity('cronogramaCursos')
export class CronogramaCurso {
  @PrimaryGeneratedColumn('uuid')
  idCronograma: string;

  @ManyToOne(() => Curso, (curso) => curso.cronogramas)
  curso: Curso;

  @ManyToOne(() => Sede, (sede) => sede.cronogramas)
  sede: Sede;

  @Column()
  fechaInicio: Date;

  @Column()
  fechaFin: Date;

  @Column()
  horario: string;

  @Column('int')
  vacantesDisponibles: number;

  @Column({ nullable: true })
  promocion: string;

  @OneToMany(() => Inscripcion, (insc) => insc.cronograma)
  inscripciones: Inscripcion[];

  @Column('text', { array: true })
  dias: string[];

  @Column('int', { nullable: true })
  descuento: number;

  @OneToMany(() => Clase, (clase) => clase.cronograma)
  clases: Clase[];
} 