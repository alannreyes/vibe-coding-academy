# Configuración de Firebase

Guía paso a paso para configurar Firebase Authentication con Google Sign-In.

> **Nota:** Este proyecto NO requiere Firebase Admin SDK ni private keys.
> Usamos la API pública de Firebase para verificar tokens, lo cual es más simple
> y funciona en cuentas organizacionales con restricciones.

## 1. Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Click en "Agregar proyecto"
3. Nombre del proyecto: `vibe-coding-academy` (o el que prefieras)
4. Desactiva Google Analytics (opcional para desarrollo)
5. Click en "Crear proyecto"

## 2. Habilitar Authentication

1. En el menú lateral, ve a **Build > Authentication**
2. Click en "Comenzar"
3. En la pestaña "Sign-in method", habilita **Google**
4. Configura el correo de soporte (tu email)
5. Guarda los cambios

## 3. Obtener Credenciales del Cliente (Frontend)

1. En la consola de Firebase, click en el engranaje ⚙️ > **Project settings**
2. Baja hasta "Your apps" y click en el icono web `</>`
3. Registra la app con un nombre (ej: "vibe-frontend")
4. Copia las credenciales que aparecen:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  // ...
};
```

5. Agrega estas variables a tu `.env`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto
```

## 4. Configurar Backend (Sin Admin SDK)

Este proyecto usa la API pública de Firebase para verificar tokens,
por lo que **NO necesitas** generar private keys ni configurar el Admin SDK.

Solo necesitas agregar el `FIREBASE_PROJECT_ID` en el backend:

```env
FIREBASE_PROJECT_ID=tu-proyecto
```

> **¿Por qué no Admin SDK?** Muchas organizaciones restringen la creación
> de service account keys. Nuestra implementación usa la API de Identity Toolkit
> de Google que es pública y segura.

## 5. Configurar Dominios Autorizados

Para que funcione en producción:

1. En Firebase Console > Authentication > Settings
2. Ve a la pestaña "Authorized domains"
3. Agrega tus dominios:
   - `localhost` (ya debería estar)
   - Tu dominio de producción (ej: `vibecoding.academy`)

## 6. Verificar la Configuración

### Frontend
El frontend debería poder:
1. Mostrar el botón de "Iniciar con Google"
2. Abrir popup de Google al hacer click
3. Redirigir al dashboard después de autenticarse

### Backend
El backend debería poder:
1. Recibir el token de Firebase en `/api/auth/login`
2. Verificar el token con Firebase Admin SDK
3. Crear/actualizar el usuario en la base de datos

## Troubleshooting

### Error: "Firebase App not initialized"
- Verifica que las variables de entorno estén correctas
- Reinicia el servidor de desarrollo

### Error: "Invalid token"
- El token de Firebase expira cada hora
- Asegúrate de que el reloj de tu sistema esté sincronizado

### Error: "Unauthorized domain"
- Agrega el dominio a la lista de dominios autorizados en Firebase

### Error en Private Key
Si tienes errores con la private key:

```bash
# En Linux/Mac, puedes escapar correctamente así:
export FIREBASE_PRIVATE_KEY=$(cat path/to/serviceAccountKey.json | jq -r '.private_key')
```

O en el archivo `.env`, asegúrate de que esté en una sola línea con `\n` escapados.

## Ejemplo de .env Completo

```env
# Database
DATABASE_URL=postgresql://vibe:vibe123@localhost:5432/vibe_academy

# Firebase (sin Admin SDK)
FIREBASE_PROJECT_ID=fullstack-ia-generativa

# Firebase Client (Frontend)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBgi4awTzsEGKu9Vn6YfYDqJct631FzpTM
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=fullstack-ia-generativa.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=fullstack-ia-generativa

# App URLs
BACKEND_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3000
```
