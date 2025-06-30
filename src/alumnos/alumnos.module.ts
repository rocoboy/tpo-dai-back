import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alumno } from './entities/alumno.entity';
import { AlumnosService } from './alumnos.service';
import { AlumnosController } from './alumnos.controller';
import { PagoAlumno } from 'src/cursos/entities/pagosAlumno.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Alumno, PagoAlumno])],
  controllers: [AlumnosController],
  providers: [AlumnosService],
  exports: [AlumnosService, TypeOrmModule],
})
export class AlumnosModule {}