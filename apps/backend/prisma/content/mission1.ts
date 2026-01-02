// Mission 1: Tu asistente responde
// Contenido paso a paso con instrucciones específicas por SO

export const mission1Content = {
  version: 2,
  steps: [
    {
      id: 'step-1',
      title: 'Instalar Cursor',
      description: 'El editor de código con IA integrada',
      skip: {
        label: '¿Ya tienes Cursor instalado? Salta al paso 2',
        skipToStep: 'step-2',
      },
      os: {
        windows: {
          instructions: [
            {
              type: 'text',
              content:
                'Cursor es un editor de código basado en VS Code con IA integrada. Descárgalo desde el sitio oficial:',
            },
            {
              type: 'link',
              label: 'Descargar Cursor para Windows',
              url: 'https://cursor.sh',
            },
            {
              type: 'text',
              content:
                'Ejecuta el instalador (.exe) que descargaste y sigue las instrucciones. La instalación toma menos de 2 minutos.',
            },
            {
              type: 'tip',
              content:
                'Durante la instalación, marca la opción "Add to PATH" para poder abrir Cursor desde cualquier carpeta usando la terminal.',
            },
          ],
        },
        mac: {
          instructions: [
            {
              type: 'text',
              content:
                'Cursor es un editor de código basado en VS Code con IA integrada. Descárgalo desde el sitio oficial:',
            },
            {
              type: 'link',
              label: 'Descargar Cursor para macOS',
              url: 'https://cursor.sh',
            },
            {
              type: 'text',
              content:
                'Abre el archivo .dmg que descargaste y arrastra Cursor a tu carpeta de Aplicaciones.',
            },
            {
              type: 'shortcut',
              label: 'Para abrir Cursor',
              keys: ['Cmd', 'Space'],
              then: 'escribe "Cursor" y presiona Enter',
            },
            {
              type: 'tip',
              content:
                'Si macOS bloquea la app, ve a Preferencias del Sistema > Seguridad y Privacidad > "Abrir de todos modos".',
            },
          ],
        },
        linux: {
          instructions: [
            {
              type: 'text',
              content:
                'Cursor es un editor de código basado en VS Code con IA integrada. Descárgalo desde el sitio oficial:',
            },
            {
              type: 'link',
              label: 'Descargar Cursor para Linux (.AppImage)',
              url: 'https://cursor.sh',
            },
            {
              type: 'text',
              content: 'Dale permisos de ejecución y ejecútalo:',
            },
            {
              type: 'command',
              content: 'chmod +x Cursor-*.AppImage && ./Cursor-*.AppImage',
            },
            {
              type: 'tip',
              content:
                'Para agregar Cursor al menú de aplicaciones, usa AppImageLauncher o crea un archivo .desktop manualmente.',
            },
          ],
        },
      },
      checkpoint: {
        title: 'Verifica antes de continuar',
        items: [
          'Cursor se abre sin errores',
          'Ves la pantalla de bienvenida de Cursor',
        ],
      },
    },
    {
      id: 'step-2',
      title: 'Configurar Cursor con tu cuenta',
      description: 'Activa las funciones de IA',
      instructions: [
        {
          type: 'text',
          content:
            'Al abrir Cursor por primera vez, te pedirá iniciar sesión. Esto activa las funciones de IA que usaremos en todo el curso.',
        },
        {
          type: 'text',
          content:
            'Haz clic en "Sign In" y usa tu cuenta de Google, GitHub, o crea una cuenta nueva.',
        },
        {
          type: 'tip',
          content:
            'La cuenta gratuita de Cursor incluye 50 consultas de IA por mes. Si te quedas sin consultas, puedes usar tu propia API key de OpenAI.',
        },
      ],
      checkpoint: {
        items: [
          'Has iniciado sesión en Cursor',
          'Ves tu nombre/email en la esquina inferior izquierda',
        ],
      },
    },
    {
      id: 'step-3',
      title: 'Crear una carpeta para el proyecto',
      description: 'Organiza tu espacio de trabajo',
      os: {
        windows: {
          instructions: [
            {
              type: 'text',
              content:
                'Crea una carpeta donde guardarás todos los proyectos del curso. Te recomiendo:',
            },
            {
              type: 'command',
              content: 'mkdir C:\\proyectos\\curso',
            },
            {
              type: 'text',
              content: 'Ahora abre esa carpeta en Cursor:',
            },
            {
              type: 'shortcut',
              keys: ['Ctrl', 'K'],
              then: 'Ctrl + O para abrir carpeta',
            },
            {
              type: 'text',
              content: 'Navega a C:\\proyectos\\curso y haz clic en "Seleccionar carpeta".',
            },
          ],
        },
        mac: {
          instructions: [
            {
              type: 'text',
              content:
                'Crea una carpeta donde guardarás todos los proyectos del curso. Te recomiendo:',
            },
            {
              type: 'command',
              content: 'mkdir -p ~/proyectos/curso',
            },
            {
              type: 'text',
              content: 'Ahora abre esa carpeta en Cursor:',
            },
            {
              type: 'shortcut',
              keys: ['Cmd', 'O'],
              then: 'para abrir carpeta',
            },
            {
              type: 'text',
              content:
                'Navega a tu carpeta de usuario > proyectos > curso y haz clic en "Open".',
            },
          ],
        },
        linux: {
          instructions: [
            {
              type: 'text',
              content:
                'Crea una carpeta donde guardarás todos los proyectos del curso:',
            },
            {
              type: 'command',
              content: 'mkdir -p ~/proyectos/curso',
            },
            {
              type: 'text',
              content: 'Ahora abre esa carpeta en Cursor:',
            },
            {
              type: 'shortcut',
              keys: ['Ctrl', 'K'],
              then: 'Ctrl + O para abrir carpeta',
            },
            {
              type: 'text',
              content:
                'Navega a /home/tu-usuario/proyectos/curso y haz clic en "Open".',
            },
          ],
        },
      },
      checkpoint: {
        items: [
          'Ves el nombre de la carpeta "curso" en la barra lateral de Cursor',
          'La carpeta está vacía (por ahora)',
        ],
      },
    },
    {
      id: 'step-4',
      title: 'Abrir el chat de IA de Cursor',
      description: 'Tu copiloto de programación',
      instructions: [
        {
          type: 'text',
          content:
            'Cursor tiene un chat de IA integrado que puede crear proyectos completos. Vamos a abrirlo:',
        },
        {
          type: 'shortcut',
          keys: ['Ctrl/Cmd', 'L'],
          then: 'para abrir el chat de IA',
        },
        {
          type: 'text',
          content:
            'Debería aparecer un panel en el lado derecho con un área de texto donde puedes escribir.',
        },
        {
          type: 'tip',
          content:
            'Este chat es diferente a ChatGPT. Cursor puede ver y modificar los archivos de tu proyecto directamente.',
        },
      ],
      checkpoint: {
        items: [
          'Ves el panel de chat de IA en el lado derecho',
          'Hay un campo de texto donde puedes escribir',
        ],
      },
    },
    {
      id: 'step-5',
      title: 'Crear tu chatbot con un prompt',
      description: 'La magia de programar con IA',
      instructions: [
        {
          type: 'text',
          content:
            'Ahora viene lo más emocionante. Copia y pega este prompt en el chat de Cursor:',
        },
        {
          type: 'command',
          content: `Crea un chatbot con Next.js que use la API de OpenAI.

Requisitos:
- Usa Next.js con App Router
- Interfaz de chat con burbujas de mensaje
- Diseño moderno con Tailwind CSS
- Input para escribir y botón de enviar
- Los mensajes se envían a la API de OpenAI y muestra la respuesta
- Guarda el historial de la conversación en el estado

Crea todos los archivos necesarios en esta carpeta.`,
        },
        {
          type: 'text',
          content:
            'Presiona Enter o haz clic en el botón de enviar. Cursor comenzará a generar los archivos.',
        },
        {
          type: 'warning',
          content:
            'Este proceso puede tomar 1-2 minutos. No cierres Cursor mientras trabaja.',
        },
      ],
      checkpoint: {
        items: [
          'Cursor ha creado varios archivos (los ves en la barra lateral)',
          'Hay archivos como package.json, page.tsx, y otros',
        ],
      },
    },
    {
      id: 'step-6',
      title: 'Instalar las dependencias',
      description: 'Descargar las librerías necesarias',
      os: {
        windows: {
          instructions: [
            {
              type: 'text',
              content:
                'Cursor creó el proyecto pero necesitamos instalar las librerías. Abre la terminal integrada:',
            },
            {
              type: 'shortcut',
              keys: ['Ctrl', 'Ñ'],
              then: 'para abrir la terminal (o Ctrl + ` si tu teclado es US)',
            },
            {
              type: 'text',
              content: 'En la terminal, ejecuta:',
            },
            {
              type: 'command',
              content: 'npm install',
            },
            {
              type: 'tip',
              content:
                'Si ves errores sobre "npm no encontrado", necesitas instalar Node.js desde nodejs.org',
            },
          ],
        },
        mac: {
          instructions: [
            {
              type: 'text',
              content:
                'Cursor creó el proyecto pero necesitamos instalar las librerías. Abre la terminal integrada:',
            },
            {
              type: 'shortcut',
              keys: ['Ctrl', '`'],
              then: 'para abrir la terminal',
            },
            {
              type: 'text',
              content: 'En la terminal, ejecuta:',
            },
            {
              type: 'command',
              content: 'npm install',
            },
            {
              type: 'tip',
              content:
                'Si ves errores sobre "npm no encontrado", instala Node.js con: brew install node (necesitas Homebrew)',
            },
          ],
        },
        linux: {
          instructions: [
            {
              type: 'text',
              content:
                'Cursor creó el proyecto pero necesitamos instalar las librerías. Abre la terminal integrada:',
            },
            {
              type: 'shortcut',
              keys: ['Ctrl', '`'],
              then: 'para abrir la terminal',
            },
            {
              type: 'text',
              content: 'En la terminal, ejecuta:',
            },
            {
              type: 'command',
              content: 'npm install',
            },
            {
              type: 'tip',
              content:
                'Si npm no está instalado: sudo apt install nodejs npm (Ubuntu/Debian) o sudo dnf install nodejs npm (Fedora)',
            },
          ],
        },
      },
      checkpoint: {
        items: [
          'El comando terminó sin errores graves',
          'Apareció una carpeta "node_modules" en la barra lateral',
        ],
      },
    },
    {
      id: 'step-7',
      title: 'Configurar tu API key de OpenAI',
      description: 'Conectar con la inteligencia artificial',
      instructions: [
        {
          type: 'text',
          content:
            'Para que el chatbot pueda responder, necesita una API key de OpenAI. Si no tienes una, créala aquí:',
        },
        {
          type: 'link',
          label: 'Crear API Key en OpenAI',
          url: 'https://platform.openai.com/api-keys',
        },
        {
          type: 'text',
          content:
            'Crea un archivo llamado .env.local en la raíz del proyecto con este contenido:',
        },
        {
          type: 'command',
          content: 'OPENAI_API_KEY=sk-tu-api-key-aqui',
        },
        {
          type: 'warning',
          content:
            'Nunca compartas tu API key. El archivo .env.local es ignorado por Git automáticamente.',
        },
        {
          type: 'tip',
          content:
            'OpenAI da $5 de crédito gratis a cuentas nuevas. Suficiente para todo el curso.',
        },
      ],
      checkpoint: {
        items: [
          'Creaste el archivo .env.local',
          'Pegaste tu API key de OpenAI',
        ],
      },
    },
    {
      id: 'step-8',
      title: 'Iniciar el servidor de desarrollo',
      description: 'Ver tu chatbot en acción',
      instructions: [
        {
          type: 'text',
          content: 'Es el momento de la verdad. En la terminal, ejecuta:',
        },
        {
          type: 'command',
          content: 'npm run dev',
        },
        {
          type: 'text',
          content: 'Espera a que veas un mensaje como "Ready on http://localhost:3000"',
        },
        {
          type: 'text',
          content: 'Abre tu navegador y ve a:',
        },
        {
          type: 'link',
          label: 'http://localhost:3000',
          url: 'http://localhost:3000',
        },
        {
          type: 'tip',
          content:
            'Si el puerto 3000 está ocupado, Next.js usará 3001, 3002, etc. Mira la terminal para ver el puerto correcto.',
        },
      ],
      checkpoint: {
        title: '¡Felicitaciones!',
        items: [
          'Ves la interfaz de chat en el navegador',
          'Puedes escribir un mensaje y recibir respuesta de la IA',
        ],
      },
    },
  ],
};

export default mission1Content;
