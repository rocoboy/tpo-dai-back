import { ApiProperty } from "@nestjs/swagger";
import { CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Receta } from "./receta.entity";
import { Usuario } from "src/users/entities/user.entity";


@Entity('favoritos')
export class Favorito {

  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ example: 'uuid', description: 'Identificador único del favorito' })
  idFavorito: string;


  @ManyToOne(() => Usuario, (usuario) => usuario.favoritos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idUsuario' }) // Esto es opcional si usás el nombre por convención
  @ApiProperty({ description: 'Usuario que marcó como favorito', type: () => Usuario })
  usuario: Usuario;

  @ManyToOne(() => Receta,{ onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idReceta' })
  @ApiProperty({ description: 'Receta marcada como favorita', type: () => Receta })
  receta: Receta;


  @CreateDateColumn()
  @ApiProperty({ description: 'Fecha en que se agregó a favoritos' })
  fechaAgregada: Date;
}