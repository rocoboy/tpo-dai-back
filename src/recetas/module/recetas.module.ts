
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecetasController } from '../controller/recetas.controller';
import { RecipeService } from '../service/receta.services';
import {
    Receta,
    Foto,
    Paso,
    Multimedia,
    Utilizado,
    Ingrediente,
    Unidad,
    TipoReceta
  } from '../entities';

import { Usuario } from '../../users/entities/user.entity';
import { Calificacion } from '../entities/calificacion.entity';
import { Favorito } from '../entities/favorites.entity';
import { UserRecipesModule } from './user-recipes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Receta,
      Foto,
      Paso,
      Multimedia,
      Utilizado,
      Ingrediente,
      Unidad,
      TipoReceta,
      Usuario,
      Calificacion,
      Favorito,
      
    ]),
    UserRecipesModule
  ],
  controllers: [RecetasController],
  providers: [RecipeService],
})
export class RecetasModule {}