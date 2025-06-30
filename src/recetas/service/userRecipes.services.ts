import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Receta } from "../entities";
import { Usuario } from "src/users/entities/user.entity";
import { Favorito } from "../entities/favorites.entity";
import { AddFavoritoDto } from "../dto/add-favorito.dto";
import { RecetaResponseDto } from "../dto/recetas-response.dto";
import { EstadoReceta } from "../enums/estado-receta.enum";


@Injectable()
export class UserRecipesService {
  constructor(
        @InjectRepository(Receta) private readonly recetaRepo: Repository<Receta>,
        @InjectRepository(Usuario) private readonly usuarioRepo: Repository<Usuario>,
        @InjectRepository(Favorito) private readonly favoritoRepo: Repository<Favorito>,
  ) {}

  async addToFavorites(userId: number, dto: AddFavoritoDto) {
    // Buscar el usuario
    const usuario = await this.usuarioRepo.findOneBy({ idUsuario: userId });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Buscar la receta
    const receta = await this.recetaRepo.findOneBy({ idReceta: dto.idReceta});
    if (!receta) {
      throw new NotFoundException('Receta no encontrada');
    }
    if (receta.estado !== EstadoReceta.APROBADA) {
      throw new BadRequestException('La receta debe estar aprobada para agregar a favoritos');
    }


    // Verificar si ya está en favoritos
    const existe = await this.favoritoRepo.findOne({
      where: {
        usuario: { idUsuario: userId },
        receta: { idReceta: dto.idReceta },
      },
    });

    if (existe) {
      throw new BadRequestException('La receta ya está en favoritos');
    }

    // Crear y guardar el nuevo favorito
    const favorito = this.favoritoRepo.create({ usuario, receta });
    await this.favoritoRepo.save(favorito);

    return {
      message: 'Receta agregada a favoritos',
      idFavorito: favorito.idFavorito,
      recetaId: receta.idReceta,
      fechaAgregado: favorito.fechaAgregada,
    };
  }

  async removeFromFavorites(userId: number, idReceta: string) {

    const usuario = await this.usuarioRepo.findOneBy({ idUsuario: userId });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Buscar la receta
    const receta = await this.recetaRepo.findOneBy({ idReceta: idReceta });
    if (!receta) {
      throw new NotFoundException('Receta no encontrada');
    }

    // Buscar el favorito
    const favorito = await this.favoritoRepo.findOne({
      where: {
        usuario: { idUsuario: userId },
        receta: { idReceta: idReceta },
      },
    });

    if (!favorito) {
      throw new NotFoundException('La receta no está en favoritos');
    }
    // Eliminar el favorito
    await this.favoritoRepo.delete(favorito.idFavorito);
    return { message: 'Receta eliminada de favoritos', receta: receta.nombreReceta };

  }

  async getFavoriteRecipesByUser(userId: number): Promise<RecetaResponseDto[]> {
    const favoritos = await this.favoritoRepo.find({
      where: { usuario: { idUsuario: userId } },
      relations: ['receta', 'receta.usuario', 'receta.fotos'],
    });

    return favoritos.map((fav) => {
      const receta = fav.receta;
      return {
        id: receta.idReceta,
        nombre: receta.nombreReceta,
        autor: receta.usuario.nickname,
        porciones: receta.porciones,
        imagen: receta.fotos?.[0]?.url || '',
        promedioCalificacion: receta.promedioCalificacion,
      };
    });
  }
    
  async getRecipesByUserID(idUsuario: number): Promise<Receta[]> {
    const usuario = await this.usuarioRepo.findOne({
      where: { idUsuario },
      relations: ['recetas'],
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return usuario.recetas;
  }
  
}