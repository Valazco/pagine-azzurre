# 🚀 Guía de Despliegue en Vercel

Esta guía te ayudará a desplegar la aplicación Next.js de Pagine Azzurre en Vercel.

## 📋 Prerrequisitos

1. **Cuenta de Vercel**: Crea una cuenta gratuita en [vercel.com](https://vercel.com)
2. **Backend desplegado**: El backend Express debe estar accesible desde internet
3. **Git repository**: El código debe estar en GitHub, GitLab o Bitbucket

## 🏗️ Arquitectura de Despliegue

```
┌─────────────────────────────────────────┐
│                                         │
│         VERCEL (Frontend)               │
│      https://pagineazzurre.vercel.app   │
│                                         │
│      - Next.js 16                       │
│      - Static Generation                │
│      - Edge Functions                   │
│                                         │
└──────────────┬──────────────────────────┘
               │
               │ HTTPS Requests
               │ (NEXT_PUBLIC_API_URL)
               │
               ▼
┌─────────────────────────────────────────┐
│                                         │
│    BACKEND (Express + MongoDB)          │
│    https://api.pagineazzurre.net        │
│                                         │
│    Opciones de hosting:                 │
│    - Railway.app                        │
│    - Render.com                         │
│    - DigitalOcean App Platform          │
│    - AWS EC2/ECS                        │
│    - Heroku                             │
│                                         │
└─────────────────────────────────────────┘
```

## 🎯 Opción 1: Despliegue desde GitHub (Recomendado)

### Paso 1: Preparar el Repositorio

1. Asegúrate de que todos los cambios estén commiteados:
   ```bash
   cd /home/user/pagine_azzurre
   git status
   git add .
   git commit -m "chore: Prepare for Vercel deployment"
   git push origin tu-branch
   ```

### Paso 2: Importar Proyecto en Vercel

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Conecta tu cuenta de GitHub/GitLab/Bitbucket
3. Selecciona el repositorio `pagine_azzurre`
4. Configura el proyecto:
   - **Framework Preset**: Next.js
   - **Root Directory**: `nextjs` (MUY IMPORTANTE)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### Paso 3: Configurar Variables de Entorno

En la sección "Environment Variables", añade:

```env
NEXT_PUBLIC_API_URL=https://tu-backend-api.com
NODE_ENV=production
```

⚠️ **IMPORTANTE**: Reemplaza `https://tu-backend-api.com` con la URL real de tu backend.

### Paso 4: Deploy

1. Haz click en "Deploy"
2. Espera a que se complete el build (2-3 minutos)
3. ¡Tu aplicación estará en vivo! 🎉

## 🎯 Opción 2: Despliegue con Vercel CLI

### Instalación

```bash
npm i -g vercel
```

### Login

```bash
vercel login
```

### Deploy

```bash
cd /home/user/pagine_azzurre/nextjs
vercel
```

Sigue las instrucciones interactivas:
- Link to existing project? **No**
- Project name: **pagine-azzurre**
- Directory: **./nextjs** (si estás en la raíz) o **./** (si estás en nextjs)

Para producción:
```bash
vercel --prod
```

### Configurar Variables de Entorno

```bash
vercel env add NEXT_PUBLIC_API_URL production
# Ingresa: https://tu-backend-api.com

vercel env add NODE_ENV production
# Ingresa: production
```

## 🔧 Configuración del Backend

### CORS Configuration

El backend debe permitir requests desde tu dominio de Vercel:

```javascript
// backend/server.js
import cors from 'cors';

const allowedOrigins = [
  'http://localhost:3000',
  'https://pagineazzurre.vercel.app',
  'https://tu-dominio-custom.com'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

### Opciones de Despliegue del Backend

#### 1. **Railway.app** (Recomendado - Gratis hasta $5/mes)

```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login
railway login

# Inicializar proyecto
cd /home/user/pagine_azzurre/backend
railway init

# Deploy
railway up

# Obtener URL
railway domain
```

#### 2. **Render.com** (Gratis con limitaciones)

1. Ve a [render.com](https://render.com)
2. Conecta tu repositorio
3. Crea un nuevo "Web Service"
4. Configura:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
5. Añade variables de entorno (MongoDB, JWT_SECRET, etc.)

#### 3. **DigitalOcean App Platform**

1. Ve a [cloud.digitalocean.com/apps](https://cloud.digitalocean.com/apps)
2. Crea nueva app desde GitHub
3. Selecciona el directorio `backend`
4. Configura variables de entorno
5. Deploy

## 🔐 Variables de Entorno Necesarias

### Frontend (Vercel)
```env
NEXT_PUBLIC_API_URL=https://api.pagineazzurre.net
NODE_ENV=production
```

### Backend (Railway/Render/etc.)
```env
NODE_ENV=production
PORT=5050
MONGODB_URL=mongodb+srv://user:password@cluster.mongodb.net/pagineazzurre
JWT_SECRET=tu-secret-muy-seguro-y-largo-aqui
SENDGRID_API_KEY=SG.xxx
WEB3_INFURA_URL=wss://goerli.infura.io/ws/v3/tu-key
WEB3_NETWORK_ID=5
ALLOW_SEED=false
```

## 🧪 Testing en Producción

### 1. Verificar el Frontend
```bash
curl https://tu-app.vercel.app
```

### 2. Verificar la API
```bash
curl https://tu-backend-api.com/api/products?pageNumber=1
```

### 3. Verificar CORS
```bash
curl -H "Origin: https://tu-app.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     https://tu-backend-api.com/api/products
```

## 🐛 Troubleshooting

### Error: "API is not accessible"

**Causa**: El backend no está accesible o CORS no está configurado.

**Solución**:
1. Verifica que el backend esté en línea
2. Revisa la configuración de CORS
3. Verifica la variable `NEXT_PUBLIC_API_URL` en Vercel

### Error: "Environment variable not found"

**Causa**: Las variables de entorno no están configuradas en Vercel.

**Solución**:
1. Ve a Vercel Dashboard > Project > Settings > Environment Variables
2. Añade `NEXT_PUBLIC_API_URL`
3. Redeploy el proyecto

### Error: "Module not found" durante build

**Causa**: Dependencias no instaladas o package.json corrupto.

**Solución**:
```bash
cd nextjs
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Imágenes no cargan

**Causa**: Next.js Image optimization necesita configuración de dominios.

**Solución**: Ya está configurado en `next.config.ts` con `remotePatterns`.

## 📊 Monitoreo y Analytics

### Vercel Analytics (Recomendado)

1. Ve a Vercel Dashboard > Project > Analytics
2. Activa Vercel Analytics (gratis hasta 100k requests/mes)
3. Verás métricas de performance y web vitals

### Sentry para Error Tracking

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

## 🚀 Optimizaciones Post-Despliegue

### 1. Dominio Custom

1. Ve a Vercel Dashboard > Project > Settings > Domains
2. Añade tu dominio (ej: `www.pagineazzurre.net`)
3. Configura DNS según instrucciones de Vercel

### 2. Edge Functions

Las funciones de API pueden moverse a Vercel Edge Functions para mejor performance.

### 3. ISR (Incremental Static Regeneration)

Considera usar ISR para la página de productos:

```typescript
// app/page.tsx
export const revalidate = 60; // Revalidar cada 60 segundos
```

## 📞 Soporte

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Community**: [github.com/vercel/next.js/discussions](https://github.com/vercel/next.js/discussions)

## ✅ Checklist de Despliegue

- [ ] Backend desplegado y accesible
- [ ] CORS configurado en backend
- [ ] Variables de entorno configuradas en Vercel
- [ ] Proyecto conectado a Git
- [ ] Build exitoso en Vercel
- [ ] API funcionando desde el frontend desplegado
- [ ] Imágenes cargando correctamente
- [ ] Dominio custom configurado (opcional)
- [ ] Analytics activado
- [ ] Monitoring configurado

---

**¡Listo para desplegar!** 🎉

Si necesitas ayuda, revisa la documentación oficial o contacta con el equipo de Pagine Azzurre.
