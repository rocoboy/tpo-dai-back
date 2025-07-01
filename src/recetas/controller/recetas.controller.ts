import {
  Body,
  Controller,
  Post,
  Put,
  Req,
  UseGuards,
  Param,
  Patch,
  Get,
  Query,
  Delete,
} from '@nestjs/common';
import { RecipeService } from '../service/receta.services';
import { CreateRecetaDto } from '../dto/create-receta.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { FiltrarRecetasDto } from '../dto/filtrar-recetas.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { EscalarIngredienteDTO } from '../dto/escalar-ingrediente.dto';
import { EscalarPorcionesDTO } from '../dto/escalar-porciones.dto';
import { AddFavoritoDto } from '../dto/add-favorito.dto';
import { UserRecipesService } from '../service/userRecipes.services';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';

@ApiTags('Recetas')
@ApiBearerAuth()
@Controller('recipes')
export class RecetasController {
  constructor(
    private readonly recipeService: RecipeService,
    private readonly userRecipesService: UserRecipesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Crear una receta' })
  @ApiResponse({ status: 201, description: 'Receta creada correctamente y pendiente de aprobación.' })
  @ApiBody({ type: CreateRecetaDto })
  async createRecipe(@Body() dto: CreateRecetaDto, @Req() req: Request) {
    const userId = (req as any).user.idUsuario;
    return this.recipeService.createRecipe(dto, userId, "create");
  }


  @Get('all')
  @ApiOperation({ summary: 'Obtener todas las recetas aprobadas' })
  @ApiResponse({ status: 200, description: 'Listado de recetas aprobadas.' })
  async getAllRecipes() {
    return this.recipeService.getAllRecipes();
  }


  @Get('filter')
  @ApiOperation({ summary: 'Buscar recetas por filtros' })
  @ApiQuery({ name: 'nombre', required: false, description: 'Nombre parcial o completo de la receta' })
  @ApiQuery({ name: 'tipo', required: false, description: 'ID del tipo de receta' })
  @ApiQuery({ name: 'contieneIngrediente', required: false, description: 'Ingrediente que debe estar presente' })
  @ApiQuery({ name: 'sinIngrediente', required: false, description: 'Ingrediente que NO debe estar presente' })
  @ApiQuery({ name: 'autor', required: false, description: 'Autor de la receta' })
  @ApiResponse({ status: 200, description: 'Recetas filtradas.' })
  async getFilteredRecipes(@Query() filtro: FiltrarRecetasDto) {
    return this.recipeService.getFilteredRecipes(filtro);
  }

  @Get('trendings')
  @ApiOperation({ summary: 'Obtener las 3 recetas más populares' })
  @ApiResponse({ status: 200, description: 'Top 3 recetas por calificación.' })
  async getTrendingRecipes() {
    return this.recipeService.getTop3Recipes();
  }

  @UseGuards(JwtAuthGuard)
  @Get('myRecipes')
  @ApiOperation({ summary: 'Obtener recetas del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Listado de recetas del usuario.' })
  async getMyRecipes(@Req() req: Request) {
    const userId = (req as any).user.idUsuario;
    return this.userRecipesService.getRecipesByUserID(userId);
  }

  @Get('lasts')
  @ApiOperation({ summary: 'Obtener las 3 recetas más recientes' })
  @ApiResponse({ status: 200, description: 'Últimas 3 recetas cargadas.' })
  async getLast3Recipes() {
    return this.recipeService.getLast3Recipes();
  }

  @UseGuards(JwtAuthGuard)
  @Post('scaleByIngredient')
  @ApiOperation({ summary: 'Escalar receta por ingrediente' })
  @ApiBody({ type: EscalarIngredienteDTO })
  @ApiResponse({ status: 200, description: 'Ingredientes escalados.' })
  async scaleByIngredient(@Body() dto: EscalarIngredienteDTO) {
    return this.recipeService.scaleRecipeByIngredient(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('scale')
  @ApiOperation({ summary: 'Escalar receta por porciones' })
  @ApiBody({ type: EscalarPorcionesDTO })
  @ApiResponse({ status: 200, description: 'Ingredientes escalados por porciones.' })
  async scaleByPortion(@Body() dto: EscalarPorcionesDTO) {
    return this.recipeService.scaleRecipeByPortions(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('favorites')
  @ApiOperation({ summary: 'Obtener recetas favoritas del usuario' })
  @ApiResponse({ status: 200, description: 'Listado de recetas favoritas.' })
  async getFavorites(@Req() req: Request) {
    const userId = (req as any).user.idUsuario;
    return this.userRecipesService.getFavoriteRecipesByUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('favorites')
  @ApiOperation({ summary: 'Agregar receta a favoritos' })
  @ApiBody({ type: AddFavoritoDto })
  @ApiResponse({ status: 201, description: 'Receta agregada a favoritos.' })
  async addToFavorites(@Body() dto: AddFavoritoDto, @Req() req: Request) {
    const userId = (req as any).user.idUsuario;
    return this.userRecipesService.addToFavorites(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('favorites/:idReceta')
  @ApiOperation({ summary: 'Eliminar receta de favoritos' })
  @ApiParam({ name: 'idReceta', description: 'ID de la receta a eliminar de favoritos' })
  @ApiResponse({ status: 200, description: 'Receta eliminada de favoritos.' })
  async removeFromFavorites(@Param('idReceta') idReceta: string, @Req() req: Request) {
    const userId = (req as any).user.idUsuario;
    return this.userRecipesService.removeFromFavorites(userId, idReceta);
  }

  @Roles('Admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('approve/:idReceta')
  @ApiOperation({ summary: 'Aprobar receta (solo admin)' })
  @ApiParam({ name: 'idReceta', description: 'ID de la receta a aprobar' })
  @ApiResponse({ status: 200, description: 'Receta aprobada.' })
  async approveRecipe(@Param('idReceta') id: string) {
    return this.recipeService.approveRecipe(id);
  }

  @Roles('Admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('reject/:idReceta')
  @ApiOperation({ summary: 'Rechazar receta (solo admin)' })
  @ApiParam({ name: 'idReceta', description: 'ID de la receta a rechazar' })
  @ApiResponse({ status: 200, description: 'Receta rechazada.' })
  async rejectRecipe(@Param('idReceta') id: string) {
    return this.recipeService.rejectRecipe(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('replace/:id')
  @ApiOperation({ summary: 'Reemplazar receta existente del usuario' })
  @ApiParam({ name: 'id', description: 'ID de la receta a reemplazar' })
  @ApiResponse({ status: 200, description: 'Receta reemplazada exitosamente.' })
  async replaceRecipe(
    @Param('id') recipeId: string,
    @Req() req: Request,
    @Body() createDto: CreateRecetaDto
  ) {
    const userId = (req as any).user.idUsuario;
    await this.recipeService.replaceRecipe(recipeId, userId);
    return await this.recipeService.createRecipe(createDto, userId, "replace");
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar receta del usuario' })
  @ApiParam({ name: 'id', description: 'ID de la receta a eliminar' })
  @ApiResponse({ status: 200, description: 'Receta eliminada.' })
  async deleteRecipe(@Param('id') idReceta: string, @Req() req: Request) {
    const userId = (req as any).user.idUsuario;
    return this.recipeService.deleteRecipe(idReceta, userId);
  }


  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de receta por ID' })
  @ApiParam({ name: 'id', description: 'ID de la receta' })
  @ApiResponse({ status: 200, description: 'Detalle de la receta.' })
  async getRecipeById(@Param('id') recipeId: string) {
    return this.recipeService.getRecipeById(recipeId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Actualizar receta' })
  @ApiParam({ name: 'id', description: 'ID de la receta a actualizar' })
  @ApiResponse({ status: 200, description: 'Receta actualizada.' })
  async updateRecipe(@Param('id') idReceta: string, @Body() dto: CreateRecetaDto, @Req() req: Request) {
    const userId = (req as any).user.idUsuario;
    return this.recipeService.updateRecipe(idReceta, dto, userId);
  }
}


