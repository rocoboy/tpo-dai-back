import { Controller, Get, UseGuards } from '@nestjs/common';
import { UnidadesService } from '../service/unidades.services';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Complementarios de Recetas')
@Controller('units')
export class UnidadesController {
  constructor(private readonly unidadesService: UnidadesService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las unidades de medida' })
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.unidadesService.findAll();
  }
}
