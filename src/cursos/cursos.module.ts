import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Curso } from './entities/curso.entity';
import { Sede } from './entities/sede.entity';
import { CronogramaCurso } from './entities/cronograma-curso.entity';
import { Inscripcion } from './entities/inscripcion.entity';
import { AsistenciaCurso } from './entities/asistencia-curso.entity';
import { CursosService } from './cursos.service';
import { CursosController } from './cursos.controller';
import { AlumnosModule } from 'src/alumnos/alumnos.module';
import { PagoAlumno } from './entities/pagosAlumno.entity';
import { Alumno } from 'src/alumnos/entities/alumno.entity';
import { Clase } from './entities/clases-curso.entity';
import { MailService } from 'src/mail/mail.service';
import { MailModule } from 'src/mail/mail.module';

// src/cursos/cursos.module.ts
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Curso,
      Sede,
      CronogramaCurso,
      Inscripcion,
      AsistenciaCurso,
      PagoAlumno, 
      Alumno,
      Clase
    ]),
    AlumnosModule, 
    MailModule
  ],
  providers: [CursosService, MailService],
  controllers: [CursosController],
  exports: [CursosService, MailService],
})
export class CursosModule {}
