import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../users/entities/user.entity';
import { Alumno } from '../alumnos/entities/alumno.entity';
import { ValidationCode } from './entities/validation-code.entity';
import { LoginCode } from './entities/login-code.entity';
import { RegisterInitDTO } from './dto/register.dto';
import { ValidateDTO } from './dto/validate-account';
import { RecoverPasswordDto } from './dto/recover-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CreateAlumnoDto } from '../alumnos/dto/create-alumno.dto';
import { MailService } from 'src/mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO } from './dto/login-dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario) private userRepo: Repository<Usuario>,
    @InjectRepository(Alumno) private alumnoRepo: Repository<Alumno>,
    @InjectRepository(ValidationCode)
    private validationRepo: Repository<ValidationCode>,
    @InjectRepository(LoginCode)
    private loginRepo: Repository<LoginCode>,
    private jwtRepo: JwtService,
    private mailRepo: MailService,
  ) {}


  async registerAlumno(idUsuario: number, alumnoData: CreateAlumnoDto) {
    const user = await this.userRepo.findOne({
      where: { idUsuario },
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    if (user.habilitado === 'No') {
      throw new BadRequestException('Usuario no validado');
    }

    const existingAlumno = await this.alumnoRepo.findOne({
      where: { idAlumno: idUsuario },
    });

    if (existingAlumno) {
      throw new BadRequestException('Este usuario ya tiene datos de alumno cargados');
    }

    const requiredAlumnoFields: (keyof CreateAlumnoDto)[] = [
      'dni',
      'numeroTarjeta',
      'dniFrente',
      'dniFondo',
      'tramite',
      'tipoTarjeta',
    ];

    for (const field of requiredAlumnoFields) {
      if (!alumnoData[field]) {
        throw new BadRequestException(`El campo ${field} del usuario tipo Alumno es obligatorio`);
      }
    }

    const alumno = this.alumnoRepo.create({
      idAlumno: idUsuario,
      ...alumnoData,
    });
    await this.alumnoRepo.save(alumno);

    // ⚠️ Asegurarse que se actualice y guarde
    user.tipoUsuario = 'Alumno';

    try {
      await this.userRepo.save(user);
    } catch (error) {
      console.error('Error al guardar el usuario como alumno:', error);
      throw new InternalServerErrorException('Error al actualizar el perfil del usuario');
    }

    return { message: 'Datos de alumno guardados correctamente' };
  }

  async registerInit(dto: RegisterInitDTO) {
    const requiredFields = ['mail', 'nickname', 'tipoUsuario'];
    for (const field of requiredFields) {
      if (!dto[field]) {
        throw new BadRequestException(`El campo ${field} es obligatorio`);
      }
    }

    const existsEmail = await this.userRepo.findOne({
      where: { mail: dto.mail },
    });
    if (existsEmail) throw new BadRequestException('Email ya registrado');

    const existsNickname = await this.userRepo.findOne({
      where: { nickname: dto.nickname },
    });
    if (existsNickname) {
      const suggestions = await this.suggestAlias(dto.nickname);
      throw new BadRequestException(
        `Alias ya registrado. Sugerencias: ${suggestions.join(', ')}`,
      );
    }


    const user = this.userRepo.create({
      mail: dto.mail,
      nickname: dto.nickname,
      tipoUsuario: 'Usuario',
      habilitado: 'No',
    });
    await this.userRepo.save(user);
    console.log('🆕 Usuario creado con ID:', user.idUsuario);

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiration = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const record = this.validationRepo.create({
      email: dto.mail,
      alias: dto.nickname,
      code,
      expiration,
      used: false,
    });

    await this.validationRepo.save(record);
    await this.mailRepo.sendEmailWithTemplate(
      dto.mail,
      'Confirmación de registro – Cursos de Cocina',
      'validacion-cuenta',
      { alias: dto.nickname, code }
    );


    return {
      message: 'Código enviado al email',
      code,
      idUsuario: user.idUsuario,
    };
  }

  async validate(dto: ValidateDTO) {
    const requiredFields = ['code', 'username', 'password'];
    for (const field of requiredFields) {
      if (!dto[field]) {
        throw new BadRequestException(`El campo ${field} es obligatorio`);
      }
    }

    const record = await this.validationRepo.findOne({
      where: { code: dto.code, used: false },
    });

    const invalidPasswordPattern = /[^a-zA-Z0-9!@#$%^&*()_+]/;
    if (invalidPasswordPattern.test(dto.password)) {
      throw new BadRequestException('La contraseña contiene caracteres inválidos');
    }

    if (dto.password.length < 6) {
      throw new BadRequestException('La contraseña debe tener al menos 6 caracteres');
    }

    if (!record) {
      throw new BadRequestException('Código inválido');
    }

    if (record.expiration < new Date()) {
      throw new BadRequestException('El código ha vencido. Por favor, comuníquese con la administración para continuar el proceso.');
    }

    const user = await this.userRepo.findOne({
      where: [
        { mail: dto.username },
        { nickname: dto.username },
      ],
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    if (user.mail !== dto.username && user.nickname !== dto.username) {
      throw new BadRequestException('El usuario no coincide con el código proporcionado');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10); // 🔐 Hasheo seguro

    user.habilitado = 'Si';
    user.password = hashedPassword;
    await this.userRepo.save(user);

    record.used = true;
    await this.validationRepo.save(record);

    return {
      message: 'Cuenta validada exitosamente',
      idUsuario: user.idUsuario,
      tipoUsuario: user.tipoUsuario,
    };
  }

  async recoverPassword(dto: RecoverPasswordDto) {
    console.log('📨 Iniciando recuperación para:', dto.mail);

    const user = await this.userRepo.findOne({ where: { mail: dto.mail } });
    if (!user) {
      console.log('❌ Usuario no encontrado');
      throw new NotFoundException('Usuario no encontrado');
    }

    if (user.habilitado === 'No') {
      console.log('⚠️ Usuario no validado');
      throw new BadRequestException('Usuario no validado');
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiration = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos

    const reset = this.loginRepo.create({
      email: dto.mail,
      code,
      expiration,
      used: false,
    });

    console.log('🧪 Código generado:', reset);

    try {
      await this.loginRepo.save(reset);
      console.log('✅ Código guardado en DB');
    } catch (error) {
      console.error('❌ Error al guardar en DB:', error);
      throw new BadRequestException('Error al guardar el código de recuperación');
    }

    try {
      await this.mailRepo.sendEmailWithTemplate(
        dto.mail,
        'Recuperación de contraseña – Cursos de Cocina',
        'recuperar-clave',
        { alias: user.nickname, code }
      );
      console.log('📧 Mail enviado con HTML');
    } catch (error) {
      console.error('❌ Error al enviar el email:', error);
    }

    return { message: 'Código de reinicio enviado', code };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const record = await this.loginRepo.findOne({
      where: { code: dto.code, used: false },
    });

    if (!record) {
      throw new BadRequestException('El código ingresado no es válido.');
    }

    if (record.expiration < new Date()) {
      throw new BadRequestException('El código ha vencido. Solicite uno nuevo para continuar.');
    }

    const user = await this.userRepo.findOne({
      where: { mail: record.email, habilitado: 'Si' },
    });

    if (!user) {
      throw new NotFoundException('No se encontró un usuario habilitado con ese email.');
    }

    const invalidPasswordPattern = /[^a-zA-Z0-9!@#$%^&*()_+]/;
    if (invalidPasswordPattern.test(dto.newPassword)) {
      throw new BadRequestException('La contraseña contiene caracteres inválidos');
    }

    if (dto.newPassword.length < 6) {
      throw new BadRequestException('La contraseña debe tener al menos 6 caracteres');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10); // 🔐 Encriptación segura
    user.password = hashedPassword;

    await this.userRepo.save(user);

    record.used = true;
    await this.loginRepo.save(record);

    return { message: 'Contraseña actualizada correctamente' };
  }

  async suggestAlias(baseAlias: string): Promise<string[]> {
    const suggestions: string[] = [];
    for (let i = 0; i < 10; i++) {
      const suggestion = `${baseAlias}${Math.floor(Math.random() * 1000)}`;
      const exists = await this.userRepo.findOne({
        where: { nickname: suggestion },
      });
      if (!exists) suggestions.push(suggestion);
      if (suggestions.length >= 5) break;
    }
    return suggestions;
  }

  async login(dto: LoginDTO) {
    if (!dto.username) {
      throw new BadRequestException('Debe ingresar un nombre de usuario');
    }

    const user = await this.userRepo.findOne({
      where: [
        { mail: dto.username },
        { nickname: dto.username },
      ],
    });

    if (!user) {
      throw new BadRequestException('Credenciales inválidas o usuario no validado');
    }

    if (user.habilitado === 'No') {
      throw new BadRequestException({
        validated: false,
        message: 'El correo utilizado corresponde a una cuenta no validada',
      });
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Credenciales inválidas o usuario no validado');
    }

    const payload = {
      idUsuario: user.idUsuario,
      nickname: user.nickname,
      tipoUsuario: user.tipoUsuario,
      email: user.mail,
    };

    const token = await this.jwtRepo.signAsync(payload);

    return {
      access_token: token,
      user: {
        id: user.idUsuario,
        nickname: user.nickname,
        tipoUsuario: user.tipoUsuario,
        mail: user.mail,
      },
    };
  }
}
