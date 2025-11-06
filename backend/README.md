# 🚂 Pagine Azzurre - Backend API

Backend Express + MongoDB para Pagine Azzurre marketplace.

## 🚀 Deploy en Railway

### Variables de Entorno Requeridas

Configura estas variables en Railway Dashboard:

```env
# Base de Datos (OBLIGATORIO)
MONGODB_URL=mongodb+srv://user:pass@cluster.mongodb.net/pagineazzurre

# JWT (OBLIGATORIO)
JWT_SECRET=tu-secret-muy-largo-y-seguro-aqui

# SendGrid para emails (OBLIGATORIO)
SENDGRID_API_KEY=SG.xxx

# Web3/Blockchain (OBLIGATORIO)
WEB3_INFURA_URL=wss://goerli.infura.io/ws/v3/tu-key
WEB3_NETWORK_ID=5

# Configuración
NODE_ENV=production
PORT=5050
ALLOW_SEED=false
```

### Pasos para Deploy:

1. **Crear servicio en Railway**
   - New Project → Deploy from GitHub
   - Selecciona el repo `pagine_azzurre`
   - Root Directory: `backend`

2. **Configurar Variables**
   - Ve a Variables tab
   - Añade todas las variables de arriba

3. **Deploy**
   - Railway desplegará automáticamente
   - Obtén la URL: `https://tu-backend.railway.app`

4. **Verificar**
   ```bash
   curl https://tu-backend.railway.app/api/products?pageNumber=1
   ```

## 🔧 Desarrollo Local

```bash
# Instalar dependencias
npm install

# Configurar .env
cp .env.example .env
# Editar .env con tus valores

# Iniciar servidor
npm start

# Modo desarrollo con auto-reload
npm run dev
```

## 📋 Endpoints Principales

- `GET /api/products` - Listar productos
- `GET /api/products/:id` - Detalle de producto
- `POST /api/users/signin` - Login
- `POST /api/users/signup` - Registro
- `POST /api/orders` - Crear orden

## 🔐 CORS

Configurar en Railway después del deploy:

```javascript
const allowedOrigins = [
  'https://tu-frontend.vercel.app',
  'http://localhost:3000'
];
```

## 📊 MongoDB Atlas

1. Crea cluster en [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Database Access → Add user
3. Network Access → Add IP: `0.0.0.0/0` (Railway)
4. Copia connection string
5. Pega en variable `MONGODB_URL` en Railway

## ✅ Estado

- ✅ Express 4.17
- ✅ MongoDB + Mongoose
- ✅ JWT Authentication
- ✅ SendGrid Email
- ✅ Web3 Integration
- ✅ Express Validator
- ✅ File Upload (Multer)
- ✅ CORS configurado
