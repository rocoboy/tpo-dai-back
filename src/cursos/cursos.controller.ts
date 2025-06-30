import { Controller, Post, Body, Get, Param, Req, UseGuards, Delete } from '@nestjs/common';
import { CursosService } from './cursos.service';
import { InscripcionCursoDto } from './dto/inscripcion-curso.dto';
import { BajaInscripcionDto } from './dto/baja-inscripcion.dto';
import { RegistrarAsistenciaDto } from './dto/registrar-asistencia.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { get } from 'http';


@ApiTags('courses')
@ApiBearerAuth()
@Controller('courses')
export class CursosController {
  constructor(private readonly cursosService: CursosService) {}

  // GET - Todos los cursos
  @Get()
  @ApiOperation({ summary: 'Listar cursos' })
  listarCursos() {
    return this.cursosService.getCursos();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Alumno')
  @Get('myCourses')
  @ApiOperation({ summary: 'Ver cursos inscriptos del alumno' })
  cursosInscriptos(@Req() req) {
    const idAlumno = req.user.idUsuario;
    return this.cursosService.studentCourses(idAlumno);
  }

  @Get(':idCronograma/attendance')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Alumno')
  @ApiOperation({ summary: 'Ver asistencia del alumno a un curso' })
  @ApiParam({ name: 'idCronograma', description: 'ID del cronograma del curso' })
  @ApiResponse({ status: 200, description: 'Asistencia encontrada' })
  asistenciaCurso(
    @Param('idCronograma') idCronograma: string,
    @Req() req: any
  ) {
    const idUsuario = req.user.idUsuario;
    return this.cursosService.historialAsistencias(idCronograma, idUsuario);
  }

  // GET - Curso por ID (detalle completo)
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener curso por ID (detalle completo)' })
  @ApiParam({ name: 'id', description: 'ID del curso' })
  @ApiResponse({ status: 200, description: 'Curso encontrado' })
  obtenerCursoPorId(@Param('id') id: string) {
    return this.cursosService.getCursoById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Alumno')
  @Post(':id/enroll')
  @ApiOperation({ summary: 'Inscribirse a un curso' })
  @ApiBody({ type: InscripcionCursoDto })
  inscribirse(
    @Param('id') idCurso: string,
    @Body() dto: InscripcionCursoDto,
    @Req() req
  ) {
    const idAlumno = req.user.idUsuario;
    dto.idCurso = idCurso;
    return this.cursosService.inscribirse(dto,idAlumno, req.user);
  }

  // POST - Baja de inscripción
  @Post(':idInscripcion/unenroll')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Alumno')
  bajaInscripcion(
    @Param('idInscripcion') idInscripcion: string,
    @Req() req
  ) {
    return this.cursosService.bajaInscripcion({ idInscripcion }, req.user.idUsuario);
  }


  // POST - Registrar asistencia
  @Post(':idCronograma/attendance')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Alumno')
  registrarAsistencia(
    @Param('idCronograma') idCronograma: string,
    @Body() dto: RegistrarAsistenciaDto,
    @Req() req: any
  ) {
    const idUsuario = req.user.idUsuario;
    return this.cursosService.registrarAsistencia(idCronograma, dto, idUsuario);
  }




} 