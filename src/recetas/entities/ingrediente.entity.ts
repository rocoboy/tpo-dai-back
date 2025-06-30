import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Utilizado } from './utilizado.entity';
import { ApiProperty } from '@nestjs/swagger';


@Entity('ingredientes')
export class Ingrediente {

  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ example: 'uuid', description: 'Identificador único del ingrediente' })
  idIngrediente: string;


  @Column()
  @ApiProperty({ example: 'Manzana', description: 'Nombre del ingrediente' })
  nombre: string;


  @OneToMany(() => Utilizado, (utilizado) => utilizado.ingrediente)
  @ApiProperty({ description: 'Utilizaciones de este ingrediente en recetas', type: () => [Utilizado] })
  utilizados: Utilizado[];
}
