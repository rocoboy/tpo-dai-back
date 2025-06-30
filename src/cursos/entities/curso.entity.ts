import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CronogramaCurso } from './cronograma-curso.entity';

@Entity('cursos')
export class Curso {
  @PrimaryGeneratedColumn('uuid')
  idCurso: string;

  @Column()
  nombre: string;

  @Column('text')
  descripcion: string;

  @Column('text')
  contenidos: string;

  @Column('text')
  requisitos: string;

  @Column()
  duracion: string;

  @Column('decimal', { precision: 12, scale: 2 })
  precio: number;

  @Column()
  modalidad: string;

  @OneToMany(() => CronogramaCurso, (cronograma) => cronograma.curso)
  cronogramas: CronogramaCurso[];
} 