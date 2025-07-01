import {
    Injectable,
    NotFoundException,
    InternalServerErrorException,
    ForbiddenException,
    BadRequestException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { DataSource, QueryRunner, Repository } from 'typeorm';
  import { CreateRecetaDto } from '../dto/create-receta.dto';
  import { Receta } from '../entities/receta.entity';
  import { Foto } from '../entities/foto.entity';
  import { Paso } from '../entities/paso.entity';
  import { Multimedia } from '../entities/multimedia.entity';
  import { Utilizado } from '../entities/utilizado.entity';
  import { Ingrediente } from '../entities/ingrediente.entity';
  import { Unidad } from '../entities/unidad.entity';
  import { TipoReceta } from '../entities/tipo-receta.entity';
  import { Usuario } from '../../users/entities/user.entity';
  import {RecetaResponseDto } from '../dto/recetas-response.dto';
  import { FiltrarRecetasDto } from '../dto/filtrar-recetas.dto';
  import { EscalarPorcionesDTO} from '../dto/escalar-porciones.dto';
  import { IngredienteEscaladoDto } from '../dto/escalar-porciones-response.dto';
  import { EscalarIngredienteDTO } from '../dto/escalar-ingrediente.dto';
  import { EstadoReceta } from '../enums/estado-receta.enum';
import { Calificacion } from '../entities/calificacion.entity';


  
@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(Receta) private readonly recetaRepo: Repository<Receta>,
    private readonly dataSource: DataSource,
  ) {}

  async replaceRecipe(idReceta: string, userId: number): Promise<void> {
    const receta = await this.recetaRepo.findOne({
      where: { idReceta },
      relations: ['usuario'],
    });

    if (!receta) {
      throw new NotFoundException('Receta no encontrada');
    }

    if (receta.usuario.idUsuario !== userId) {
      throw new ForbiddenException('No eres el dueño de esta receta, no puedes reemplazarla');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(Multimedia)
        .where(`"idPaso" IN (
          SELECT "idPaso" FROM "pasos" WHERE "recetaIdReceta" = :id
        )`, { id: idReceta })
        .execute();

      await queryRunner.manager.delete(Paso, {
        receta: { idReceta },
      });

      await queryRunner.manager.delete(Calificacion, {
        receta: { idReceta },
    });

      await queryRunner.manager.delete(Utilizado, {
        receta: { idReceta },
      });

      await queryRunner.manager.delete(Foto, {
        receta: { idReceta },
      });

      await queryRunner.manager.delete(Receta, {
        idReceta,
      });

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async createRecipe(dto: CreateRecetaDto, userId: number, opertationType: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    let usuario: Usuario;
    let tipo: TipoReceta;

    try {
      // Validaciones iniciales antes de iniciar la transacción
      usuario = await queryRunner.manager.findOneOrFail(Usuario, {
        where: { idUsuario: userId },
      });

      tipo = await queryRunner.manager.findOneOrFail(TipoReceta, {
        where: { idTipo: dto.idTipo },
      });

      const existingRecipe = await queryRunner.manager.findOne(Receta, {
        where: { nombreReceta: dto.nombreReceta, usuario: { idUsuario: userId } },
        relations: ['usuario'],
      });

      if (existingRecipe) {
        throw new BadRequestException('Ya tienes una receta con ese nombre. Puedes reemplazarla o editarla.');
      }

      if (dto.porciones <= 0 || dto.cantidadPersonas <= 0) {
        throw new BadRequestException('Las porciones y la cantidad de personas deben ser mayores a cero.');
      }

      // Iniciar transacción después de validaciones
      await queryRunner.startTransaction();

      const receta = queryRunner.manager.create(Receta, {
        nombreReceta: dto.nombreReceta,
        descripcionReceta: dto.descripcionReceta,
        porciones: dto.porciones,
        cantidadPersonas: dto.cantidadPersonas,
        tipoReceta: tipo,
        usuario,
        estado: EstadoReceta.PENDIENTE,
      });

      const savedRecipe = await queryRunner.manager.save(Receta, receta);

      for (const foto of dto.fotos) {
        if (!foto.path || !foto.extension) {
          throw new BadRequestException('Cada foto debe tener path y extensión');
        }
        await queryRunner.manager.save(Foto, {
          receta: savedRecipe,
          url: foto.path,
          extension: foto.extension,
        });
      }

      for (const ing of dto.utilizados) {
        const ingrediente = await queryRunner.manager.findOne(Ingrediente, {
          where: { idIngrediente: ing.idIngrediente },
        });
        if (!ingrediente) {
          throw new BadRequestException('Ingrediente inválido');
        }
        const unidad = await queryRunner.manager.findOne(Unidad, {
          where: { idUnidad: ing.idUnidad },
        });
        if (!unidad) {
          throw new BadRequestException('Unidad inválida');
        }
        if (ing.cantidad <= 0) {
          throw new BadRequestException('La cantidad de cada ingrediente debe ser mayor a cero.');
        }
        await queryRunner.manager.save(Utilizado, {
          receta: savedRecipe,
          ingrediente,
          unidad,
          cantidad: ing.cantidad,
          observaciones: ing.observaciones,
        });
      }

      for (const pasoDto of dto.pasos) {
        const paso = await queryRunner.manager.save(Paso, {
          receta: savedRecipe,
          nroPaso: pasoDto.nroPaso,
          texto: pasoDto.texto,
        });

        if (pasoDto.multimedia?.length) {
          for (const media of pasoDto.multimedia) {
            await queryRunner.manager.save(Multimedia, {
              paso,
              tipo_contenido: media.tipo_contenido,
              urlContenido: media.path,
              extension: media.extension,
            });
          }
        }
      }

      await queryRunner.commitTransaction();

      let message = '';
      if (opertationType === 'replace') {
        message = 'Receta reemplazada correctamente y está pendiente de aprobación';
      } else if (opertationType === 'edit') {
        message = 'Receta editada correctamente y está pendiente de aprobación';
      } else {
        message = 'Receta creada correctamente y está pendiente de aprobación';
      }

      return { message, receta: savedRecipe };

    } catch (error) {
      if (queryRunner.isTransactionActive) {
        try {
          await queryRunner.rollbackTransaction();
        } catch (rollbackError) {
          console.error('Error al hacer rollback de la transacción:', rollbackError);
        }
      }
      throw error;
    } finally {
      await queryRunner.release();
    }
  } 

  async approveRecipe(idReceta: string): Promise<Receta> {
    const receta = await this.recetaRepo.findOneBy({ idReceta });
    if (!receta) throw new NotFoundException('Receta no encontrada');
    receta.estado = EstadoReceta.APROBADA;
    return this.recetaRepo.save(receta);
  }

  async rejectRecipe(idReceta: string): Promise<Receta> {
    const receta = await this.recetaRepo.findOneBy({ idReceta });
    if (!receta) throw new NotFoundException('Receta no encontrada');
    receta.estado = EstadoReceta.RECHAZADA;
    return this.recetaRepo.save(receta);
  }

  async getFilteredRecipes(filtro: FiltrarRecetasDto) {

    // Inciializar el query, filtrnado por recetas aprobadas, usuario y fotos
    const query = this.recetaRepo.createQueryBuilder('receta')
      .where('receta.estado = :estado', { estado: EstadoReceta.APROBADA })
      .leftJoinAndSelect('receta.usuario', 'usuario')
      .leftJoinAndSelect('receta.fotos', 'fotos')
      .leftJoin('receta.utilizados', 'utilizados')
      .leftJoin('utilizados.ingrediente', 'ingrediente');

    if (filtro.nombre) {
      query.andWhere('LOWER(receta.nombreReceta) LIKE LOWER(:nombre)', {
        nombre: `%${filtro.nombre}%`,
      });
    }

    if (filtro.tipo) {
      query.andWhere('receta.tipoReceta = :tipo', {
        tipo: filtro.tipo,
      });
    }

    if (filtro.contieneIngrediente) {
      query.andWhere('LOWER(ingrediente.nombre) = LOWER(:contiene)', {
        contiene: filtro.contieneIngrediente,
      });
    }

    if (filtro.sinIngrediente) {
      query.andWhere(qb => {
        const subQuery = qb.subQuery()
          .select('r.idReceta')
          .from('recetas', 'r')
          .leftJoin('r.utilizados', 'u')
          .leftJoin('u.ingrediente', 'i')
          .where('LOWER(i.nombre) = LOWER(:sinIngrediente)')
          .getQuery();
        return 'receta.idReceta NOT IN ' + subQuery;
      }, {
        sinIngrediente: filtro.sinIngrediente,
      });
    }

    if (filtro.autor) {
      query.andWhere('LOWER(usuario.nickname) = LOWER(:autor)', {
        autor: filtro.autor,
      });
    }

    const recetas = await query.getMany();
    if (!recetas || recetas.length === 0) {
      throw new NotFoundException('No se encontraron recetas que coincidan con los filtros');
    }
    return recetas.map((receta) => ({
      id: receta.idReceta,
      nombre: receta.nombreReceta,
      autor: receta.usuario.nickname,
      porciones: receta.porciones,
      imagen: receta.fotos?.[0]?.url || '',
      promedioCalificacion: receta.promedioCalificacion,
    }));
  
  }

  async getRecipeById(idReceta: string, userId?: number): Promise<Receta> {
    const receta = await this.recetaRepo.findOne({
      where: { idReceta },
      relations: [
        'usuario',
        'tipoReceta',
        'utilizados',
        'utilizados.ingrediente',
        'utilizados.unidad',
        'pasos',
        'pasos.multimedia',
        'fotos',
      ],
    });

    if (!receta) {
      throw new NotFoundException('Receta no encontrada');
    }

    if (receta.estado !== EstadoReceta.APROBADA) {
      throw new ForbiddenException('No puedes ver esta receta porque no está aprobada');
    }

    return receta;
  }

  async getTop3Recipes(): Promise<RecetaResponseDto[]> {
    const recetas = await this.recetaRepo.find({
      where: { estado: EstadoReceta.APROBADA },
      order: { promedioCalificacion: 'DESC' },
      take: 3,
      relations: ['usuario', 'fotos'],
    });

    return recetas.map((r) => ({
      id: r.idReceta,
      nombre: r.nombreReceta,
      autor: r.usuario.nickname,
      porciones: r.porciones,
      imagen: r.fotos?.[0]?.url || '',
      promedioCalificacion: r.promedioCalificacion,
    }));
  }

  async getAllRecipes(): Promise<RecetaResponseDto[]> {
    const recetas = await this.recetaRepo.find({
      where: { estado: EstadoReceta.APROBADA },
      relations: ['usuario','fotos'],
    });

    if (!recetas) {
      throw new NotFoundException('No hay recetas disponibles');
    }

    return recetas.map((r) => ({
      id: r.idReceta,
      nombre: r.nombreReceta,
      autor: r.usuario.nickname,
      porciones: r.porciones,
      imagen: r.fotos?.[0]?.url || '',
      promedioCalificacion: r.promedioCalificacion,
    }));
  }

  async deleteRecipe(idReceta: string, userId: number): Promise<void> {
    const receta = await this.recetaRepo.findOne({
      where: { idReceta },
      relations: ['usuario'],
    });

    if (!receta) {
      throw new NotFoundException('Receta no encontrada');
    }

    if (receta.usuario.idUsuario !== userId) {
      throw new ForbiddenException('No tenés permisos para borrar esta receta');
    }

    await this.recetaRepo.delete(idReceta);
  }


  async getLast3Recipes(): Promise<RecetaResponseDto[]> {
  const recetas = await this.recetaRepo.find({
    where: { estado: EstadoReceta.APROBADA },
    order: { fechaCreacion: 'DESC' },
    take: 3,
    relations: ['usuario', 'fotos'],
  });

  return recetas.map((r) => ({
    id: r.idReceta,
    nombre: r.nombreReceta,
    autor: r.usuario.nickname,
    porciones: r.porciones,
    imagen: r.fotos?.[0]?.url || '',
    promedioCalificacion: r.promedioCalificacion,
  }));
  }

  async scaleRecipeByPortions(dto: EscalarPorcionesDTO, userId?: number): Promise<IngredienteEscaladoDto[]> {
    const receta = await this.recetaRepo.findOne({
      where: { idReceta: dto.recipeId },
      relations: ['utilizados', 'utilizados.ingrediente', 'utilizados.unidad', 'usuario'],
    });

    if (!receta) {
      throw new NotFoundException('Receta no encontrada');
    }

    if (receta.estado !== EstadoReceta.APROBADA && receta.usuario.idUsuario !== userId) {
      throw new ForbiddenException('No puedes escalar esta receta');
    }

    if (dto.targetPortions <= 0) {
      throw new BadRequestException('La cantidad de porciones debe ser mayor a cero.');
    }

    const factor = dto.targetPortions / receta.porciones;

    return receta.utilizados.map((u) => ({
      nombreIngrediente: u.ingrediente.nombre,
      unidad: u.unidad.descripcion,
      cantidadOriginal: u.cantidad,
      cantidadEscalada: Math.round(u.cantidad * factor * 100) / 100,
    }));
  }

  async scaleRecipeByIngredient(dto: EscalarIngredienteDTO, userId?: number): Promise<IngredienteEscaladoDto[]> {
    const receta = await this.recetaRepo.findOne({
      where: { idReceta: dto.recipeId },
      relations: ['utilizados', 'utilizados.ingrediente', 'utilizados.unidad', 'usuario'],
    });

    if (!receta) throw new NotFoundException('Receta no encontrada');

    if (receta.estado !== EstadoReceta.APROBADA) {
      throw new ForbiddenException('No puedes escalar esta receta');
    }

    const ingredienteBase = receta.utilizados.find(
      (u) => u.ingrediente.idIngrediente === dto.ingredientId
    );

    if (!ingredienteBase) {
      throw new NotFoundException('Ingrediente base no está presente en la receta');
    }

    if (ingredienteBase.cantidad !== dto.recetaCantidad) {
      throw new BadRequestException('La cantidad original del ingrediente no coincide');
    }

    if (dto.nuevaCantidad <= 0) {
      throw new BadRequestException('La nueva cantidad debe ser mayor a cero.');
    }

    const factor = dto.nuevaCantidad / dto.recetaCantidad;

    return receta.utilizados.map((u) => ({
      nombreIngrediente: u.ingrediente.nombre,
      unidad: u.unidad.descripcion,
      cantidadOriginal: u.cantidad,
      cantidadEscalada: Math.round(u.cantidad * factor * 100) / 100,
    }));
  }

  async updateRecipe(idReceta: string, dto: CreateRecetaDto, userId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Buscar la receta y validar dueño
      const receta = await queryRunner.manager.findOne(Receta, {
        where: { idReceta },
        relations: ['usuario'],
      });
      if (!receta) {
        throw new NotFoundException('Receta no encontrada');
      }
      if (receta.usuario.idUsuario !== userId) {
        throw new ForbiddenException('No eres el dueño de esta receta, no puedes editarla');
      }

      // Actualizar datos planos
      receta.nombreReceta = dto.nombreReceta;
      receta.descripcionReceta = dto.descripcionReceta;
      receta.porciones = dto.porciones;
      receta.cantidadPersonas = dto.cantidadPersonas;
      receta.estado = EstadoReceta.PENDIENTE;
      // Actualizar tipo de receta
      const tipo = await queryRunner.manager.findOneOrFail(TipoReceta, {
        where: { idTipo: dto.idTipo },
      });
      receta.tipoReceta = tipo;
      await queryRunner.manager.save(Receta, receta);

      // Eliminar pasos y multimedia asociados
      await queryRunner.manager.createQueryBuilder()
        .delete()
        .from(Multimedia)
        .where(`"idPaso" IN (SELECT "idPaso" FROM "pasos" WHERE "recetaIdReceta" = :id)`, { id: idReceta })
        .execute();
      await queryRunner.manager.delete(Paso, { receta: { idReceta } });

      // Eliminar ingredientes utilizados
      await queryRunner.manager.delete(Utilizado, { receta: { idReceta } });

      // Eliminar fotos
      await queryRunner.manager.delete(Foto, { receta: { idReceta } });

      // Insertar nuevas fotos
      for (const foto of dto.fotos) {
        if (!foto.path || !foto.extension) {
          throw new BadRequestException('Cada foto debe tener path y extensión');
        }
        await queryRunner.manager.save(Foto, {
          receta,
          url: foto.path,
          extension: foto.extension,
        });
      }

      // Insertar nuevos ingredientes utilizados
      for (const ing of dto.utilizados) {
        const ingrediente = await queryRunner.manager.findOne(Ingrediente, {
          where: { idIngrediente: ing.idIngrediente },
        });
        if (!ingrediente) {
          throw new BadRequestException('Ingrediente inválido');
        }
        const unidad = await queryRunner.manager.findOne(Unidad, {
          where: { idUnidad: ing.idUnidad },
        });
        if (!unidad) {
          throw new BadRequestException('Unidad inválida');
        }
        if (ing.cantidad <= 0) {
          throw new BadRequestException('La cantidad de cada ingrediente debe ser mayor a cero.');
        }
        await queryRunner.manager.save(Utilizado, {
          receta,
          ingrediente,
          unidad,
          cantidad: ing.cantidad,
          observaciones: ing.observaciones,
        });
      }

      // Insertar nuevos pasos y multimedia
      for (const pasoDto of dto.pasos) {
        const paso = await queryRunner.manager.save(Paso, {
          receta,
          nroPaso: pasoDto.nroPaso,
          texto: pasoDto.texto,
        });
        if (pasoDto.multimedia?.length) {
          for (const media of pasoDto.multimedia) {
            await queryRunner.manager.save(Multimedia, {
              paso,
              tipo_contenido: media.tipo_contenido,
              urlContenido: media.path,
              extension: media.path.split('.').pop() || '',
            });
          }
        }
      }

      await queryRunner.commitTransaction();
      return { message: 'Receta editada correctamente y está pendiente de aprobación', receta };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

}
