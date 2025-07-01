import { Injectable, NotFoundException, BadRequestException, ForbiddenException, ConsoleLogger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Not, Repository} from 'typeorm';
import { Curso } from './entities/curso.entity';
import { Sede } from './entities/sede.entity';
import { CronogramaCurso } from './entities/cronograma-curso.entity';
import { Inscripcion } from './entities/inscripcion.entity';
import { AsistenciaCurso } from './entities/asistencia-curso.entity';
import { InscripcionCursoDto } from './dto/inscripcion-curso.dto';
import { BajaInscripcionDto } from './dto/baja-inscripcion.dto';
import { RegistrarAsistenciaDto } from './dto/registrar-asistencia.dto';
import { Alumno } from '../alumnos/entities/alumno.entity';
import { PagoAlumno } from './entities/pagosAlumno.entity';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class CursosService {
  constructor(
    @InjectRepository(Curso) private readonly cursoRepo: Repository<Curso>,
    @InjectRepository(CronogramaCurso) private readonly cronogramaRepo: Repository<CronogramaCurso>,
    @InjectRepository(Inscripcion) private readonly inscripcionRepo: Repository<Inscripcion>,
    @InjectRepository(AsistenciaCurso) private readonly asistenciaRepo: Repository<AsistenciaCurso>,
    @InjectRepository(Alumno) private readonly alumnoRepo: Repository<Alumno>,
    @InjectRepository(PagoAlumno) private readonly pagoRepo: Repository<PagoAlumno>,
    private readonly mailService: MailService,

  ) {}



  async getCursos() {
  const cursos = await this.cursoRepo.find({
    relations: ['cronogramas', 'cronogramas.sede', 'cronogramas.clases'],
    order: { nombre: 'ASC' }
  });

  return cursos
    .map(curso => {
      const cronogramasConVacantes = curso.cronogramas
        .filter(c => c.vacantesDisponibles > 0)
        .map(c => ({
          fechaInicio: c.fechaInicio.toISOString().split('T')[0],
          fechaFin: c.fechaFin.toISOString().split('T')[0],
          sede: c.sede.nombreSede,
          dias: c.dias,
          horario: c.horario,
          vacantes: c.vacantesDisponibles,
        }));

      return {
        idCurso: curso.idCurso,
        nombre: curso.nombre,
        modalidad: curso.modalidad,
        precio: curso.precio,
        cronogramas: cronogramasConVacantes,
      };
    })
    .filter(curso => curso.cronogramas.length > 0); 

    

  }

  async getCursoById(idCurso: string) {

    if (!idCurso) throw new BadRequestException('ID de curso es requerido');

    const curso = await this.cursoRepo.findOne({
      where: { idCurso },
      relations: ['cronogramas', 'cronogramas.sede', 'cronogramas.clases'],
    });

    if (!curso) throw new NotFoundException('Curso no encontrado');

    return {
      idCurso: curso.idCurso,
      nombre: curso.nombre,
      descripcion: curso.descripcion,
      contenidos: curso.contenidos,
      requisitos: curso.requisitos,
      duracion: curso.duracion,
      modalidad: curso.modalidad,
      precio: curso.precio,
      cronogramas: curso.cronogramas.map(c => ({
        idCronograma: c.idCronograma,
        sede: c.sede.nombreSede,
        fechaInicio: c.fechaInicio.toISOString().split('T')[0],
        fechaFin: c.fechaFin.toISOString().split('T')[0],
        dias: c.dias,
        horario: c.horario,
        vacantes: c.vacantesDisponibles,
        promocion: c.promocion,
        clases: c.clases.map(clase => ({
          idClase: clase.idClase,
          fecha: clase.fecha.toISOString().split('T')[0],
          horaInicio: clase.horaInicio,
          horaFin: clase.horaFin,
          tema: clase.tema,
        })),
      }))
    };
  }

  async inscribirse(dto: InscripcionCursoDto, idUsuario: number, usuario: any) {
    const alumno = await this.alumnoRepo.findOne({
      where: { idAlumno: idUsuario },
      relations: ['inscripciones'],
    });
    if (!alumno) throw new NotFoundException('Alumno no encontrado');

    const cronograma = await this.cronogramaRepo.findOne({
      where: { idCronograma: dto.idCronograma },
      relations: ['curso', 'inscripciones', 'sede'],
    });
    if (!cronograma) throw new NotFoundException('Cronograma no encontrado');

    if (typeof cronograma.vacantesDisponibles !== 'number') {
      throw new BadRequestException('El cronograma no tiene vacantes configuradas correctamente');
    }
    if (cronograma.vacantesDisponibles <= 0) {
      throw new BadRequestException('No hay vacantes disponibles');
    }

    const yaInscripto = await this.inscripcionRepo.findOne({
      where: {
        alumno: { idAlumno: alumno.idAlumno },
        cronograma: { idCronograma: dto.idCronograma },
        status: Not('baja'),
      },
    });
    if (yaInscripto) throw new BadRequestException('Ya estás inscripto en este curso');

    if (!alumno.numeroTarjeta || !alumno.dniFrente || !alumno.dniFondo || !alumno.tramite) {
      throw new BadRequestException('Debes tener los datos de alumno completos para inscribirte');
    }

    if (cronograma.curso.idCurso !== dto.idCurso) {
      throw new BadRequestException('El cronograma no corresponde al curso seleccionado');
    }

    await this.cronogramaRepo.decrement(
      { idCronograma: dto.idCronograma },
      'vacantesDisponibles',
      1
    );

    // Calcular monto con descuento
    let montoCurso = cronograma.curso.precio;
    if (cronograma.descuento && cronograma.descuento > 0) {
      montoCurso = parseFloat((montoCurso * (1 - cronograma.descuento / 100)).toFixed(2));
    }

    let medioPago: 'cuenta' | 'tarjeta';

    if (alumno.cuentaCorriente >= montoCurso) {
      alumno.cuentaCorriente -= montoCurso;
      medioPago = 'cuenta';
      await this.alumnoRepo.save(alumno);
    } else {
      medioPago = 'tarjeta';
    }

    const inscripcion = await this.inscripcionRepo.save(
      this.inscripcionRepo.create({
        alumno,
        cronograma,
        estadoPago: 'pagado',
        asistencia: false,
        status: 'activa',
      })
    );

    await this.pagoRepo.save({
      alumno: { idAlumno: alumno.idAlumno },
      inscripcion: { idInscripcion: inscripcion.idInscripcion },
      monto: montoCurso,
      tipo: 'pago',
      medioPago: medioPago,
      fecha: new Date(),
      descripcion: `Inscripción al curso ${cronograma.curso.nombre} - ${cronograma.sede.nombreSede}`,
    });
  
  await this.mailService.enviarMailInscripcion(usuario.email, {
    nombreAlumno: usuario.nickname,
    nombreCurso: cronograma.curso.nombre,
    nombreSede: cronograma.sede.nombreSede,
    fechaInicio: cronograma.fechaInicio.toISOString().split('T')[0],
    fechaFin: cronograma.fechaFin.toISOString().split('T')[0],
    horario: cronograma.horario,
    medioPago,
    precioFinal: Number(montoCurso).toFixed(2),
    requisitos: cronograma.curso.requisitos,
    modalidad: cronograma.curso.modalidad,
  });

    return inscripcion;
  }

  async bajaInscripcion(dto: BajaInscripcionDto, idUsuario: number) {
    const alumno = await this.alumnoRepo.findOne({
      where: { idAlumno: idUsuario },
      relations: ['inscripciones'],
    });
    if (!alumno) throw new NotFoundException('Alumno no encontrado');

    // Buscar la inscripción con datos relacionados
    const inscripcion = await this.inscripcionRepo.findOne({
      where: { idInscripcion: dto.idInscripcion },
      relations: ['alumno', 'cronograma', 'cronograma.curso', 'cronograma.sede'],
    });

    if (!inscripcion) throw new NotFoundException('Inscripción no encontrada');

    if (inscripcion.status === 'baja') {
      throw new BadRequestException('La inscripción ya se encuentra dada de baja');
    }

    // Validar que el alumno autenticado sea el dueño de la inscripción
    if (inscripcion.alumno.idAlumno !== alumno.idAlumno) {
      throw new ForbiddenException('No puedes dar de baja esta inscripción');
    }

    // Calcular reintegro según la fecha
    const hoy = new Date();
    const inicio = new Date(inscripcion.cronograma.fechaInicio);
    const diff = (inicio.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24); // días

    let reintegro = 0;
    if (diff > 10) reintegro = 1;
    else if (diff > 1) reintegro = 0.7;
    else if (diff >= 0) reintegro = 0.5;

    const precioCurso = parseFloat(inscripcion.cronograma.curso.precio as any);
    const montoReintegro = parseFloat((reintegro * precioCurso).toFixed(2));

    if (reintegro > 0) {
      // Sumar el reintegro a la cuenta corriente
      const cuentaActual = parseFloat(alumno.cuentaCorriente as any);
      alumno.cuentaCorriente = parseFloat((cuentaActual + montoReintegro).toFixed(2));
      await this.alumnoRepo.save(alumno);

      // Registrar pago como reintegro
      await this.pagoRepo.save(this.pagoRepo.create({
        alumno,
        inscripcion,
        monto: montoReintegro,
        tipo: 'reintegro',
        medioPago: null,
        descripcion: `Reintegro por baja de inscripción al curso ${inscripcion.cronograma.curso.nombre} - ${inscripcion.cronograma.sede.nombreSede}`,
      }));
    }

    // Sumar vacante
    inscripcion.cronograma.vacantesDisponibles += 1;
    await this.cronogramaRepo.save(inscripcion.cronograma);

    // Marcar inscripción como dada de baja
    inscripcion.status = 'baja';
    await this.inscripcionRepo.save(inscripcion);

    return {
      mensaje: `Baja exitosa. Reintegro: ${reintegro * 100}%`,
      reintegro,
      monto: montoReintegro,
    };
  }

  async studentCourses(idUser: number) {
    const alumno = await this.alumnoRepo.findOne({
      where: { idAlumno: idUser},
      relations: [
        'inscripciones',
        'inscripciones.cronograma',
        'inscripciones.cronograma.curso',
        'inscripciones.cronograma.sede',
        'inscripciones.cronograma.clases',
      ],
    });

    if (!alumno) throw new NotFoundException('Alumno no encontrado');

    return alumno.inscripciones
      .filter(inscripcion => inscripcion.status === 'activa' || inscripcion.status === 'finalizada')
      .map((inscripcion) => ({
        idInscripcion: inscripcion.idInscripcion,
        estadoPago: inscripcion.estadoPago,
        asistencia: inscripcion.asistencia,
        curso: {
          idCurso: inscripcion.cronograma.curso.idCurso,
          nombre: inscripcion.cronograma.curso.nombre,
          modalidad: inscripcion.cronograma.curso.modalidad,
          precio: inscripcion.cronograma.curso.precio,
        },
        cronograma: {
          idCronograma: inscripcion.cronograma.idCronograma,
          sede: inscripcion.cronograma.sede.nombreSede,
          fechaInicio: inscripcion.cronograma.fechaInicio.toISOString().split('T')[0],
          fechaFin: inscripcion.cronograma.fechaFin.toISOString().split('T')[0],
          horario: inscripcion.cronograma.horario,
          dias: inscripcion.cronograma.dias,
          clases: inscripcion.cronograma.clases.map(clase => ({
            idClase: clase.idClase,
            fecha: clase.fecha.toISOString().split('T')[0],
            horaInicio: clase.horaInicio,
            horaFin: clase.horaFin,
            tema: clase.tema,
          })),
        },
      }));

  }

  async registrarAsistencia(
    idCronograma: string,
    dto: RegistrarAsistenciaDto,
    idUsuario: number,
  ) {
    const hoy = new Date();

    const alumno = await this.alumnoRepo.findOne({
      where: { idAlumno: idUsuario },
      relations: ['inscripciones'],
    });
    if (!alumno) throw new NotFoundException('Alumno no encontrado');

    const inscripcion = await this.inscripcionRepo.findOne({
      where: {
        alumno: { idAlumno: idUsuario },
        cronograma: { idCronograma },
        status: 'activa',
      },
      relations: ['cronograma', 'cronograma.clases'],
    });
    if (!inscripcion) throw new NotFoundException('Inscripción no encontrada o inactiva');

    // 🔁 Ajuste de fecha a UTC-3
    const hoyArgentina = new Date(hoy.getTime() - 3 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const claseDeHoy = inscripcion.cronograma.clases.find(
      (c) => new Date(c.fecha.getTime() - 3 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0] === hoyArgentina
    );
    if (!claseDeHoy) throw new NotFoundException('No hay clase registrada para hoy');

    // 🔁 Ajuste de hora a UTC-3
    const ahoraLocal = (hoy.getUTCHours() - 3) + hoy.getUTCMinutes() / 60;

    const [hIni, mIni] = claseDeHoy.horaInicio.split(':').map(Number);
    const [hFin, mFin] = claseDeHoy.horaFin.split(':').map(Number);
    const horaInicioClase = hIni + mIni / 60;
    const horaFinClase = hFin + mFin / 60;
    const margen = 0.5;

    // 🧪 LOGS
    console.log('--- ASISTENCIA DEBUG ---');
    console.log('Fecha actual UTC:', hoy.toISOString());
    console.log('Fecha hoy Argentina:', hoyArgentina);
    console.log('Clase encontrada:', claseDeHoy.tema);
    console.log('Fecha clase ajustada:', new Date(claseDeHoy.fecha.getTime() - 3 * 60 * 60 * 1000).toISOString().split('T')[0]);
    console.log('horaInicioClase:', horaInicioClase);
    console.log('horaFinClase:', horaFinClase);
    console.log('ahoraLocal:', ahoraLocal);
    console.log('horaInicio (raw):', claseDeHoy.horaInicio);
    console.log('horaFin (raw):', claseDeHoy.horaFin);
    console.log('-------------------------');

    if (ahoraLocal < horaInicioClase) {
      throw new BadRequestException('La clase aún no comenzó');
    }
    if (ahoraLocal > horaFinClase + margen) {
      throw new BadRequestException('Ya pasó el horario permitido para registrar asistencia');
    }

    const startOfDay = new Date(hoy);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(hoy);
    endOfDay.setHours(23, 59, 59, 999);

    const yaAsistio = await this.asistenciaRepo.count({
      where: {
        inscripcion: { idInscripcion: inscripcion.idInscripcion },
        fecha: Between(startOfDay, endOfDay),
      },
    });
    if (yaAsistio > 0) {
      throw new BadRequestException('Ya registraste asistencia para esta clase');
    }

    const asistencia = this.asistenciaRepo.create({
      inscripcion: { idInscripcion: inscripcion.idInscripcion },
      fecha: hoy,
      presente: dto.presente,
    });
    await this.asistenciaRepo.save(asistencia);

    const clasesPasadas = inscripcion.cronograma.clases.filter(
      (c) => new Date(c.fecha) <= hoy
    );

    const asistenciasPresentes = await this.asistenciaRepo.count({
      where: {
        inscripcion: { idInscripcion: inscripcion.idInscripcion },
        presente: true,
      },
    });

    const porcentaje = clasesPasadas.length > 0
      ? (asistenciasPresentes / clasesPasadas.length) * 100
      : 0;

    if (porcentaje === 100) {
      inscripcion.asistencia = true;
      await this.inscripcionRepo.save(inscripcion);
    }

    const clasesOrdenadas = inscripcion.cronograma.clases
      .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

    const ultimaClase = clasesOrdenadas[clasesOrdenadas.length - 1];
    const esUltimaClaseHoy = new Date(ultimaClase.fecha.getTime() - 3 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0] === hoyArgentina;

    if (esUltimaClaseHoy && dto.presente) {
      inscripcion.status = 'finalizada';
      await this.inscripcionRepo.save(inscripcion);
    }

    return {
      mensaje: 'Asistencia registrada',
      porcentajeAsistencia: porcentaje.toFixed(2) + '%',
      asistencia,
    };
  }

  async historialAsistencias(idCronograma: string, idUsuario: number) {
    const inscripcion = await this.inscripcionRepo.findOne({
      where: {
        cronograma: { idCronograma },
        alumno: { idAlumno: idUsuario },
        status: 'activa',
      },
      relations: ['cronograma', 'cronograma.clases', 'asistencias'],
    });

    if (!inscripcion) {
      throw new NotFoundException('No estás inscripto a este curso');
    }

    // Ordenar las clases por fecha ascendente
    const clasesOrdenadas = [...inscripcion.cronograma.clases].sort(
      (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
    );

    return clasesOrdenadas.map((clase) => {
      const asistencia = inscripcion.asistencias.find(
        (a) => a.fecha.toISOString().split('T')[0] === clase.fecha.toISOString().split('T')[0]
      );

      return {
        fecha: clase.fecha.toISOString().split('T')[0],
        tema: clase.tema,
        horaInicio: clase.horaInicio,
        horaFin: clase.horaFin,
        presente: asistencia?.presente || false,
      };
    });
  }


} 