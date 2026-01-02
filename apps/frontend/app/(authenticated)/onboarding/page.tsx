'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Monitor, Apple, Terminal, ArrowRight, Sparkles } from 'lucide-react';
import { updateUserPreferences } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

const osOptions = [
  {
    id: 'windows',
    name: 'Windows',
    icon: Monitor,
    description: 'Windows 10 u 11',
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'mac',
    name: 'macOS',
    icon: Apple,
    description: 'Mac con Apple Silicon o Intel',
    color: 'from-slate-600 to-slate-800',
  },
  {
    id: 'linux',
    name: 'Linux',
    icon: Terminal,
    description: 'Ubuntu, Fedora, Arch, etc.',
    color: 'from-orange-500 to-orange-600',
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [selectedOS, setSelectedOS] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleContinue = async () => {
    if (!selectedOS) return;

    setSaving(true);
    try {
      await updateUserPreferences({
        operatingSystem: selectedOS as 'windows' | 'mac' | 'linux',
        onboardingCompleted: true,
      });
      await refreshUser();
      router.push('/dashboard');
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Bienvenido a Vibe Coding Academy
          </h1>
          <p className="text-slate-600 text-lg">
            Para personalizar tu experiencia, necesitamos saber tu sistema operativo.
          </p>
          <p className="text-slate-500 text-sm mt-2">
            Esto nos permite darte instrucciones precisas con los comandos y atajos correctos.
          </p>
        </div>

        {/* OS Selection */}
        <div className="grid gap-4 mb-8">
          {osOptions.map((os, index) => {
            const Icon = os.icon;
            const isSelected = selectedOS === os.id;

            return (
              <motion.button
                key={os.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                onClick={() => setSelectedOS(os.id)}
                className={`
                  relative p-6 rounded-2xl border-2 text-left transition-all
                  ${isSelected
                    ? 'border-cyan-500 bg-cyan-50 shadow-lg'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                  }
                `}
              >
                <div className="flex items-center gap-4">
                  <div className={`
                    w-14 h-14 rounded-xl flex items-center justify-center
                    bg-gradient-to-r ${os.color} text-white
                  `}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {os.name}
                    </h3>
                    <p className="text-slate-500">{os.description}</p>
                  </div>
                  <div className={`
                    w-6 h-6 rounded-full border-2 transition-all
                    ${isSelected
                      ? 'border-cyan-500 bg-cyan-500'
                      : 'border-slate-300'
                    }
                  `}>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-full h-full flex items-center justify-center"
                      >
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <button
            onClick={handleContinue}
            disabled={!selectedOS || saving}
            className={`
              w-full py-4 px-6 rounded-xl font-semibold text-lg
              flex items-center justify-center gap-2 transition-all
              ${selectedOS
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:opacity-90 shadow-lg'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }
            `}
          >
            {saving ? (
              <span>Guardando...</span>
            ) : (
              <>
                <span>Comenzar mi aventura</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </motion.div>

        {/* Note */}
        <p className="text-center text-slate-400 text-sm mt-4">
          Puedes cambiar esto después en tu perfil
        </p>
      </motion.div>
    </div>
  );
}
