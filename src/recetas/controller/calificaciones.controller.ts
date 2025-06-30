import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Patch,
  Put,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CalificationService } from '../service/calificaciones.services';
import { CreateCalificacionDto } from '../dto/create-calificacion.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Calificaciones')
@ApiBearerAuth()
@Controller('ratings')
export class CalificacionesController {
  constructor(private readonly calificationService: CalificationService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Valorar una receta' })
  @ApiBody({ type: CreateCalificacionDto })
  @ApiResponse({ status: 201, description: 'Calificación creada correctamente.' })
  async rateRecipe(
    @Body() dto: CreateCalificacionDto,
    @Req() req: Request
  ) {
    const userId = (req as any).user.idUsuario;
    return this.calificationService.rateRecipe(dto, userId);
  }

  @Get('recipe/:recipeId')
  @ApiOperation({ summary: 'Obtener calificaciones de una receta' })
  @ApiParam({ name: 'recipeId', description: 'ID de la receta' })
  @ApiResponse({ status: 200, description: 'Listado de calificaciones.' })
  async getRatingsByRecipe(@Param('recipeId') recipeId: string) {
    return this.calificationService.getRatingsByRecipe(recipeId);
  }

  @Patch('approve/:ratingId')
  @Roles('Admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Aprobar calificación (solo admin)' })
  @ApiParam({ name: 'ratingId', description: 'ID de la calificación a aprobar' })
  @ApiResponse({ status: 200, description: 'Calificación aprobada.' })
  async approveRating(@Param('ratingId') ratingId: string) {
    return this.calificationService.approveRating(ratingId);
  }

  @Patch('reject/:ratingId')
  @Roles('Admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Rechazar calificación (solo admin)' })
  @ApiParam({ name: 'ratingId', description: 'ID de la calificación a rechazar' })
  @ApiResponse({ status: 200, description: 'Calificación rechazada.' })
  async rejectRating(@Param('ratingId') ratingId: string) {
    return this.calificationService.rejectRating(ratingId);
  }

  @Put(':ratingId')
  @ApiOperation({ summary: 'Actualizar calificación' })
  @ApiParam({ name: 'ratingId', description: 'ID de la calificación a actualizar' })
  @ApiBody({ type: CreateCalificacionDto })
  @ApiResponse({ status: 200, description: 'Calificación actualizada.' })
  async updateRating(
    @Param('ratingId') ratingId: string,
    @Body() dto: CreateCalificacionDto
  ) {
    return this.calificationService.updateRating(ratingId, dto);
  }

  @Delete(':ratingId')
  @ApiOperation({ summary: 'Eliminar calificación' })
  @ApiParam({ name: 'ratingId', description: 'ID de la calificación a eliminar' })
  @ApiResponse({ status: 200, description: 'Calificación eliminada.' })
  async deleteRating(@Param('ratingId') ratingId: string) {
    return this.calificationService.deleteRating(ratingId);
  }
}
