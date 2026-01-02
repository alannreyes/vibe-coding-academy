'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Download, ExternalLink, Calendar } from 'lucide-react';
import { getCertificates, downloadCertificate } from '@/lib/api';
import { formatDate, getJourneyColor } from '@/lib/utils';

interface Certificate {
  id: string;
  journeyId: number;
  certificateNumber: string;
  issuedAt: string;
  verificationCode: string;
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    async function loadCertificates() {
      try {
        const data = await getCertificates();
        setCertificates(data);
      } catch (error) {
        console.error('Error loading certificates:', error);
      } finally {
        setLoading(false);
      }
    }

    loadCertificates();
  }, []);

  const handleDownload = async (cert: Certificate) => {
    setDownloading(cert.id);
    try {
      const blob = await downloadCertificate(cert.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${cert.certificateNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading certificate:', error);
    } finally {
      setDownloading(null);
    }
  };

  const getJourneyName = (journeyId: number) => {
    switch (journeyId) {
      case 1:
        return 'Básico';
      case 2:
        return 'Intermedio';
      case 3:
        return 'Avanzado';
      default:
        return 'Desconocido';
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="h-8 bg-slate-200 rounded animate-pulse w-48 mb-6" />
        <div className="grid gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 bg-white rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Mis Certificados</h1>

      {certificates.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-12 border text-center"
        >
          <Award className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-700 mb-2">
            Aún no tienes certificados
          </h2>
          <p className="text-slate-500 max-w-md mx-auto">
            Completa todas las misiones de una jornada para obtener tu
            certificado oficial.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {certificates.map((cert, index) => {
            const colors = getJourneyColor(cert.journeyId);

            return (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl border overflow-hidden"
              >
                <div className={`h-2 bg-gradient-to-r ${colors.gradient}`} />

                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-14 h-14 rounded-xl bg-gradient-to-r ${colors.gradient} flex items-center justify-center`}
                      >
                        <Award className="w-7 h-7 text-white" />
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg">
                          Certificado de {getJourneyName(cert.journeyId)}
                        </h3>
                        <p className="text-slate-500 text-sm">
                          {cert.certificateNumber}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`/verify/${cert.verificationCode}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-slate-400 hover:text-slate-600 transition"
                        title="Verificar certificado"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>

                      <button
                        onClick={() => handleDownload(cert)}
                        disabled={downloading === cert.id}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                          downloading === cert.id
                            ? 'bg-slate-100 text-slate-400'
                            : `bg-gradient-to-r ${colors.gradient} text-white hover:opacity-90`
                        }`}
                      >
                        <Download className="w-4 h-4" />
                        {downloading === cert.id ? 'Descargando...' : 'Descargar'}
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t flex items-center text-sm text-slate-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    Emitido el {formatDate(cert.issuedAt)}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
