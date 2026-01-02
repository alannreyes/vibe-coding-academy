'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Award, Calendar, Rocket } from 'lucide-react';
import { verifyCertificate } from '@/lib/api';
import { formatDate, getJourneyColor } from '@/lib/utils';

interface CertificateDetails {
  id: string;
  certificateNumber: string;
  issuedAt: string;
  journeyId: number;
  userName: string;
  userEmail: string;
  journeyName: string;
  journeyTitle: string;
}

interface VerificationResult {
  valid: boolean;
  certificate?: CertificateDetails;
  message?: string;
}

export default function VerifyPage() {
  const params = useParams();
  const code = params.code as string;

  const [result, setResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verify() {
      try {
        const data = await verifyCertificate(code);
        setResult(data);
      } catch (error) {
        console.error('Error verifying certificate:', error);
        setResult({ valid: false, message: 'Error al verificar' });
      } finally {
        setLoading(false);
      }
    }

    verify();
  }, [code]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4" />
          <p className="text-slate-500">Verificando certificado...</p>
        </div>
      </div>
    );
  }

  const cert = result?.certificate;
  const colors = cert ? getJourneyColor(cert.journeyId) : null;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden"
      >
        {result?.valid && cert ? (
          <>
            <div className={`bg-gradient-to-r ${colors?.gradient} p-6 text-white text-center`}>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-bold mb-1">Certificado Válido</h1>
              <p className="text-white/80">Este certificado es auténtico</p>
            </div>

            <div className="p-6">
              <div className="text-center mb-6">
                <Award className={`w-12 h-12 mx-auto mb-3 ${colors?.text}`} />
                <h2 className="text-xl font-semibold mb-1">{cert.userName}</h2>
                <p className="text-slate-500">{cert.userEmail}</p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 mb-6">
                <div className="text-center">
                  <p className="text-sm text-slate-500 mb-1">
                    Ha completado satisfactoriamente
                  </p>
                  <p className={`text-lg font-semibold ${colors?.text}`}>
                    {cert.journeyTitle}
                  </p>
                  <p className="text-slate-600">Nivel {cert.journeyName}</p>
                </div>
              </div>

              <div className="flex justify-between text-sm text-slate-500 border-t pt-4">
                <div>
                  <p className="font-medium text-slate-700">
                    {cert.certificateNumber}
                  </p>
                  <p>Número de certificado</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-slate-700">
                    {formatDate(cert.issuedAt)}
                  </p>
                  <p>Fecha de emisión</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-bold mb-1">Certificado No Válido</h1>
              <p className="text-white/80">
                {result?.message || 'Este código de verificación no existe'}
              </p>
            </div>

            <div className="p-6 text-center">
              <p className="text-slate-500 mb-6">
                El código de verificación proporcionado no corresponde a ningún
                certificado registrado en nuestro sistema.
              </p>
            </div>
          </>
        )}

        <div className="px-6 pb-6">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full py-3 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition"
          >
            <Rocket className="w-4 h-4" />
            Ir a Vibe Coding Academy
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
