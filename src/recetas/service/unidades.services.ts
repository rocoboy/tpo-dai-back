import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Unidad } from '../entities/unidad.entity';

@Injectable()
export class UnidadesService {
  constructor(
    @InjectRepository(Unidad)
    private readonly unidadRepository: Repository<Unidad>,
  ) {}

  findAll(): Promise<Unidad[]> {
    return this.unidadRepository.find();
  }
}