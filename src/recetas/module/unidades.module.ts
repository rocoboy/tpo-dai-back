import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Unidad } from '../entities/unidad.entity';
import { UnidadesController } from '../controller/unidades.controller';
import { UnidadesService } from '../service/unidades.services';

@Module({
  imports: [TypeOrmModule.forFeature([Unidad])],
  controllers: [UnidadesController],
  providers: [UnidadesService],
})
export class UnidadesModule {}
