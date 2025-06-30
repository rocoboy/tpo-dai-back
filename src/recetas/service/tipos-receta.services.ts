import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoReceta } from '../entities/tipo-receta.entity';

@Injectable()
export class TiposRecetaService {
  constructor(
    @InjectRepository(TipoReceta)
    private readonly tipoRecetaRepository: Repository<TipoReceta>,
  ) {}

  findAll(): Promise<TipoReceta[]> {
    return this.tipoRecetaRepository.find();
  }
}