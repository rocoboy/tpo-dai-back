import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CronogramaCurso } from './cronograma-curso.entity';

@Entity('sedes')
export class Sede {
  @PrimaryGeneratedColumn('uuid')
  idSede: string;

  @Column()
  nombreSede: string;

  @Column()
  direccion: string;

  @Column()
  telefono: string;

  @Column({ nullable: true })
  mailSede: string;

  @Column({ nullable: true })
  whatsapp: string;

  @Column({ nullable: true })
  spotBonificacion: string;

  @Column({ nullable: true })
  bonifCursos: string;

  @Column({ nullable: true })
  spotPromocion: string;

  @Column({ nullable: true })
  promocionCursos: string;

  @OneToMany(() => CronogramaCurso, (cronograma) => cronograma.sede)
  cronogramas: CronogramaCurso[];
} 