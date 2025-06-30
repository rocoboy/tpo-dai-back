import { Controller, Get, Param, Delete, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateAlumnoDto } from '../alumnos/dto/create-alumno.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }

  @Post('/upgrade/:id')
  upgradeToAlumno(@Param('id') idUsuario: number, @Body() dto: CreateAlumnoDto) {
    return this.usersService.upgradeToAlumno(idUsuario, dto);
  }
}


