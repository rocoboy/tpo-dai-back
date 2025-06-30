import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Alumno } from 'src/alumnos/entities/alumno.entity'; // ✅ importante
import { AlumnosModule } from 'src/alumnos/alumnos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario, Alumno]), 
    AlumnosModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}