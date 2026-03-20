# Guia de Despliegue en Vercel

## Arquitectura de Produccion

```
┌─────────────────────────────────────────┐
│                                         │
│         VERCEL (Full-Stack)             │
│    https://pagine-azzurre.vercel.app    │
│                                         │
│    - Next.js 16 (Edge + Serverless)     │
│    - API Routes (Serverless Functions)  │
│    - Auth, Uploads, Payments            │
│                                         │
└──────────┬────────────┬────────────────┘
           │            │
           ▼            ▼
┌──────────────┐  ┌──────────────────────┐
│ MongoDB Atlas│  │ Fly.io               │
│ (Database)   │  │ (Blockchain Node)    │
│              │  │ Anvil / Besu QBFT    │
└──────────────┘  └──────────────────────┘
           │
           ▼
┌──────────────┐  ┌──────────────────────┐
│ AWS S3       │  │ Mailtrap             │
│ (Imagenes)   │  │ (Emails)             │
└──────────────┘  └──────────────────────┘
```

## Prerrequisitos

1. **Cuenta Vercel** (gratis para proyectos personales)
2. **Repositorio en GitHub** conectado a Vercel
3. **Servicios externos** configurados: MongoDB Atlas, AWS S3, Mailtrap, Fly.io (blockchain)

## Paso 1: Importar proyecto en Vercel

1. Ir a [vercel.com/new](https://vercel.com/new)
2. Importar el repositorio de GitHub
3. **Root Directory**: seleccionar `nextjs`
4. **Framework Preset**: Next.js (se detecta automaticamente)
5. Click en **Deploy**

## Paso 2: Configurar variables de entorno

En **Settings > Environment Variables** del proyecto en Vercel, agregar:

```bash
# Core
NEXTAUTH_SECRET=   # openssl rand -base64 32
NEXTAUTH_URL=https://pagine-azzurre.vercel.app

# Base de datos
MONGODB_URL=mongodb+srv://user:password@cluster.mongodb.net/pagineazzurre

# Blockchain
NEXT_PUBLIC_RPC_URL=https://pagine-azzurre-blockchain.fly.dev
NEXT_PUBLIC_CHAIN_ID=31337
NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
ADMIN_WALLET_ADDRESS=tu-admin-wallet
ADMIN_PRIVATE_KEY=tu-admin-private-key
ENTROPY=random-string-for-wallet-generation

# Email (Mailtrap)
MAILTRAP_API_KEY=tu-api-key
MAILTRAP_SENDER_EMAIL=noreply@pagineazzurre.it
MAILTRAP_SENDER_NAME=Pagine Azzurre
MAILTRAP_TEMPLATE_VERIFICATION=uuid
MAILTRAP_TEMPLATE_WELCOME=uuid
MAILTRAP_TEMPLATE_RECOVERY=uuid
MAILTRAP_TEMPLATE_PASSWORD_CHANGED=uuid
MAILTRAP_TEMPLATE_NEWSLETTER=uuid
MAILTRAP_TEMPLATE_ORDER_OFFERER=uuid
MAILTRAP_TEMPLATE_ORDER_BUYER=uuid
MAILTRAP_TEMPLATE_ORDER_MAILING=uuid

# AWS S3
AWS_REGION=eu-west-1
S3_KEY_ID=tu-access-key
S3_ACCESS_KEY=tu-secret-key
S3_BUCKET_NAME=pagineazzurre2

# Opcionales
PAYPAL_CLIENT_ID=tu-paypal-id
NEXT_PUBLIC_GOOGLE_API_KEY=tu-google-key
```

> **Importante**: Las variables `NEXT_PUBLIC_*` se inyectan en build time. Si las cambias, necesitas hacer redeploy.

## Paso 3: Dominio personalizado

1. Ir a **Settings > Domains**
2. Agregar `pagineazzurre.it` y `www.pagineazzurre.it`
3. Configurar DNS segun las instrucciones de Vercel:
   - `pagineazzurre.it` → registro A: `76.76.21.21`
   - `www.pagineazzurre.it` → CNAME: `cname.vercel-dns.com`

Vercel proporciona SSL automatico con certificados Let's Encrypt.

## Deploy automatico

Cada push a `master` despliega automaticamente a produccion. Los pull requests generan **Preview Deployments** con URL unica.

## Troubleshooting

### Variables NEXT_PUBLIC_ no se ven en el cliente
Las variables `NEXT_PUBLIC_*` se inyectan en **build time**. Si las cambias en Vercel, necesitas re-deploy:
- Ir a **Deployments** > click en los 3 puntos del ultimo deploy > **Redeploy**

### Timeouts en API Routes
Las Serverless Functions en Vercel tienen un timeout de 10s (Hobby) o 60s (Pro). Si alguna API route necesita mas tiempo (ej: operaciones blockchain), considerar:
- Optimizar la operacion
- Upgrade a plan Pro

### MongoDB Atlas: whitelist
Agregar `0.0.0.0/0` en la whitelist de MongoDB Atlas, ya que las IPs de Vercel son dinamicas.

### Logs
Ver logs en tiempo real en **Deployments > Functions** o usar:
```bash
vercel logs pagine-azzurre.vercel.app
```

## Checklist de Despliegue

- [ ] Proyecto importado en Vercel con root directory `nextjs`
- [ ] Todas las variables de entorno configuradas
- [ ] MongoDB Atlas: IP whitelist incluye `0.0.0.0/0`
- [ ] AWS S3: Bucket y credenciales configurados
- [ ] Mailtrap: API key de produccion y dominio verificado
- [ ] Fly.io: Nodo blockchain accesible desde internet
- [ ] Build exitoso en Vercel
- [ ] Auth funciona (registro + login)
- [ ] Emails se envian correctamente
- [ ] Subida de imagenes a S3 funciona
- [ ] Pagos con tokens VLZ funcionan
- [ ] Dominio personalizado configurado (opcional)
