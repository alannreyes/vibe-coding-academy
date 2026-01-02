import {
  Controller,
  Get,
  Param,
  Res,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Response } from 'express';
import { CertificatesService } from './certificates.service';
import { FirebaseGuard } from '../auth/firebase.guard';
import * as fs from 'fs';
import * as path from 'path';

@Controller('certificates')
export class CertificatesController {
  constructor(private certificatesService: CertificatesService) {}

  @Get()
  @UseGuards(FirebaseGuard)
  async getUserCertificates(@Request() req: any) {
    return this.certificatesService.getUserCertificates(req.user.id);
  }

  @Get(':id/download')
  @UseGuards(FirebaseGuard)
  async downloadCertificate(
    @Param('id') id: string,
    @Request() req: any,
    @Res() res: Response,
  ) {
    const certificate = await this.certificatesService.getCertificateById(
      id,
      req.user.id,
    );

    const pdfPath = path.join(
      process.cwd(),
      'certificates',
      `${certificate.certificateNumber}.pdf`,
    );

    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({ message: 'PDF not found' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${certificate.certificateNumber}.pdf"`,
    );

    const fileStream = fs.createReadStream(pdfPath);
    fileStream.pipe(res);
  }
}

// Public controller for verification
@Controller('verify')
export class VerifyController {
  constructor(private certificatesService: CertificatesService) {}

  @Get(':code')
  async verifyCertificate(@Param('code') code: string) {
    return this.certificatesService.verifyCertificate(code);
  }
}
