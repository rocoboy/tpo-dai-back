import { Controller, Get, UseGuards } from '@nestjs/common';
import { TiposRecetaService } from '../service/tipos-receta.services';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Complementarios de Recetas')
@Controller('recipeTypes')
export class TiposRecetaController {
  constructor(private readonly tiposRecetaService: TiposRecetaService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los tipos de receta' })
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.tiposRecetaService.findAll();
  }
}