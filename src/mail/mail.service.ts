import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as path from 'path';
import * as fs from 'fs';
import * as handlebars from 'handlebars';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // 💡 Puedes cambiar a otro proveedor si lo necesitas
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }



  async sendEmailWithTemplate(to: string, subject: string, templateName: string, variables: Record<string, any>) {
    const filePath = path.join(process.cwd(), 'src', 'mail', 'templates', `${templateName}.html`);
    const templateSource = fs.readFileSync(filePath, 'utf8');
    const compiledTemplate = handlebars.compile(templateSource);
    const html = compiledTemplate(variables);

    const mailOptions = {
      from: `"TPO - Cursos de Cocina" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html, // usás html en lugar de text
    };

    console.log(`📩 Enviando email a: ${to} con template: ${templateName}`);

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email enviado con éxito: ${info.response}`);
    } catch (error) {
      console.error(`❌ Error enviando correo:`, error);
    }
  }


  async enviarMailInscripcion(destinatario: string, data: {
    nombreAlumno: string;
    nombreCurso: string;
    nombreSede: string;
    fechaInicio: string;
    fechaFin: string;
    horario: string;
    medioPago: string;
    precioFinal: string;
    requisitos: string;
    modalidad: string;
  }){
    if (!destinatario) {
      console.error('❌ No se puede enviar el mail: destinatario indefinido');
      throw new Error('Destinatario de correo no definido');
    }

    const templatePath = path.join(process.cwd(), 'src', 'mail', 'templates', 'inscripcion.html');
    let html = fs.readFileSync(templatePath, 'utf-8');

    Object.entries(data).forEach(([clave, valor]) => {
      html = html.replace(new RegExp(`{{${clave}}}`, 'g'), valor);
    });

    await this.transporter.sendMail({
      from: `"Escuela de Cocina" <${process.env.GMAIL_USER}>`,
      to: destinatario,
      subject: 'Confirmación de Inscripción al Curso',
      html,
    });
  }

}
