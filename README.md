# Vibe Coding Academy

Plataforma de aprendizaje gamificada para el programa "Fullstack con IA Generativa".

**Frase clave:** "Aprende construyendo, no estudiando"

## Stack Tecnológico (Diciembre 2025)

| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| Next.js | 16.1.x | Framework React con App Router y Turbopack |
| React | 19.2.x | Biblioteca UI con Server Components |
| NestJS | 11.1.x | Framework backend Node.js |
| Prisma | 6.1.x | ORM para PostgreSQL |
| TypeScript | 5.7.x | Tipado estático |
| PostgreSQL | 16.x | Base de datos relacional |
| Firebase | 11.x | Autenticación (Google Sign-In) |
| Tailwind CSS | 3.4.x | Framework de estilos |
| Framer Motion | 11.x | Animaciones |

## Estructura del Proyecto

```
vibe-coding-academy/
├── apps/
│   ├── backend/          # NestJS API
│   │   ├── src/
│   │   │   ├── auth/         # Firebase Auth
│   │   │   ├── users/        # Gestión usuarios
│   │   │   ├── journeys/     # Jornadas
│   │   │   ├── missions/     # Misiones
│   │   │   ├── quiz/         # Sistema de quiz
│   │   │   ├── progress/     # Progreso usuario
│   │   │   ├── certificates/ # Generación PDF
│   │   │   └── email/        # Envío emails
│   │   └── prisma/
│   │       └── schema.prisma
│   └── frontend/         # Next.js 16
│       ├── app/
│       │   ├── (authenticated)/  # Rutas protegidas
│       │   └── verify/           # Verificación pública
│       ├── components/
│       └── lib/
├── packages/
│   └── shared/           # Tipos TypeScript compartidos
├── docker-compose.yml    # PostgreSQL + Redis
└── pnpm-workspace.yaml
```

## Requisitos

- Node.js 22.x LTS
- pnpm 9.x
- Docker y Docker Compose
- Cuenta de Firebase (para autenticación)

## Instalación

### 1. Clonar e instalar dependencias

```bash
git clone <repo-url>
cd vibe-coding-academy
pnpm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales:

```env
# Database
DATABASE_URL=postgresql://vibe:vibe123@localhost:5432/vibe_academy

# Firebase (obtener de Firebase Console)
FIREBASE_PROJECT_ID=tu-proyecto
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto

# Email (opcional para desarrollo)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=app-password

# URLs
BACKEND_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3000
```

### 3. Levantar la base de datos

```bash
docker-compose up -d
```

### 4. Ejecutar migraciones y seed

```bash
cd apps/backend
pnpm prisma:generate
pnpm prisma:migrate
pnpm prisma:seed
```

### 5. Iniciar en desarrollo

```bash
# Desde la raíz del proyecto
pnpm dev
```

Esto levanta:
- Frontend en http://localhost:3000
- Backend en http://localhost:3001

## Configuración de Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto
3. Habilita Authentication > Sign-in method > Google
4. En Project Settings > Service Accounts, genera una nueva clave privada
5. Copia las credenciales a tu `.env`

## Scripts Disponibles

```bash
# Desarrollo
pnpm dev              # Inicia frontend y backend
pnpm dev:frontend     # Solo frontend
pnpm dev:backend      # Solo backend

# Base de datos
pnpm db:migrate       # Ejecutar migraciones
pnpm db:seed          # Cargar datos iniciales
pnpm db:studio        # Abrir Prisma Studio

# Build
pnpm build            # Build de producción
```

## API Endpoints

### Autenticación
- `POST /api/auth/login` - Login con token de Firebase
- `GET /api/auth/me` - Usuario actual

### Progreso
- `GET /api/progress` - Progreso general
- `GET /api/progress/journey/:id` - Progreso de jornada

### Jornadas
- `GET /api/journeys` - Lista de jornadas
- `GET /api/journeys/:id` - Detalle con misiones

### Misiones
- `GET /api/missions/:id` - Contenido de misión
- `POST /api/missions/:id/start` - Iniciar misión
- `GET /api/missions/:id/cards` - Tarjetas de la misión

### Quiz
- `GET /api/quiz/:missionId` - Preguntas del quiz
- `POST /api/quiz/:missionId/submit` - Enviar respuestas
- `GET /api/quiz/:missionId/status` - Estado de intentos

### Certificados
- `GET /api/certificates` - Mis certificados
- `GET /api/certificates/:id/download` - Descargar PDF
- `GET /api/verify/:code` - Verificar (público)

## Mecánicas de Gamificación

### Progresión
- Misión 1 desbloqueada al registrarse
- Cada misión se desbloquea al aprobar el quiz anterior
- Certificado al completar todas las misiones de una jornada

### Sistema de Puntos
| Acción | Puntos |
|--------|--------|
| Completar misión | +50 |
| Quiz 1er intento | +100 |
| Quiz 2do intento | +75 |
| Quiz 3er intento | +50 |
| Certificado | +500 |

### Quiz
- 10 preguntas por misión
- Mínimo 8/10 para aprobar (80%)
- Máximo 3 intentos por 24 horas

## Desarrollo

### Agregar una nueva misión

1. Editar `apps/backend/prisma/seed.ts`
2. Agregar la misión con sus preguntas de quiz
3. Ejecutar `pnpm db:seed`

### Agregar componentes UI

Usamos shadcn/ui. Para agregar un componente:

```bash
cd apps/frontend
npx shadcn@latest add button
```

## Producción

### Build

```bash
pnpm build
```

### Docker (próximamente)

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Licencia

MIT
