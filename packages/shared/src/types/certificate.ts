export interface Certificate {
  id: string;
  userId: string;
  journeyId: number;
  certificateNumber: string;
  issuedAt: Date;
  pdfUrl: string | null;
  verificationCode: string;
}

export interface CertificateWithDetails extends Certificate {
  userName: string;
  userEmail: string;
  journeyName: string;
  journeyTitle: string;
  completedMissions: number;
  totalPoints: number;
}

export interface CertificateVerification {
  valid: boolean;
  certificate?: CertificateWithDetails;
  message?: string;
}
