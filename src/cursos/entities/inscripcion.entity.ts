import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { CronogramaCurso } from './cronograma-curso.entity';
import { AsistenciaCurso } from './asistencia-curso.entity'
import { Alumno } from '../../alumnos/entities/alumno.entity';
import { PagoAlumno } from './pagosAlumno.entity';

@Entity('inscripciones')
export class Inscripcion {
  @PrimaryGeneratedColumn('uuid')
  idInscripcion: string;

  @ManyToOne(() => Alumno, (alumno) => alumno.inscripciones)
  alumno: Alumno;

  @ManyToOne(() => CronogramaCurso, (cronograma) => cronograma.inscripciones)
  cronograma: CronogramaCurso;

  @Column()
  estadoPago: string; // pendiente, pagado, reintegrado, etc.

  @Column({ default: false })
  asistencia: boolean;

  @OneToMany(() => AsistenciaCurso, (asistencia) => asistencia.inscripcion)
  asistencias: AsistenciaCurso[];

  @OneToMany(() => PagoAlumno, (pago) => pago.inscripcion)
  pagos: PagoAlumno[];

  @Column({ default: 'activa' })
  status: 'activa' | 'baja' | 'finalizada';
} 