import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Alumno } from '../../alumnos/entities/alumno.entity';
import { Inscripcion } from './inscripcion.entity';

@Entity('pagosAlumno')
export class PagoAlumno {
  @PrimaryGeneratedColumn('uuid')
  idPago: string;

  @ManyToOne(() => Alumno, (alumno) => alumno.pagos)
  alumno: Alumno;

  @ManyToOne(() => Inscripcion, (inscripcion) => inscripcion.pagos, { nullable: true })
  inscripcion: Inscripcion;

  @CreateDateColumn()
  fecha: Date;

  @Column('float')
  monto: number;

  @Column()
  tipo: 'pago' | 'reintegro';

  @Column({ type: 'varchar', nullable: true })
  medioPago: 'tarjeta' | 'efectivo' | 'transferencia' | null  | 'cuenta';


  @Column({ nullable: true, type:'text' })
  descripcion: string;

}
