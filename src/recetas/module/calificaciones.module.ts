import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalificacionesController } from '../controller/calificaciones.controller';
import { CalificationService } from '../service/calificaciones.services';
import { Calificacion } from '../entities/calificacion.entity';
import { Receta } from '../entities/receta.entity';
import { Usuario } from '../../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Calificacion, Receta, Usuario]),
  ],
  controllers: [CalificacionesController],
  providers: [CalificationService],
})
export class CalificacionesModule {}
