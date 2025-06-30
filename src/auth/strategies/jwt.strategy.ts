import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secreto',
    });
  }

  async validate(payload: any) {

    return {
      idUsuario: payload.idUsuario,
      nickname: payload.nickname,
      tipoUsuario: payload.tipoUsuario,
      email: payload.email,
    };
  }
}

