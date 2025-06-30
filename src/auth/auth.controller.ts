import { Controller, Post, Body, Get, Param} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterInitDTO } from './dto/register.dto';
import { ValidateDTO } from './dto/validate-account';
import { RecoverPasswordDto } from './dto/recover-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { LoginDTO } from './dto/login-dto';
import { CreateAlumnoDto } from './dto/create-alumno.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  registerInit(@Body() dto: RegisterInitDTO) {
    return this.authService.registerInit(dto);
  }

  @Post('register-alumno/:idUsuario')
  registerAlumno(
    @Param('idUsuario') idUsuario: number,
    @Body() dto: CreateAlumnoDto) {
    return this.authService.registerAlumno(idUsuario, dto);
  }

  @Post('validate')
  validate(@Body() dto: ValidateDTO) {
    return this.authService.validate(dto);
  }


  @Post('login')
  login(@Body() dto: LoginDTO) {
    return this.authService.login(dto);
  }

  @Post('recover-password')
  recoverPassword(@Body() dto: RecoverPasswordDto) {
    return this.authService.recoverPassword(dto);
  }

  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Get('suggest-alias/:alias')
  suggestAlias(@Param('alias') alias: string) {
    return this.authService.suggestAlias(alias);
  }
}