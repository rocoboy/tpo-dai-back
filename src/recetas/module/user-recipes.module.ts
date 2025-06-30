
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Receta } from '../entities/receta.entity';
import { Usuario } from 'src/users/entities/user.entity';
import { Favorito } from '../entities/favorites.entity';
import { UserRecipesService } from '../service/userRecipes.services';

@Module({
  imports: [TypeOrmModule.forFeature([Receta, Usuario, Favorito])],
  providers: [UserRecipesService],
  exports: [UserRecipesService],
})
export class UserRecipesModule {} 
