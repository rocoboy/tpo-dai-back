// ingredientes.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { IngredientesService } from '../service/ingredientes.services';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Complementarios de Recetas')
@Controller('ingredients')
export class IngredientesController {
  constructor(private readonly ingredientesService: IngredientesService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los ingredientes' })
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.ingredientesService.findAll();
  }
}