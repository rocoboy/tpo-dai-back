// src/alumnos/alumnos.controller.ts
import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  Req,
  Body,
  Put,
} from '@nestjs/common';
import { AlumnosService } from './alumnos.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateAlumnoDto } from './dto/create-alumno.dto';

@ApiTags('alumnos')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Alumno')
@ApiBearerAuth()
@Controller('alumnos')
export class AlumnosController {
  constructor(private readonly alumnosService: AlumnosService) {}


  @Get('profile')
  @ApiOperation({ summary: 'Datos del alumno autenticado' })
  profile(@Req() req) {
    const idAlumno = req.user.idUsuario;
    return this.alumnosService.getProfile(idAlumno);
  }

  @Put('updateProfile')
  @ApiOperation({ summary: 'Actualizar datos del alumno autenticado' })
  updateProfile(@Req() req, @Body() dto: CreateAlumnoDto) {
    const idAlumno = req.user.idUsuario;
    return this.alumnosService.update(idAlumno, dto);
  }
  
  @Get('account-status')
  @ApiOperation({ summary: 'Ver estado de cuenta corriente del alumno autenticado' })
  estadoCuenta(@Req() req) {
    const idUsuario = req.user.idUsuario;
    return this.alumnosService.estadoCuenta(idUsuario);
  }


  @Get('payments')
  @ApiOperation({ summary: 'Ver pagos realizados por el alumno autenticado' })
  misPagos(@Req() req) {
    const idAlumno = req.user.idUsuario;
    return this.alumnosService.pagosRealizados(idAlumno);
  }

}
