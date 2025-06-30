// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { UsersModule } from './users/users.module';
import { AlumnosModule } from './alumnos/alumnos.module';
import { MailModule } from './mail/mail.module';
import { AuthModule } from './auth/auth.module';
import { RecetasModule } from './recetas/module/recetas.module';
import { Calificacion } from './recetas/entities/calificacion.entity';
import { CalificacionesModule } from './recetas/module/calificaciones.module';
import { CursosModule } from './cursos/cursos.module';
import { Unidad } from './recetas/entities';
import { UnidadesModule } from './recetas/module/unidades.module';
import { IngredientesModule } from './recetas/module/ingredientes.module';
import { TiposRecetaModule } from './recetas/module/tipos-receta.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    AlumnosModule,
    MailModule,
    AuthModule,
    RecetasModule,
    CalificacionesModule,
    CursosModule,
    UnidadesModule,
    IngredientesModule,
    TiposRecetaModule
  ],
})
export class AppModule {}
