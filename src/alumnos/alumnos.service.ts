import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alumno } from './entities/alumno.entity';
import { PagoAlumno } from '../cursos/entities/pagosAlumno.entity';
import { CreateAlumnoDto } from './dto/create-alumno.dto';

@Injectable()
export class AlumnosService {
constructor(
  @InjectRepository(Alumno)
  private alumnoRepo: Repository<Alumno>,
  @InjectRepository(PagoAlumno)
  private pagoRepo: Repository<PagoAlumno>
) {}

  findAll() {
    return this.alumnoRepo.find({ relations: ['usuario'] });
  }

  findOne(id: number) {
    return this.alumnoRepo.findOne({ where: { idAlumno: id }, relations: ['usuario'] });
  }

  async create(idUsuario: number, dto: CreateAlumnoDto) {
    const alumno = this.alumnoRepo.create({
      ...dto,
      idAlumno: idUsuario,
    });
    return this.alumnoRepo.save(alumno);
  }

  async update(id: number, dto: CreateAlumnoDto) {
    const alumno = await this.findOne(id);
    const requiredAlumnoFields = ['dni', 'numeroTarjeta', 'tramite', 'dniFrente', 'dniFondo'];
    for (const field of requiredAlumnoFields) {
      if (!dto[field]) {
        throw new NotFoundException(`El campo ${field} es obligatorio`);
      }
    }
    if (!alumno) throw new NotFoundException('Alumno no encontrado');
    const updatedAlumno = this.alumnoRepo.merge(alumno, dto);
    return this.alumnoRepo.save(updatedAlumno);
  }

  async getProfile(id: number) {
    const alumno = await this.findOne(id);
    if (!alumno) throw new NotFoundException('Alumno no encontrado');
    return {
      idAlumno: alumno.idAlumno,
      medioPago: {
        nroTarjeta: alumno.numeroTarjeta,
        dni: alumno.dni,
        nroTramite: alumno.tramite,
        dniFrente: alumno.dniFrente,
        dniReverso: alumno.dniFondo
      },
      cuentaCorriente: alumno.cuentaCorriente,
    };
  }

  

  async remove(id: number) {
    const alumno = await this.findOne(id);
    if (!alumno) throw new NotFoundException('Alumno no encontrado');
    return this.alumnoRepo.remove(alumno);
  }

  async estadoCuenta(idUser: number) {
    const alumno = await this.alumnoRepo.findOneBy({ idAlumno: idUser });
    if (!alumno) throw new NotFoundException('Alumno no encontrado');
    return { cuentaCorriente: alumno.cuentaCorriente };
  }  
  async pagosRealizados(idUser: number) {
    const pagos = await this.pagoRepo.find({
      where: { alumno: { idAlumno : idUser} },
      order: { fecha: 'DESC' },
    });

    return pagos.map(pago => ({
      idPago: pago.idPago,
      fecha: pago.fecha.toISOString().split('T')[0],
      monto: pago.monto,
      tipo: pago.tipo,
      medioPago: pago.medioPago,
      descripcion: pago.descripcion,
    }));
  }
}