import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Usuario } from '../../users/entities/user.entity';
import { Inscripcion } from '../../cursos/entities/inscripcion.entity';
import { PagoAlumno } from 'src/cursos/entities/pagosAlumno.entity';

@Entity('alumnos')
export class Alumno {
  @PrimaryColumn()
  idAlumno: number;

  @OneToOne(() => Usuario, (usuario) => usuario.alumno)
  @JoinColumn({ name: 'idAlumno' })
  usuario: Usuario;

  @Column()
  dni: number;

  @Column({ length: 12 })
  numeroTarjeta: string;

  @Column({ length: 300 })
  dniFrente: string;

  @Column({ length: 300 })
  dniFondo: string;

  @Column({ length: 12 })
  tramite: string;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  cuentaCorriente: number;

  @Column({ length: 50 })
  tipoTarjeta: string;

  @OneToMany(() => Inscripcion, (inscripcion) => inscripcion.alumno)
  inscripciones: Inscripcion[];

  @OneToMany(() => PagoAlumno, (pago) => pago.alumno)
  pagos: PagoAlumno[];

}
