import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { v4 as uuidv4 } from 'uuid';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CertificatesService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => EmailService))
    private emailService: EmailService,
  ) {}

  async getUserCertificates(userId: string) {
    return this.prisma.certificate.findMany({
      where: { userId },
      orderBy: { issuedAt: 'desc' },
    });
  }

  async getCertificateById(id: string, userId: string) {
    const certificate = await this.prisma.certificate.findFirst({
      where: { id, userId },
    });

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    return certificate;
  }

  async generateCertificate(userId: string, journeyId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const journey = await this.prisma.journey.findUnique({
      where: { id: journeyId },
    });

    if (!user || !journey) {
      throw new NotFoundException('User or journey not found');
    }

    // Check if certificate already exists
    const existing = await this.prisma.certificate.findFirst({
      where: { userId, journeyId },
    });

    if (existing) {
      return existing;
    }

    const certificateNumber = await this.generateCertNumber();
    const verificationCode = uuidv4();

    // Get completed missions count
    const completedMissions = await this.prisma.missionProgress.count({
      where: {
        userId,
        mission: { journeyId },
        status: 'completed',
      },
    });

    // Generate PDF
    const pdfBuffer = await this.generatePDF({
      recipientName: user.name,
      recipientEmail: user.email,
      journeyName: journey.name,
      journeyTitle: journey.title,
      certificateNumber,
      verificationCode,
      issueDate: new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      completedMissions,
      totalPoints: user.totalPoints,
    });

    // Save PDF
    const pdfDir = path.join(process.cwd(), 'certificates');
    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, { recursive: true });
    }
    const pdfPath = path.join(pdfDir, `${certificateNumber}.pdf`);
    fs.writeFileSync(pdfPath, pdfBuffer);

    // Create certificate record
    const certificate = await this.prisma.certificate.create({
      data: {
        userId,
        journeyId,
        certificateNumber,
        verificationCode,
        pdfUrl: `/certificates/${certificateNumber}.pdf`,
      },
    });

    // Add bonus points
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        totalPoints: { increment: 500 },
        currentJourney: { increment: 1 },
      },
    });

    // Send email with certificate
    await this.emailService.sendCertificate(user, journey, certificate, pdfBuffer);

    return certificate;
  }

  async verifyCertificate(code: string) {
    const certificate = await this.prisma.certificate.findUnique({
      where: { verificationCode: code },
      include: {
        user: true,
      },
    });

    if (!certificate) {
      return {
        valid: false,
        message: 'Certificado no encontrado',
      };
    }

    const journey = await this.prisma.journey.findUnique({
      where: { id: certificate.journeyId },
    });

    return {
      valid: true,
      certificate: {
        ...certificate,
        userName: certificate.user.name,
        userEmail: certificate.user.email,
        journeyName: journey?.name,
        journeyTitle: journey?.title,
      },
    };
  }

  private async generateCertNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.prisma.certificate.count();
    return `VCA-${year}-${String(count + 1).padStart(5, '0')}`;
  }

  private async generatePDF(data: {
    recipientName: string;
    recipientEmail: string;
    journeyName: string;
    journeyTitle: string;
    certificateNumber: string;
    verificationCode: string;
    issueDate: string;
    completedMissions: number;
    totalPoints: number;
  }): Promise<Buffer> {
    const html = this.getCertificateHTML(data);

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      landscape: true,
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    await browser.close();

    return Buffer.from(pdfBuffer);
  }

  private getCertificateHTML(data: {
    recipientName: string;
    journeyName: string;
    journeyTitle: string;
    certificateNumber: string;
    verificationCode: string;
    issueDate: string;
    completedMissions: number;
    totalPoints: number;
  }): string {
    const journeyColor =
      data.journeyName === 'Básico'
        ? '#0891b2'
        : data.journeyName === 'Intermedio'
          ? '#7c3aed'
          : '#f59e0b';

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Georgia', serif;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      width: 297mm;
      height: 210mm;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .certificate {
      width: 277mm;
      height: 190mm;
      background: white;
      border: 3px solid ${journeyColor};
      border-radius: 16px;
      padding: 30px;
      position: relative;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 20px;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: ${journeyColor};
      margin-bottom: 10px;
    }
    .title {
      font-size: 36px;
      color: #1e293b;
      margin-bottom: 5px;
    }
    .subtitle {
      font-size: 16px;
      color: #64748b;
    }
    .content {
      text-align: center;
      margin: 30px 0;
    }
    .certifies {
      font-size: 14px;
      color: #64748b;
      margin-bottom: 10px;
    }
    .name {
      font-size: 42px;
      color: #1e293b;
      font-style: italic;
      margin-bottom: 20px;
    }
    .completed {
      font-size: 14px;
      color: #64748b;
      margin-bottom: 10px;
    }
    .program {
      display: inline-block;
      background: linear-gradient(135deg, ${journeyColor}, ${journeyColor}dd);
      color: white;
      padding: 15px 40px;
      border-radius: 8px;
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .level {
      font-size: 16px;
      color: ${journeyColor};
      font-weight: bold;
    }
    .stats {
      display: flex;
      justify-content: center;
      gap: 60px;
      margin: 25px 0;
    }
    .stat {
      text-align: center;
    }
    .stat-value {
      font-size: 28px;
      font-weight: bold;
      color: ${journeyColor};
    }
    .stat-label {
      font-size: 12px;
      color: #64748b;
    }
    .date {
      text-align: center;
      font-size: 14px;
      color: #64748b;
      margin-top: 20px;
    }
    .footer {
      position: absolute;
      bottom: 25px;
      left: 30px;
      right: 30px;
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      color: #94a3b8;
    }
    .verify {
      text-align: right;
    }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="header">
      <div class="logo">VIBE CODING ACADEMY</div>
      <div class="title">Certificado de Finalización</div>
      <div class="subtitle">Programa de Formación Profesional</div>
    </div>

    <div class="content">
      <div class="certifies">Se certifica que</div>
      <div class="name">${data.recipientName}</div>
      <div class="completed">ha completado satisfactoriamente el programa</div>
      <div class="program">${data.journeyTitle}</div>
      <div class="level">Nivel ${data.journeyName}</div>
    </div>

    <div class="stats">
      <div class="stat">
        <div class="stat-value">${data.completedMissions}</div>
        <div class="stat-label">Misiones Completadas</div>
      </div>
      <div class="stat">
        <div class="stat-value">${data.totalPoints}</div>
        <div class="stat-label">Puntos Obtenidos</div>
      </div>
    </div>

    <div class="date">
      Fecha de emisión: ${data.issueDate}
    </div>

    <div class="footer">
      <div>Certificado N°: ${data.certificateNumber}</div>
      <div class="verify">Verificar en: vibecoding.academy/verify/${data.verificationCode}</div>
    </div>
  </div>
</body>
</html>
    `;
  }
}
