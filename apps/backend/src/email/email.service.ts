import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { User, Mission, Journey, Certificate } from '@prisma/client';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: parseInt(this.configService.get('SMTP_PORT') || '587'),
      secure: false,
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
  }

  async sendWelcome(user: User) {
    const html = this.getWelcomeTemplate(user.name);

    try {
      await this.transporter.sendMail({
        from: this.configService.get('EMAIL_FROM'),
        to: user.email,
        subject: '¡Bienvenido a Vibe Coding Academy!',
        html,
      });
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }
  }

  async sendMissionCompleted(
    user: User,
    mission: Mission,
    points: number,
    nextMissionTitle?: string,
  ) {
    const html = this.getMissionCompletedTemplate({
      userName: user.name,
      missionTitle: mission.title,
      missionNumber: mission.number,
      points,
      nextMissionTitle,
    });

    try {
      await this.transporter.sendMail({
        from: this.configService.get('EMAIL_FROM'),
        to: user.email,
        subject: `¡Misión ${mission.number} completada!`,
        html,
      });
    } catch (error) {
      console.error('Error sending mission completed email:', error);
    }
  }

  async sendCertificate(
    user: User,
    journey: Journey,
    certificate: Certificate,
    pdfBuffer: Buffer,
  ) {
    const html = this.getCertificateTemplate({
      userName: user.name,
      journeyName: journey.name,
      certificateNumber: certificate.certificateNumber,
      verificationCode: certificate.verificationCode,
    });

    try {
      await this.transporter.sendMail({
        from: this.configService.get('EMAIL_FROM'),
        to: user.email,
        subject: `¡Felicitaciones! Tu Certificado de ${journey.name}`,
        html,
        attachments: [
          {
            filename: `${certificate.certificateNumber}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf',
          },
        ],
      });
    } catch (error) {
      console.error('Error sending certificate email:', error);
    }
  }

  private getWelcomeTemplate(userName: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="font-family: 'Segoe UI', sans-serif; background: #f4f4f5; padding: 40px; margin: 0;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #0891b2, #06b6d4); padding: 40px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px;">¡Bienvenido a Vibe Coding Academy!</h1>
    </div>
    <div style="padding: 40px;">
      <p style="font-size: 18px; color: #374151;">
        ¡Hola <strong>${userName}</strong>!
      </p>
      <p style="color: #6b7280; line-height: 1.6;">
        Estamos emocionados de tenerte aquí. Estás a punto de comenzar un viaje
        increíble donde aprenderás a construir aplicaciones con IA.
      </p>
      <p style="color: #6b7280; line-height: 1.6;">
        <strong>Tu primera misión ya está desbloqueada.</strong> Prepárate para
        construir tu primer asistente IA en menos de lo que imaginas.
      </p>
      <div style="text-align: center; margin-top: 30px;">
        <a href="${this.configService.get('FRONTEND_URL')}/dashboard"
           style="background: linear-gradient(135deg, #0891b2, #06b6d4); color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
          Comenzar Primera Misión →
        </a>
      </div>
    </div>
    <div style="background: #f4f4f5; padding: 20px; text-align: center; color: #9ca3af; font-size: 14px;">
      Vibe Coding Academy - Aprende construyendo, no estudiando
    </div>
  </div>
</body>
</html>
    `;
  }

  private getMissionCompletedTemplate(data: {
    userName: string;
    missionTitle: string;
    missionNumber: number;
    points: number;
    nextMissionTitle?: string;
  }): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="font-family: 'Segoe UI', sans-serif; background: #f4f4f5; padding: 40px; margin: 0;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #10b981, #34d399); padding: 40px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px;">¡Misión Completada!</h1>
    </div>
    <div style="padding: 40px;">
      <p style="font-size: 18px; color: #374151;">
        ¡Felicidades <strong>${data.userName}</strong>!
      </p>
      <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 8px;">
        <h2 style="margin: 0; color: #10b981;">
          Misión ${data.missionNumber}: ${data.missionTitle}
        </h2>
      </div>
      <div style="text-align: center; margin: 30px 0;">
        <div style="font-size: 48px; font-weight: bold; color: #10b981;">+${data.points}</div>
        <div style="color: #6b7280;">Puntos ganados</div>
      </div>
      ${
        data.nextMissionTitle
          ? `
        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; text-align: center;">
          <p style="margin: 0; color: #92400e;">
            🚀 <strong>Siguiente misión desbloqueada:</strong><br>
            ${data.nextMissionTitle}
          </p>
        </div>
      `
          : ''
      }
      <div style="text-align: center; margin-top: 30px;">
        <a href="${this.configService.get('FRONTEND_URL')}/dashboard"
           style="background: linear-gradient(135deg, #10b981, #34d399); color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
          Continuar Aprendiendo →
        </a>
      </div>
    </div>
    <div style="background: #f4f4f5; padding: 20px; text-align: center; color: #9ca3af; font-size: 14px;">
      Vibe Coding Academy - Aprende construyendo, no estudiando
    </div>
  </div>
</body>
</html>
    `;
  }

  private getCertificateTemplate(data: {
    userName: string;
    journeyName: string;
    certificateNumber: string;
    verificationCode: string;
  }): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="font-family: 'Segoe UI', sans-serif; background: #f4f4f5; padding: 40px; margin: 0;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #f59e0b, #fbbf24); padding: 40px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px;">🏆 ¡Certificado Obtenido!</h1>
    </div>
    <div style="padding: 40px;">
      <p style="font-size: 18px; color: #374151;">
        ¡Increíble trabajo, <strong>${data.userName}</strong>!
      </p>
      <p style="color: #6b7280; line-height: 1.6;">
        Has completado todas las misiones del nivel <strong>${data.journeyName}</strong>
        y has obtenido tu certificado oficial.
      </p>
      <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; color: #92400e; font-size: 14px;">
          <strong>Certificado N°:</strong> ${data.certificateNumber}<br>
          <strong>Verificación:</strong> ${this.configService.get('FRONTEND_URL')}/verify/${data.verificationCode}
        </p>
      </div>
      <p style="color: #6b7280; line-height: 1.6;">
        Tu certificado en PDF está adjunto a este email. ¡Compártelo con orgullo!
      </p>
      <div style="text-align: center; margin-top: 30px;">
        <a href="${this.configService.get('FRONTEND_URL')}/certificates"
           style="background: linear-gradient(135deg, #f59e0b, #fbbf24); color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
          Ver Mis Certificados →
        </a>
      </div>
    </div>
    <div style="background: #f4f4f5; padding: 20px; text-align: center; color: #9ca3af; font-size: 14px;">
      Vibe Coding Academy - Aprende construyendo, no estudiando
    </div>
  </div>
</body>
</html>
    `;
  }
}
