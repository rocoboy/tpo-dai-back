import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoReceta } from '../entities/tipo-receta.entity';
import { TiposRecetaController } from '../controller/tipos-receta.controller';
import { TiposRecetaService } from '../service/tipos-receta.services';

@Module({
  imports: [TypeOrmModule.forFeature([TipoReceta])],
  controllers: [TiposRecetaController],
  providers: [TiposRecetaService],
})
export class TiposRecetaModule {}
