import { PrismaClient } from '@prisma/client';
import { mission1Content } from './content/mission1';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create Journey 1: Básico
  const journey1 = await prisma.journey.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Básico',
      title: 'Tu Asistente IA en 4 Horas',
      description:
        'Construye un chatbot inteligente desde cero y ponlo en internet. Sin conocimientos previos requeridos.',
      color: '#0891b2',
      icon: 'rocket',
      requiredMissions: 4,
    },
  });

  console.log('Created journey:', journey1.name);

  // Create Mission 1 with new step-based content
  const mission1 = await prisma.mission.upsert({
    where: { id: 1 },
    update: {
      content: JSON.stringify(mission1Content),
    },
    create: {
      id: 1,
      journeyId: 1,
      number: 1,
      title: 'Tu asistente responde',
      subtitle: 'Crea tu primer chatbot con IA',
      description:
        'En esta misión construirás un chatbot funcional que responde usando inteligencia artificial. Al terminar, tendrás algo que realmente funciona y puedes mostrar.',
      objectives: [
        'Instalar y configurar Cursor',
        'Crear el proyecto con un prompt de IA',
        'Configurar API key de OpenAI',
        'Ver tu chatbot funcionando',
      ],
      duration: 60,
      difficulty: 'beginner',
      resultTitle: 'Chatbot funcionando en localhost',
      resultDesc: 'Un chat que responde usando inteligencia artificial',
      showOffText: 'Le preguntas algo y te responde con IA real',
      content: JSON.stringify(mission1Content),
      points: 100,
      order: 1,
    },
  });

  console.log('Created mission:', mission1.title);

  // Create Mission 2
  const mission2 = await prisma.mission.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      journeyId: 1,
      number: 2,
      title: 'Tu asistente conoce tu negocio',
      subtitle: 'Conecta una base de datos real',
      description:
        'El asistente ahora responde sobre TUS productos reales. Aprenderás a usar Docker y PostgreSQL para almacenar datos.',
      objectives: [
        'Levantar PostgreSQL con Docker',
        'Crear esquema con Prisma',
        'Cargar datos de ejemplo',
        'Conectar el chat con la base de datos',
      ],
      duration: 60,
      difficulty: 'beginner',
      resultTitle: 'Asistente con conocimiento propio',
      resultDesc: 'Pregunta por stock o productos y responde con datos reales',
      showOffText: '¿Tienen laptops Dell? → Sí, 3 modelos en stock',
      content: JSON.stringify({
        sections: [
          {
            type: 'intro',
            content:
              '# Tu asistente conoce tu negocio\n\nEn esta misión conectarás tu chatbot a una base de datos real. Podrá responder preguntas sobre productos, inventario, o cualquier dato que necesites.\n\n**Tiempo estimado:** 60 minutos',
          },
          {
            type: 'theory',
            title: '¿Por qué una base de datos?',
            content:
              'Sin una base de datos, tu chatbot solo puede responder con conocimiento general. Con una base de datos:\n- Responde sobre TUS productos\n- Consulta inventario en tiempo real\n- Proporciona información específica de tu negocio',
          },
          {
            type: 'practice',
            title: 'Paso 1: Levantar PostgreSQL',
            content:
              'Vamos a usar Docker para tener PostgreSQL sin instalarlo en tu sistema:',
          },
          {
            type: 'code',
            codeLanguage: 'bash',
            copyable: true,
            content:
              'docker run --name postgres-chat -e POSTGRES_PASSWORD=mysecret -p 5432:5432 -d postgres',
          },
          {
            type: 'checkpoint',
            title: 'Verifica tu progreso',
            checkItems: [
              'Docker está corriendo',
              'PostgreSQL está activo en puerto 5432',
              'Puedes conectarte a la base de datos',
            ],
          },
        ],
      }),
      points: 100,
      order: 2,
    },
  });

  console.log('Created mission:', mission2.title);

  // Create Mission 3
  const mission3 = await prisma.mission.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      journeyId: 1,
      number: 3,
      title: 'Tu asistente en internet',
      subtitle: 'Despliega en un servidor real',
      description:
        'Cualquiera puede acceder a tu asistente con una URL. Aprenderás sobre VPS, SSH, y deployment.',
      objectives: [
        'Crear cuenta en VPS (Hetzner/DigitalOcean)',
        'Conectar por SSH',
        'Subir proyecto con Docker',
        'Configurar dominio y HTTPS',
      ],
      duration: 60,
      difficulty: 'beginner',
      resultTitle: 'URL pública funcionando',
      resultDesc: 'Comparte el link y funciona en cualquier dispositivo',
      showOffText: 'Le mandé el link a mi familia y funcionó',
      content: JSON.stringify({
        sections: [
          {
            type: 'intro',
            content:
              '# Tu asistente en internet\n\nEs hora de que el mundo vea tu creación. En esta misión desplegarás tu chatbot en un servidor real con una URL pública.\n\n**Tiempo estimado:** 60 minutos',
          },
          {
            type: 'theory',
            title: '¿Qué es un VPS?',
            content:
              'Un VPS (Virtual Private Server) es como una computadora en la nube que puedes alquilar. Tu aplicación correrá 24/7 sin necesidad de tener tu computadora encendida.',
          },
          {
            type: 'practice',
            title: 'Paso 1: Crear cuenta en Hetzner',
            content:
              'Hetzner ofrece servidores económicos y potentes. Sigue estos pasos para crear tu servidor:',
          },
          {
            type: 'checkpoint',
            title: 'Verifica tu progreso',
            checkItems: [
              'Tienes un servidor VPS activo',
              'Puedes conectarte por SSH',
              'Tu aplicación está corriendo en el servidor',
            ],
          },
        ],
      }),
      points: 100,
      order: 3,
    },
  });

  console.log('Created mission:', mission3.title);

  // Create Mission 4
  const mission4 = await prisma.mission.upsert({
    where: { id: 4 },
    update: {},
    create: {
      id: 4,
      journeyId: 1,
      number: 4,
      title: 'Tu asistente es profesional',
      subtitle: 'Seguridad, velocidad y monitoreo',
      description:
        'Tu app es segura, rápida y puedes ver métricas. Aprenderás sobre HTTPS, caché, y monitoreo.',
      objectives: [
        'Configurar HTTPS con Traefik',
        'Implementar caché con Redis',
        'Agregar rate limiting',
        'Ver dashboard de métricas',
      ],
      duration: 60,
      difficulty: 'beginner',
      resultTitle: 'App de nivel producción',
      resultDesc: 'Segura, monitoreada y lista para usuarios reales',
      showOffText: 'No es un juguete, es nivel profesional',
      content: JSON.stringify({
        sections: [
          {
            type: 'intro',
            content:
              '# Tu asistente es profesional\n\nTu aplicación ya funciona, pero ¿está lista para el mundo real? En esta misión la haremos segura, rápida y monitoreada.\n\n**Tiempo estimado:** 60 minutos',
          },
          {
            type: 'theory',
            title: '¿Por qué importa la seguridad?',
            content:
              'HTTPS protege los datos de tus usuarios. Sin HTTPS:\n- Los datos viajan sin encriptar\n- Cualquiera puede interceptarlos\n- Los navegadores mostrarán advertencias',
          },
          {
            type: 'practice',
            title: 'Paso 1: Configurar Traefik',
            content:
              'Traefik es un proxy inverso que maneja HTTPS automáticamente:',
          },
          {
            type: 'checkpoint',
            title: 'Verifica tu progreso',
            checkItems: [
              'Tu sitio tiene el candado verde (HTTPS)',
              'Redis está cacheando respuestas',
              'Puedes ver métricas en el dashboard',
            ],
          },
          {
            type: 'reflection',
            content:
              '**¡Felicitaciones!** Has completado la Jornada Básica. Tu asistente IA está en internet, es seguro, rápido y profesional. Estás listo para el siguiente nivel.',
          },
        ],
      }),
      points: 100,
      order: 4,
    },
  });

  console.log('Created mission:', mission4.title);

  // Create Quiz Questions for Mission 1
  const mission1Questions = [
    {
      question: '¿Qué herramienta usamos para crear el proyecto?',
      options: [
        { id: 'a', text: 'Visual Studio Code' },
        { id: 'b', text: 'Cursor' },
        { id: 'c', text: 'Sublime Text' },
        { id: 'd', text: 'Notepad++' },
      ],
      correctId: 'b',
      explanation:
        'Cursor es un editor de código con IA integrada que nos permite crear aplicaciones usando prompts.',
    },
    {
      question: '¿Qué framework usamos para crear la aplicación web?',
      options: [
        { id: 'a', text: 'Django' },
        { id: 'b', text: 'Ruby on Rails' },
        { id: 'c', text: 'Next.js' },
        { id: 'd', text: 'Laravel' },
      ],
      correctId: 'c',
      explanation:
        'Next.js es un framework de React que facilita crear aplicaciones web modernas.',
    },
    {
      question: '¿Qué API usamos para las respuestas de IA?',
      options: [
        { id: 'a', text: 'Facebook AI' },
        { id: 'b', text: 'Amazon Alexa' },
        { id: 'c', text: 'OpenAI GPT' },
        { id: 'd', text: 'Siri' },
      ],
      correctId: 'c',
      explanation:
        'OpenAI GPT es uno de los modelos de lenguaje más avanzados para crear chatbots.',
    },
    {
      question: '¿Qué librería de componentes usamos para el diseño?',
      options: [
        { id: 'a', text: 'Bootstrap' },
        { id: 'b', text: 'Material UI' },
        { id: 'c', text: 'shadcn/ui' },
        { id: 'd', text: 'Ant Design' },
      ],
      correctId: 'c',
      explanation:
        'shadcn/ui es una colección de componentes reutilizables que se integran perfectamente con Tailwind CSS.',
    },
    {
      question: '¿En qué puerto corre la aplicación por defecto?',
      options: [
        { id: 'a', text: '8080' },
        { id: 'b', text: '3000' },
        { id: 'c', text: '5000' },
        { id: 'd', text: '4200' },
      ],
      correctId: 'b',
      explanation:
        'Next.js por defecto corre en el puerto 3000 (localhost:3000).',
    },
    {
      question: '¿Qué tipo de interfaz creamos para el chat?',
      options: [
        { id: 'a', text: 'Línea de comandos' },
        { id: 'b', text: 'Aplicación de escritorio' },
        { id: 'c', text: 'Interfaz web con burbujas' },
        { id: 'd', text: 'Bot de Telegram' },
      ],
      correctId: 'c',
      explanation:
        'Creamos una interfaz web moderna con burbujas de chat para una experiencia amigable.',
    },
    {
      question:
        '¿Qué necesitas para usar la API de OpenAI?',
      options: [
        { id: 'a', text: 'Solo una cuenta de email' },
        { id: 'b', text: 'Una API key' },
        { id: 'c', text: 'Un servidor dedicado' },
        { id: 'd', text: 'Nada, es completamente gratis' },
      ],
      correctId: 'b',
      explanation:
        'Necesitas una API key de OpenAI para autenticar tus peticiones a la API.',
    },
    {
      question: '¿Cuál es la ventaja de usar IA para programar?',
      options: [
        { id: 'a', text: 'El código es siempre perfecto' },
        { id: 'b', text: 'Acelera el desarrollo y reduce errores' },
        { id: 'c', text: 'No necesitas entender nada de código' },
        { id: 'd', text: 'Reemplaza completamente a los programadores' },
      ],
      correctId: 'b',
      explanation:
        'La IA acelera el desarrollo y ayuda a reducir errores, pero aún necesitas revisar y entender el código.',
    },
    {
      question: '¿Qué es un prompt?',
      options: [
        { id: 'a', text: 'Un tipo de base de datos' },
        { id: 'b', text: 'Una instrucción o pregunta para la IA' },
        { id: 'c', text: 'Un lenguaje de programación' },
        { id: 'd', text: 'Un framework de JavaScript' },
      ],
      correctId: 'b',
      explanation:
        'Un prompt es la instrucción o pregunta que le damos a la IA para que genere una respuesta.',
    },
    {
      question: '¿Qué lograste al final de esta misión?',
      options: [
        { id: 'a', text: 'Solo instalar software' },
        { id: 'b', text: 'Un chatbot funcional con IA' },
        { id: 'c', text: 'Una página estática' },
        { id: 'd', text: 'Un documento de texto' },
      ],
      correctId: 'b',
      explanation:
        '¡Creaste un chatbot funcional que usa inteligencia artificial para responder preguntas!',
    },
  ];

  for (let i = 0; i < mission1Questions.length; i++) {
    await prisma.quizQuestion.upsert({
      where: { id: `m1q${i + 1}` },
      update: {},
      create: {
        id: `m1q${i + 1}`,
        missionId: 1,
        question: mission1Questions[i].question,
        options: mission1Questions[i].options,
        correctId: mission1Questions[i].correctId,
        explanation: mission1Questions[i].explanation,
        order: i + 1,
      },
    });
  }

  console.log('Created quiz questions for mission 1');

  // Create Quiz Questions for Mission 2
  const mission2Questions = [
    {
      question: '¿Qué es Docker?',
      options: [
        { id: 'a', text: 'Un lenguaje de programación' },
        { id: 'b', text: 'Una plataforma para contenedores' },
        { id: 'c', text: 'Un navegador web' },
        { id: 'd', text: 'Un sistema operativo' },
      ],
      correctId: 'b',
      explanation:
        'Docker es una plataforma que permite empaquetar aplicaciones en contenedores aislados.',
    },
    {
      question: '¿Qué base de datos usamos en esta misión?',
      options: [
        { id: 'a', text: 'MySQL' },
        { id: 'b', text: 'MongoDB' },
        { id: 'c', text: 'PostgreSQL' },
        { id: 'd', text: 'SQLite' },
      ],
      correctId: 'c',
      explanation:
        'PostgreSQL es una base de datos relacional robusta y de código abierto.',
    },
    {
      question: '¿Qué es Prisma?',
      options: [
        { id: 'a', text: 'Un framework de frontend' },
        { id: 'b', text: 'Un ORM para bases de datos' },
        { id: 'c', text: 'Un servidor web' },
        { id: 'd', text: 'Un lenguaje de consultas' },
      ],
      correctId: 'b',
      explanation:
        'Prisma es un ORM que facilita trabajar con bases de datos desde JavaScript/TypeScript.',
    },
    {
      question: '¿Por qué usamos Docker para PostgreSQL?',
      options: [
        { id: 'a', text: 'Es más rápido que instalarlo directamente' },
        { id: 'b', text: 'Aísla la base de datos y facilita el setup' },
        { id: 'c', text: 'Es obligatorio para PostgreSQL' },
        { id: 'd', text: 'Solo funciona con Docker' },
      ],
      correctId: 'b',
      explanation:
        'Docker aísla la base de datos en un contenedor, evitando conflictos y simplificando la configuración.',
    },
    {
      question: '¿Qué puerto usa PostgreSQL por defecto?',
      options: [
        { id: 'a', text: '3000' },
        { id: 'b', text: '5432' },
        { id: 'c', text: '8080' },
        { id: 'd', text: '27017' },
      ],
      correctId: 'b',
      explanation: 'PostgreSQL usa el puerto 5432 por defecto.',
    },
    {
      question: '¿Qué es un esquema de base de datos?',
      options: [
        { id: 'a', text: 'El color del diseño' },
        { id: 'b', text: 'La estructura de tablas y relaciones' },
        { id: 'c', text: 'El nombre del servidor' },
        { id: 'd', text: 'La contraseña de acceso' },
      ],
      correctId: 'b',
      explanation:
        'Un esquema define la estructura de la base de datos: tablas, columnas y relaciones.',
    },
    {
      question: '¿Cómo puede el chatbot responder sobre productos específicos?',
      options: [
        { id: 'a', text: 'Adivinando' },
        { id: 'b', text: 'Consultando la base de datos' },
        { id: 'c', text: 'Buscando en Google' },
        { id: 'd', text: 'Preguntándole al usuario' },
      ],
      correctId: 'b',
      explanation:
        'El chatbot consulta la base de datos para obtener información real sobre tus productos.',
    },
    {
      question: '¿Qué comando usamos para ver los contenedores Docker activos?',
      options: [
        { id: 'a', text: 'docker list' },
        { id: 'b', text: 'docker ps' },
        { id: 'c', text: 'docker show' },
        { id: 'd', text: 'docker active' },
      ],
      correctId: 'b',
      explanation: 'docker ps muestra todos los contenedores en ejecución.',
    },
    {
      question: '¿Qué ventaja tiene conectar una base de datos al chatbot?',
      options: [
        { id: 'a', text: 'Solo es decorativo' },
        { id: 'b', text: 'Responde con información real y actualizada' },
        { id: 'c', text: 'Hace el código más largo' },
        { id: 'd', text: 'Reduce la velocidad' },
      ],
      correctId: 'b',
      explanation:
        'Con una base de datos, el chatbot puede responder con información real y siempre actualizada.',
    },
    {
      question: '¿Qué es una migración en Prisma?',
      options: [
        { id: 'a', text: 'Mover datos a otro servidor' },
        { id: 'b', text: 'Cambios en la estructura de la base de datos' },
        { id: 'c', text: 'Copiar el código' },
        { id: 'd', text: 'Actualizar Node.js' },
      ],
      correctId: 'b',
      explanation:
        'Las migraciones son cambios controlados en la estructura de la base de datos.',
    },
  ];

  for (let i = 0; i < mission2Questions.length; i++) {
    await prisma.quizQuestion.upsert({
      where: { id: `m2q${i + 1}` },
      update: {},
      create: {
        id: `m2q${i + 1}`,
        missionId: 2,
        question: mission2Questions[i].question,
        options: mission2Questions[i].options,
        correctId: mission2Questions[i].correctId,
        explanation: mission2Questions[i].explanation,
        order: i + 1,
      },
    });
  }

  console.log('Created quiz questions for mission 2');

  // Create Quiz Questions for Mission 3
  const mission3Questions = [
    {
      question: '¿Qué es un VPS?',
      options: [
        { id: 'a', text: 'Un tipo de red social' },
        { id: 'b', text: 'Un servidor virtual privado' },
        { id: 'c', text: 'Un protocolo de internet' },
        { id: 'd', text: 'Un lenguaje de programación' },
      ],
      correctId: 'b',
      explanation:
        'VPS significa Virtual Private Server, es como tener tu propia computadora en la nube.',
    },
    {
      question: '¿Qué es SSH?',
      options: [
        { id: 'a', text: 'Un navegador web' },
        { id: 'b', text: 'Un protocolo para conexión remota segura' },
        { id: 'c', text: 'Un tipo de base de datos' },
        { id: 'd', text: 'Un framework de JavaScript' },
      ],
      correctId: 'b',
      explanation:
        'SSH (Secure Shell) permite conectarte de forma segura a servidores remotos.',
    },
    {
      question: '¿Por qué necesitamos un VPS para nuestro chatbot?',
      options: [
        { id: 'a', text: 'Para que solo nosotros lo usemos' },
        { id: 'b', text: 'Para que esté disponible 24/7 en internet' },
        { id: 'c', text: 'Para hacerlo más lento' },
        { id: 'd', text: 'No es necesario, es opcional' },
      ],
      correctId: 'b',
      explanation:
        'Un VPS mantiene tu aplicación corriendo 24/7 sin depender de tu computadora personal.',
    },
    {
      question: '¿Qué proveedor de VPS mencionamos en la misión?',
      options: [
        { id: 'a', text: 'Amazon AWS' },
        { id: 'b', text: 'Hetzner' },
        { id: 'c', text: 'Google Cloud' },
        { id: 'd', text: 'Microsoft Azure' },
      ],
      correctId: 'b',
      explanation:
        'Hetzner ofrece servidores VPS económicos y de alto rendimiento.',
    },
    {
      question: '¿Cómo subimos nuestra aplicación al servidor?',
      options: [
        { id: 'a', text: 'Por email' },
        { id: 'b', text: 'Con Git y Docker' },
        { id: 'c', text: 'Con un USB' },
        { id: 'd', text: 'Por WhatsApp' },
      ],
      correctId: 'b',
      explanation:
        'Usamos Git para versionar el código y Docker para empaquetar y ejecutar la aplicación.',
    },
    {
      question: '¿Qué es un dominio?',
      options: [
        { id: 'a', text: 'El nombre de tu computadora' },
        { id: 'b', text: 'Una dirección web legible como example.com' },
        { id: 'c', text: 'Un tipo de servidor' },
        { id: 'd', text: 'Una contraseña' },
      ],
      correctId: 'b',
      explanation:
        'Un dominio es una dirección web fácil de recordar que apunta a tu servidor.',
    },
    {
      question: '¿Por qué es importante HTTPS?',
      options: [
        { id: 'a', text: 'Solo por estética' },
        { id: 'b', text: 'Encripta la comunicación y da confianza' },
        { id: 'c', text: 'Hace la página más rápida' },
        { id: 'd', text: 'Es obligatorio por ley' },
      ],
      correctId: 'b',
      explanation:
        'HTTPS encripta los datos entre el navegador y el servidor, protegiendo la información.',
    },
    {
      question: '¿Qué comando usamos para conectarnos al servidor?',
      options: [
        { id: 'a', text: 'connect server' },
        { id: 'b', text: 'ssh user@ip' },
        { id: 'c', text: 'login remote' },
        { id: 'd', text: 'open server' },
      ],
      correctId: 'b',
      explanation:
        'El comando ssh user@ip nos permite conectarnos a un servidor remoto.',
    },
    {
      question: '¿Qué significa "deployment"?',
      options: [
        { id: 'a', text: 'Escribir código' },
        { id: 'b', text: 'Poner una aplicación en producción' },
        { id: 'c', text: 'Diseñar la interfaz' },
        { id: 'd', text: 'Probar localmente' },
      ],
      correctId: 'b',
      explanation:
        'Deployment es el proceso de publicar tu aplicación para que esté disponible en internet.',
    },
    {
      question: '¿Qué lograste al final de esta misión?',
      options: [
        { id: 'a', text: 'Solo configurar el servidor' },
        { id: 'b', text: 'Tu chatbot accesible desde cualquier lugar' },
        { id: 'c', text: 'Aprender teoría de redes' },
        { id: 'd', text: 'Instalar software en tu PC' },
      ],
      correctId: 'b',
      explanation:
        '¡Tu chatbot ahora tiene una URL pública y cualquiera puede acceder a él!',
    },
  ];

  for (let i = 0; i < mission3Questions.length; i++) {
    await prisma.quizQuestion.upsert({
      where: { id: `m3q${i + 1}` },
      update: {},
      create: {
        id: `m3q${i + 1}`,
        missionId: 3,
        question: mission3Questions[i].question,
        options: mission3Questions[i].options,
        correctId: mission3Questions[i].correctId,
        explanation: mission3Questions[i].explanation,
        order: i + 1,
      },
    });
  }

  console.log('Created quiz questions for mission 3');

  // Create Quiz Questions for Mission 4
  const mission4Questions = [
    {
      question: '¿Qué es Traefik?',
      options: [
        { id: 'a', text: 'Una base de datos' },
        { id: 'b', text: 'Un proxy inverso y balanceador de carga' },
        { id: 'c', text: 'Un lenguaje de programación' },
        { id: 'd', text: 'Un navegador web' },
      ],
      correctId: 'b',
      explanation:
        'Traefik es un proxy inverso moderno que maneja HTTPS, routing y balanceo de carga.',
    },
    {
      question: '¿Qué es Redis?',
      options: [
        { id: 'a', text: 'Un sistema operativo' },
        { id: 'b', text: 'Un almacén de datos en memoria (caché)' },
        { id: 'c', text: 'Un framework de frontend' },
        { id: 'd', text: 'Un tipo de servidor web' },
      ],
      correctId: 'b',
      explanation:
        'Redis es una base de datos en memoria muy rápida, ideal para caché.',
    },
    {
      question: '¿Qué es rate limiting?',
      options: [
        { id: 'a', text: 'Limitar el tamaño de las imágenes' },
        { id: 'b', text: 'Limitar la cantidad de peticiones por tiempo' },
        { id: 'c', text: 'Limitar los usuarios registrados' },
        { id: 'd', text: 'Limitar el uso de CPU' },
      ],
      correctId: 'b',
      explanation:
        'Rate limiting protege tu app limitando cuántas peticiones puede hacer un usuario en un tiempo determinado.',
    },
    {
      question: '¿Por qué usamos caché?',
      options: [
        { id: 'a', text: 'Para ocupar más memoria' },
        { id: 'b', text: 'Para responder más rápido sin consultar siempre la DB' },
        { id: 'c', text: 'Para guardar contraseñas' },
        { id: 'd', text: 'Para hacer backups' },
      ],
      correctId: 'b',
      explanation:
        'El caché almacena respuestas frecuentes para entregarlas instantáneamente sin consultar la base de datos.',
    },
    {
      question: '¿Qué certificado necesitamos para HTTPS?',
      options: [
        { id: 'a', text: 'Certificado de nacimiento' },
        { id: 'b', text: 'Certificado SSL/TLS' },
        { id: 'c', text: 'Certificado de estudios' },
        { id: 'd', text: 'Certificado médico' },
      ],
      correctId: 'b',
      explanation:
        'Un certificado SSL/TLS permite la conexión HTTPS encriptada.',
    },
    {
      question: '¿Qué significa "nivel producción"?',
      options: [
        { id: 'a', text: 'En desarrollo local' },
        { id: 'b', text: 'Listo para usuarios reales' },
        { id: 'c', text: 'En fase de pruebas' },
        { id: 'd', text: 'Sin terminar' },
      ],
      correctId: 'b',
      explanation:
        'Producción significa que la aplicación está lista y optimizada para usuarios reales.',
    },
    {
      question: '¿Qué nos permiten ver las métricas?',
      options: [
        { id: 'a', text: 'Los colores de la página' },
        { id: 'b', text: 'El comportamiento y rendimiento de la app' },
        { id: 'c', text: 'El código fuente' },
        { id: 'd', text: 'Las contraseñas de usuarios' },
      ],
      correctId: 'b',
      explanation:
        'Las métricas nos muestran cómo se comporta la aplicación: tiempos de respuesta, errores, uso de recursos, etc.',
    },
    {
      question: '¿Qué protege HTTPS exactamente?',
      options: [
        { id: 'a', text: 'Solo las contraseñas' },
        { id: 'b', text: 'Toda la comunicación entre navegador y servidor' },
        { id: 'c', text: 'Solo los archivos grandes' },
        { id: 'd', text: 'Nada, es solo visual' },
      ],
      correctId: 'b',
      explanation:
        'HTTPS encripta absolutamente toda la comunicación entre el navegador y tu servidor.',
    },
    {
      question: '¿Cómo obtiene Traefik los certificados SSL automáticamente?',
      options: [
        { id: 'a', text: 'Los compra en internet' },
        { id: 'b', text: 'Usa Let\'s Encrypt' },
        { id: 'c', text: 'Los crea manualmente' },
        { id: 'd', text: 'No los necesita' },
      ],
      correctId: 'b',
      explanation:
        'Traefik se integra con Let\'s Encrypt para obtener certificados SSL gratuitos y renovarlos automáticamente.',
    },
    {
      question: '¿Qué has logrado al completar la Jornada Básica?',
      options: [
        { id: 'a', text: 'Solo teoría' },
        { id: 'b', text: 'Un chatbot profesional en producción' },
        { id: 'c', text: 'Una página estática' },
        { id: 'd', text: 'Un documento' },
      ],
      correctId: 'b',
      explanation:
        '¡Tienes un chatbot con IA, base de datos, en un servidor con HTTPS, caché y monitoreo!',
    },
  ];

  for (let i = 0; i < mission4Questions.length; i++) {
    await prisma.quizQuestion.upsert({
      where: { id: `m4q${i + 1}` },
      update: {},
      create: {
        id: `m4q${i + 1}`,
        missionId: 4,
        question: mission4Questions[i].question,
        options: mission4Questions[i].options,
        correctId: mission4Questions[i].correctId,
        explanation: mission4Questions[i].explanation,
        order: i + 1,
      },
    });
  }

  console.log('Created quiz questions for mission 4');

  // Create some sample cards
  const cards = [
    {
      missionId: 1,
      type: 'concept',
      icon: '🤖',
      title: '¿Qué es un LLM?',
      content: JSON.stringify({
        definition:
          'Large Language Model - Un modelo de IA entrenado con enormes cantidades de texto para entender y generar lenguaje.',
        examples: ['GPT-4', 'Claude', 'Gemini', 'Llama'],
        keyPoints: [
          'Predicen la siguiente palabra más probable',
          'Pueden entender contexto y generar respuestas coherentes',
          'Se acceden vía API con una key',
        ],
      }),
      order: 1,
    },
    {
      missionId: 1,
      type: 'command',
      icon: '⚡',
      title: 'Comandos esenciales de Next.js',
      content: JSON.stringify({
        commands: [
          { command: 'npx create-next-app@latest', description: 'Crear nuevo proyecto' },
          { command: 'npm run dev', description: 'Iniciar en modo desarrollo' },
          { command: 'npm run build', description: 'Compilar para producción' },
        ],
      }),
      order: 2,
    },
    {
      missionId: 2,
      type: 'command',
      icon: '🐳',
      title: 'Docker Essentials',
      content: JSON.stringify({
        commands: [
          { command: 'docker ps', description: 'Ver contenedores activos' },
          { command: 'docker logs <id>', description: 'Ver logs de un contenedor' },
          { command: 'docker stop <id>', description: 'Detener un contenedor' },
          { command: 'docker-compose up -d', description: 'Levantar todos los servicios' },
        ],
      }),
      order: 1,
    },
    {
      missionId: 3,
      type: 'rescue',
      icon: '🆘',
      title: 'No puedo conectar por SSH',
      content: JSON.stringify({
        problem: 'El comando ssh no conecta al servidor',
        steps: [
          { command: 'ping <ip>', explanation: 'Verificar que el servidor está activo' },
          { command: 'ssh -v user@ip', explanation: 'Ver detalles de la conexión' },
          { command: 'Revisar firewall', explanation: 'Asegurarse que el puerto 22 está abierto' },
        ],
      }),
      order: 1,
    },
    {
      missionId: 4,
      type: 'comparison',
      icon: '⚖️',
      title: '¿Redis vs Memcached?',
      content: JSON.stringify({
        columns: [
          { header: 'Redis', items: ['Estructuras de datos complejas', 'Persistencia opcional', 'Pub/Sub incluido'] },
          { header: 'Memcached', items: ['Solo key-value simple', 'Sin persistencia', 'Más simple'] },
        ],
        recommendation: 'Redis es más versátil. Úsalo por defecto.',
      }),
      order: 1,
    },
  ];

  for (const card of cards) {
    await prisma.card.create({
      data: {
        missionId: card.missionId,
        type: card.type,
        icon: card.icon,
        title: card.title,
        content: card.content,
        order: card.order,
      },
    });
  }

  console.log('Created sample cards');

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
