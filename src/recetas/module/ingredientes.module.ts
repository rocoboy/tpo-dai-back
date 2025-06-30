import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ingrediente } from '../entities/ingrediente.entity';
import { IngredientesController } from '../controller/ingredientes.controller';
import { IngredientesService } from '../service/ingredientes.services';

@Module({
  imports: [TypeOrmModule.forFeature([Ingrediente])],
  controllers: [IngredientesController],
  providers: [IngredientesService],
})
export class IngredientesModule {}
