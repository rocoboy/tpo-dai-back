import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany } from 'typeorm';
import { Alumno } from '../../alumnos/entities/alumno.entity';
import { Receta } from 'src/recetas/entities/receta.entity';
import { Calificacion } from 'src/recetas/entities/calificacion.entity';
import { Favorito } from 'src/recetas/entities/favorites.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  idUsuario: number;
  

  @Column({ unique: true })
  mail: string;

  @Column()
  nickname: string;

  @Column({nullable: true})
  password: string;

  @Column({ default: 'No' })
  habilitado: 'Si' | 'No';

  @Column({ nullable: true })
  nombre: string;

  @Column({ nullable: true })
  apellido: string;

  @Column({ nullable: true })
  direccion: string;

  @Column({ nullable: true })
  avatar: string;

  @Column()
  tipoUsuario: 'Usuario' | 'Alumno' | 'Admin';

  @OneToOne(() => Alumno, (alumno) => alumno.usuario)
  alumno?: Alumno;

  @OneToMany(() => Receta, (receta) => receta.usuario)
  recetas: Receta[];

  @OneToMany(() => Calificacion, (calificacion) => calificacion.usuario)
  calificaciones: Calificacion[];

  @OneToMany(() => Favorito, (favorito) => favorito.usuario)
  favoritos: Favorito[];
} 