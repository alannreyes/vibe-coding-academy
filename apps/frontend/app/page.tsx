'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Rocket, Zap, Trophy, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function LandingPage() {
  const { user, signIn, loading } = useAuth();

  const features = [
    {
      icon: Rocket,
      title: 'Aprende Construyendo',
      description: 'No más teoría aburrida. Construye proyectos reales desde el día 1.',
    },
    {
      icon: Zap,
      title: 'IA como tu Copiloto',
      description: 'Usa IA generativa para acelerar tu aprendizaje y crear más rápido.',
    },
    {
      icon: Trophy,
      title: 'Gamificación Real',
      description: 'Misiones, quizzes, puntos y certificados que validan tu progreso.',
    },
  ];

  const journeys = [
    {
      level: 'Básico',
      title: 'Tu Asistente IA en 4 Horas',
      color: 'from-cyan-500 to-cyan-600',
      missions: 4,
    },
    {
      level: 'Intermedio',
      title: 'Superpoderes para tu Asistente',
      color: 'from-violet-500 to-purple-600',
      missions: 6,
    },
    {
      level: 'Avanzado',
      title: 'IA de Nivel Empresarial',
      color: 'from-amber-500 to-orange-500',
      missions: 4,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 flex items-center justify-center">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">Vibe Coding Academy</span>
            </div>

            <div>
              {user ? (
                <Link
                  href="/dashboard"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-medium hover:opacity-90 transition"
                >
                  Ir al Dashboard
                </Link>
              ) : (
                <button
                  onClick={signIn}
                  disabled={loading}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-medium hover:opacity-90 transition disabled:opacity-50"
                >
                  {loading ? 'Cargando...' : 'Iniciar con Google'}
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-cyan-100 text-cyan-700 text-sm font-medium mb-6">
              Programa Fullstack con IA Generativa
            </span>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight">
              Aprende{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-500">
                construyendo
              </span>
              ,<br />
              no estudiando
            </h1>

            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
              Crea tu propio asistente IA funcional mientras avanzas por misiones
              interactivas. Sin teoría aburrida, solo proyectos reales.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link
                  href="/dashboard"
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold text-lg hover:opacity-90 transition flex items-center justify-center gap-2"
                >
                  Continuar Aprendiendo
                  <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <button
                  onClick={signIn}
                  disabled={loading}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold text-lg hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  Comenzar Gratis
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Una nueva forma de aprender
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Journeys */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Tu camino de aprendizaje
          </h2>
          <p className="text-slate-600 text-center mb-12 max-w-2xl mx-auto">
            3 jornadas progresivas que te llevarán desde cero hasta crear
            aplicaciones IA de nivel empresarial.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {journeys.map((journey, index) => (
              <motion.div
                key={journey.level}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative bg-white rounded-2xl p-6 border-2 border-slate-100 hover:border-slate-200 transition"
              >
                <div
                  className={`absolute top-0 left-6 right-6 h-1 rounded-b-full bg-gradient-to-r ${journey.color}`}
                />
                <div className="pt-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${journey.color} text-white mb-4`}
                  >
                    {journey.level}
                  </span>
                  <h3 className="text-xl font-semibold mb-2">{journey.title}</h3>
                  <p className="text-slate-500 text-sm">
                    {journey.missions} misiones
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What you'll build */}
      <section className="py-20 px-4 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Lo que construirás
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              'Chatbot con IA',
              'Base de datos real',
              'Servidor en producción',
              'Certificados verificables',
            ].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 bg-slate-800 rounded-xl p-4"
              >
                <CheckCircle className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                <span>{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            ¿Listo para comenzar tu viaje?
          </h2>
          <p className="text-slate-600 mb-8">
            Únete a cientos de estudiantes que ya están construyendo el futuro
            con IA.
          </p>

          {user ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold text-lg hover:opacity-90 transition"
            >
              Ir al Dashboard
              <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <button
              onClick={signIn}
              disabled={loading}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold text-lg hover:opacity-90 transition disabled:opacity-50"
            >
              Comenzar Ahora - Es Gratis
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="max-w-7xl mx-auto text-center text-slate-500 text-sm">
          <p>Vibe Coding Academy - Aprende construyendo, no estudiando</p>
        </div>
      </footer>
    </div>
  );
}
