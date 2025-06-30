import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../users/entities/user.entity';
import { Alumno } from '../alumnos/entities/alumno.entity';
import { ValidationCode } from './entities/validation-code.entity';
import { LoginCode } from './entities/login-code.entity';
import { MailModule } from 'src/mail/mail.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';


@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario, Alumno, ValidationCode, LoginCode]),
    MailModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // ✅ Importamos PassportModule y lo configuramos para usar JWT como estrategia por defecto,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secreto',
      signOptions: { expiresIn: '1h' },
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // ✅ Agregamos JwtStrategy aquí
  exports: [AuthService, JwtModule, PassportModule], // ✅ exportamos JwtModule también
})
export class AuthModule {}
