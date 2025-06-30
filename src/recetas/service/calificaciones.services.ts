import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Calificacion } from '../entities/calificacion.entity';
import { Receta } from '../entities/receta.entity';
import { Usuario } from '../../users/entities/user.entity';
import { CreateCalificacionDto } from '../dto/create-calificacion.dto';
import { isUUID } from 'class-validator';


@Injectable()
export class CalificationService {
  constructor(
    @InjectRepository(Calificacion)
    private readonly calificacionRepo: Repository<Calificacion>,

    @InjectRepository(Receta)
    private readonly recetaRepo: Repository<Receta>,

    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) {}

  async rateRecipe(dto: CreateCalificacionDto, userId: number) {
    const usuario = await this.usuarioRepo.findOneOrFail({
      where: { idUsuario: userId },
    });

    const receta = await this.recetaRepo.findOneOrFail({
      where: { idReceta: dto.idReceta },
      relations: ['calificaciones'],
    });

    if(!receta) {
      throw new NotFoundException('Receta no encontrada.');
    }
    if (!isUUID(dto.idReceta)) {
      throw new BadRequestException('ID de receta inválido');
    }

    const existingRating = await this.calificacionRepo.findOne({
      where: {
        usuario: { idUsuario: userId },
        receta: { idReceta: dto.idReceta },
      },
    });

    
    if (existingRating) {
      throw new BadRequestException('Ya calificaste esta receta.');
    }

    if (dto.valor < 1 || dto.valor > 5) {
      throw new BadRequestException('La calificación debe ser entre 1 y 5.');
    }

    const nueva = await this.calificacionRepo.save({
      valor: dto.valor,
      comentario: dto.comentario || null,
      autorizado: false,
      usuario,
      receta,
    });

    return nueva;
  }

  async updateRating(idCalificacion: string, dto: CreateCalificacionDto) {
    const calificacion = await this.calificacionRepo.findOneOrFail({
      where: { idCalificacion },
      relations: ['receta'],
    });

    calificacion.valor = dto.valor;
    calificacion.comentario = dto.comentario || null;
    

  if (calificacion.comentario !== dto.comentario) {
    calificacion.autorizado = false;
  }

  await this.calificacionRepo.save(calificacion);
  await this.actualizarPromedioReceta(calificacion.receta.idReceta);
    
    return calificacion;
  }

  async approveRating(idCalificacion: string) {
    const calificacion = await this.calificacionRepo.findOneOrFail({
      where: { idCalificacion },
      relations: ['receta'],
    });

    calificacion.autorizado = true;
    await this.calificacionRepo.save(calificacion);

    await this.actualizarPromedioReceta(calificacion.receta.idReceta);
    return calificacion;
  }

  async rejectRating(idCalificacion: string) {
    const calificacion = await this.calificacionRepo.findOneOrFail({
      where: { idCalificacion },
    });

    calificacion.autorizado = false;
    return await this.calificacionRepo.save(calificacion);
  }

  async deleteRating(idCalificacion: string) {
    const calificacion = await this.calificacionRepo.findOneOrFail({
      where: { idCalificacion },
      relations: ['receta'],
    });

    await this.calificacionRepo.remove(calificacion);
    await this.actualizarPromedioReceta(calificacion.receta.idReceta);

    return { message: 'Calificación eliminada', calificacion: calificacion };
  }

  async getRatingsByRecipe(idReceta: string) {
    const calificaciones = await this.calificacionRepo.find({
      where: { receta: { idReceta }, autorizado: true },
      relations: ['usuario'],
    });

    return calificaciones.map((c) => ({
      idCalificacion: c.idCalificacion,
      valor: c.valor,
      comentario: c.comentario,
      fecha: c.fecha,
      usuario: {
        idUsuario: c.usuario.idUsuario,
        nickname: c.usuario.nickname,
        mail: c.usuario.mail,
      },
    }));
  }


  async getAverageRating(idReceta: string) {
    const calificaciones = await this.calificacionRepo.find({
      where: { receta: { idReceta }, autorizado: true },
    });

    if (calificaciones.length === 0) {
      return 0;
    }

    const total = calificaciones.reduce((acc, c) => acc + c.valor, 0);
    return total / calificaciones.length;
  }

  private async actualizarPromedioReceta(idReceta: string) {
    const receta = await this.recetaRepo.findOne({
      where: { idReceta },
      relations: ['calificaciones'],
    });

    if (!receta) return;

    const calificacionesAutorizadas = receta.calificaciones.filter(c => c.autorizado);

    const promedio =
      calificacionesAutorizadas.length > 0
        ? calificacionesAutorizadas.reduce((acc, c) => acc + c.valor, 0) / calificacionesAutorizadas.length
        : 0;

    receta.promedioCalificacion = Math.round(promedio * 10) / 10;
    await this.recetaRepo.save(receta);
  }
}
