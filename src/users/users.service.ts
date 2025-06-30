import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/user.entity';
import { AlumnosService } from '../alumnos/alumnos.service';
import { CreateAlumnoDto } from 'src/alumnos/dto/create-alumno.dto';
import { Alumno } from 'src/alumnos/entities/alumno.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Usuario)
    private userRepo: Repository<Usuario>,
    @InjectRepository(Alumno)
    private alumnoRepo: Repository<Alumno>,
  ) {}

  findAll() {
    return this.userRepo.find();
  }

  findOne(id: number) {
    return this.userRepo.findOne({ where: { idUsuario: id } });
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return this.userRepo.remove(user);
  }

  async upgradeToAlumno(idUsuario: number, dto: CreateAlumnoDto) {
    const user = await this.findOne(idUsuario);

    if (!user || user.habilitado !== 'Si') {
      throw new NotFoundException('Usuario no habilitado');
    }

    if (user.tipoUsuario === 'Alumno') {
      throw new BadRequestException('El usuario ya es un alumno');
    }


    const requiredAlumnoFields: (keyof CreateAlumnoDto)[] = [
      'dni',
      'numeroTarjeta',
      'dniFrente',
      'dniFondo',
      'tramite',
      'tipoTarjeta',
    ];
    for (const field of requiredAlumnoFields) {
      if (!dto[field]) {
        throw new BadRequestException(`El campo ${field} del usuario tipo Alumno es obligatorio`);
      }
    }

    user.tipoUsuario = 'Alumno';
    await this.userRepo.save(user);

    const alumno = this.alumnoRepo.create({
      idAlumno: idUsuario,
      ...dto,
    });
    await this.alumnoRepo.save(alumno);

    return { message: 'Usuario actualizado a Alumno correctamente' };
  }

  

  
}