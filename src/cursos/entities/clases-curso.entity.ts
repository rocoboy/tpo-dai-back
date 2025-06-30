import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CronogramaCurso } from "./cronograma-curso.entity";

@Entity('clases')
export class Clase {
  @PrimaryGeneratedColumn('uuid')
  idClase: string;

  @ManyToOne(() => CronogramaCurso, (cronograma) => cronograma.clases)
  cronograma: CronogramaCurso;

  @Column()
  fecha: Date;

  @Column({ type: 'text', nullable: true })
  tema: string;
  
  @Column({ type: 'time' })
  horaInicio: string;

  @Column({ type: 'time' })
  horaFin: string;
}