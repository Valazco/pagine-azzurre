# Plan de Migración: React (CRA) → Next.js + Vercel

## 📊 Análisis de la Aplicación Actual

### Estructura Actual
```
pagine_azzurre/
├── backend/                    # Express + MongoDB
│   ├── routers/               # API endpoints
│   ├── models/                # MongoDB schemas
│   ├── middlewares/           # Validación, auth
│   └── emailTemplates/        # Email templates
└── frontend/                   # Create React App
    └── src/
        ├── screens/           # 29 páginas
        ├── components/        # 17 componentes
        ├── actions/           # Redux actions
        ├── reducers/          # Redux reducers
        ├── constants/         # Redux constants
        ├── sass/              # Estilos SCSS
        └── resources/         # Recursos estáticos
```

### Stack Tecnológico Actual
- **Frontend:** React 16.13 + Redux + React Router v5
- **Backend:** Node.js + Express + MongoDB
- **Estilos:** SASS/SCSS
- **Estado:** Redux + Redux Thunk
- **Routing:** React Router DOM v5
- **Build:** Create React App (react-scripts)

### Páginas Identificadas (29)
1. HomeScreen - `/`
2. ProductScreen - `/product/:id`
3. CartScreen - `/cart/:id?`
4. SigninScreen - `/signin`
5. RegisterScreen - `/register`
6. ProfileScreen - `/profile` (privada)
7. ShippingAddressScreen - `/shipping`
8. PaymentMethodScreen - `/payment`
9. PlaceOrderScreen - `/placeorder`
10. OrderScreen - `/order/:id`
11. OrderHistoryScreen - `/orderhistory`
12. ProductListScreen - `/productlist` (admin/seller)
13. ProductEditScreen - `/product/:id/edit`
14. OrderListScreen - `/orderlist` (admin/seller)
15. UserListScreen - `/userlist` (admin)
16. UserEditScreen - `/user/:id/edit` (admin)
17. SearchScreen - `/search/*` (múltiples variantes)
18. SellerScreen - `/seller/:id`
19. MapScreen - `/map` (privada)
20. NewsletterScreen - `/newsletter`
21. ThankYouScreen - `/newsletter/:string`
22. TuttiNoiScreen - `/tutti_noi`
23. PrivacyScreen - `/privacy`
24. PasswordRecoveryScreen - `/password-recovery`
25. ChangePassword - `/password-recovery/:id`
26. VerificationScreen - `/verification`
27. VerifiedScreen - `/verification/:id`
28. TopSellersScreen
29. ToReadScreen

---

## 🎯 Objetivos de la Migración

### Beneficios de Next.js
- ✅ **SSR/SSG:** Mejora SEO y tiempo de carga inicial
- ✅ **App Router:** Sistema de routing moderno basado en archivos
- ✅ **API Routes:** Posibilidad de incluir backend en el mismo proyecto
- ✅ **Image Optimization:** Componente `<Image>` optimizado
- ✅ **TypeScript:** Soporte first-class (opcional pero recomendado)
- ✅ **Performance:** Automatic code splitting, prefetching
- ✅ **Developer Experience:** Fast refresh, mejor DX

### Beneficios de Vercel
- ✅ **Zero-Config Deployment:** Deploy con un comando
- ✅ **Automatic HTTPS:** SSL/TLS automático
- ✅ **Global CDN:** Edge network mundial
- ✅ **Serverless Functions:** Para el backend
- ✅ **Preview Deployments:** PR automáticamente deployados
- ✅ **Analytics:** Web vitals integrados
- ✅ **Domain Management:** Gestión de dominios simplificada

---

## 🏗️ Arquitectura Propuesta

### Opción 1: Monorepo (RECOMENDADO)
```
pagine_azzurre/
├── app/                        # Next.js App Router
│   ├── (auth)/                # Grupo de rutas de autenticación
│   ├── (shop)/                # Grupo de rutas de tienda
│   ├── (admin)/               # Grupo de rutas de admin
│   ├── api/                   # API Routes (migración parcial)
│   └── layout.tsx             # Layout principal
├── components/                 # Componentes React
├── lib/                       # Utilidades y lógica
│   ├── api/                   # Cliente API
│   ├── hooks/                 # Custom hooks
│   └── store/                 # Gestión de estado
├── public/                    # Archivos estáticos
├── styles/                    # Estilos globales
└── server/                    # Backend Express (opcional)
    ├── routers/
    ├── models/
    └── middlewares/
```

**Ventajas:**
- Un solo repositorio, más fácil de mantener
- Compartir tipos TypeScript entre frontend y backend
- Deploy simplificado en Vercel
- Posibilidad de migrar gradualmente a API Routes

**Desventajas:**
- Proyecto más grande
- Necesita configuración especial para Vercel si mantenemos Express

### Opción 2: Separado (Backend independiente)
```
pagine_azzurre-frontend/        # Next.js App
├── app/
├── components/
└── lib/

pagine_azzurre-api/            # Express API (separado)
├── routers/
├── models/
└── middlewares/
```

**Ventajas:**
- Separación clara de responsabilidades
- Backend puede deployarse en otro servicio
- Más flexible para escalar independientemente

**Desventajas:**
- Dos repositorios para mantener
- CORS más complejo
- Deploy en dos plataformas diferentes

---

## 📝 Plan de Migración Detallado

### Fase 1: Preparación (1-2 días)

#### 1.1 Decisiones Arquitectónicas
- [ ] Elegir opción de arquitectura (Monorepo vs Separado)
- [ ] Decidir: TypeScript o JavaScript (TypeScript RECOMENDADO)
- [ ] Decidir: App Router vs Pages Router (App Router RECOMENDADO)
- [ ] Decidir: Gestión de estado (Redux vs Zustand vs Context API)
- [ ] Decidir: Backend en API Routes vs Express separado

#### 1.2 Setup Inicial
```bash
# Crear nueva app Next.js
npx create-next-app@latest pagine-azzurre-nextjs --typescript --tailwind --app --src-dir

# O sin TypeScript
npx create-next-app@latest pagine-azzurre-nextjs --app --src-dir
```

#### 1.3 Configuración Base
- [ ] Configurar `next.config.js`
- [ ] Configurar variables de entorno (`.env.local`)
- [ ] Migrar estilos SCSS a Tailwind/CSS Modules
- [ ] Configurar ESLint y Prettier

---

### Fase 2: Migración de Componentes (2-3 días)

#### 2.1 Componentes Básicos (sin dependencias de routing)
Migrar estos componentes primero (fácil, sin cambios mayores):

```
✅ LoadingBox.js
✅ MessageBox.js
✅ Rating.js
✅ Footer.js
✅ Product.js
✅ CartItem.js
✅ CheckoutSteps.js
✅ WelcomeBanner.js
```

**Cambios necesarios:**
- Convertir a TypeScript (opcional)
- Usar componentes Client (`'use client'`) si tienen estado/eventos
- Actualizar imports

**Ejemplo de migración:**
```javascript
// Antes (React)
// components/LoadingBox.js
export default function LoadingBox() {
  return <div className="loading">Loading...</div>;
}

// Después (Next.js)
// components/LoadingBox.tsx
export default function LoadingBox() {
  return <div className="loading">Loading...</div>;
}
```

#### 2.2 Componentes con Estado
Estos necesitan `'use client'`:

```
✅ Header.js → 'use client'
✅ Aside.js → 'use client'
✅ SearchBox.js → 'use client'
✅ PreHeader.js → 'use client'
✅ PostHeader.js → 'use client'
```

**Ejemplo:**
```tsx
// components/Header.tsx
'use client';

import { useState } from 'react';

export default function Header({ setSidebarIsOpen }) {
  // ... componente con estado
}
```

#### 2.3 Componentes de Routing
Reemplazar `react-router-dom` con navegación de Next.js:

```javascript
// Antes (React Router)
import { Link, useHistory } from 'react-router-dom';

function Component() {
  const history = useHistory();

  return (
    <Link to="/products">Products</Link>
    <button onClick={() => history.push('/cart')}>Cart</button>
  );
}

// Después (Next.js)
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function Component() {
  const router = useRouter();

  return (
    <>
      <Link href="/products">Products</Link>
      <button onClick={() => router.push('/cart')}>Cart</button>
    </>
  );
}
```

**Componentes a actualizar:**
- PrivateRoute.js → Middleware o HOC
- AdminRoute.js → Middleware o HOC
- SellerRoute.js → Middleware o HOC

---

### Fase 3: Migración de Páginas (3-5 días)

#### 3.1 Estructura de Páginas con App Router

```
app/
├── layout.tsx                 # Layout principal
├── page.tsx                   # HomeScreen
├── (auth)/
│   ├── signin/
│   │   └── page.tsx          # SigninScreen
│   └── register/
│       └── page.tsx          # RegisterScreen
├── (shop)/
│   ├── product/
│   │   └── [id]/
│   │       ├── page.tsx      # ProductScreen
│   │       └── edit/
│   │           └── page.tsx  # ProductEditScreen
│   ├── cart/
│   │   └── [[...id]]/
│   │       └── page.tsx      # CartScreen (optional catch-all)
│   ├── search/
│   │   └── [...params]/
│   │       └── page.tsx      # SearchScreen (catch-all)
│   └── seller/
│       └── [id]/
│           └── page.tsx      # SellerScreen
├── (checkout)/
│   ├── shipping/
│   │   └── page.tsx          # ShippingAddressScreen
│   ├── payment/
│   │   └── page.tsx          # PaymentMethodScreen
│   └── placeorder/
│       └── page.tsx          # PlaceOrderScreen
├── (account)/
│   ├── profile/
│   │   └── page.tsx          # ProfileScreen
│   ├── orderhistory/
│   │   └── page.tsx          # OrderHistoryScreen
│   └── order/
│       └── [id]/
│           └── page.tsx      # OrderScreen
├── (admin)/
│   ├── layout.tsx            # Admin layout
│   ├── productlist/
│   │   └── page.tsx          # ProductListScreen
│   ├── orderlist/
│   │   └── page.tsx          # OrderListScreen
│   └── userlist/
│       └── page.tsx          # UserListScreen
├── newsletter/
│   └── [[...params]]/
│       └── page.tsx          # NewsletterScreen + ThankYouScreen
├── privacy/
│   └── page.tsx              # PrivacyScreen
└── tutti-noi/
    └── page.tsx              # TuttiNoiScreen
```

#### 3.2 Ejemplo de Página Migrada

**Antes (React + Redux):**
```jsx
// screens/ProductScreen.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { detailsProduct } from '../actions/productActions';

export default function ProductScreen(props) {
  const productId = props.match.params.id;
  const dispatch = useDispatch();
  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  useEffect(() => {
    dispatch(detailsProduct(productId));
  }, [dispatch, productId]);

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <h1>{product.name}</h1>
      {/* ... */}
    </div>
  );
}
```

**Después (Next.js App Router):**
```tsx
// app/(shop)/product/[id]/page.tsx
import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/api/products';

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <h1>{product.name}</h1>
      {/* ... */}
    </div>
  );
}

// Con Client Component para interactividad
'use client';

export function AddToCartButton({ productId }: { productId: string }) {
  // Lógica interactiva aquí
}
```

#### 3.3 Server Components vs Client Components

**Server Components (por defecto):**
- Fetching de datos
- Acceso a backend directo
- Sin interactividad
- Mejor performance

**Client Components (`'use client'`):**
- Estado (useState, useReducer)
- Efectos (useEffect)
- Event handlers
- Browser APIs

**Estrategia:**
1. Usar Server Components por defecto
2. Agregar `'use client'` solo cuando sea necesario
3. Mantener Client Components pequeños

---

### Fase 4: Gestión de Estado (2-3 días)

#### Opción A: Mantener Redux
```bash
npm install @reduxjs/toolkit react-redux
```

**Provider en layout:**
```tsx
// app/layout.tsx
import { Providers } from './providers';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

// app/providers.tsx
'use client';

import { Provider } from 'react-redux';
import { store } from '@/lib/store';

export function Providers({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
```

**Ventajas:**
- Migración más rápida
- Código existente funciona con pocos cambios

**Desventajas:**
- Redux es overhead para Next.js
- Server Components no pueden usar Redux

#### Opción B: Migrar a Zustand (RECOMENDADO)
```bash
npm install zustand
```

**Más simple, mejor DX:**
```typescript
// lib/store/cart.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) => set((state) => ({
        items: [...state.items, item]
      })),
      removeItem: (id) => set((state) => ({
        items: state.items.filter(i => i.id !== id)
      })),
    }),
    { name: 'cart-storage' }
  )
);

// Uso en componentes
'use client';
import { useCartStore } from '@/lib/store/cart';

function CartButton() {
  const { items, addItem } = useCartStore();
  // ...
}
```

**Ventajas:**
- Más ligero que Redux
- Mejor integración con Server Components
- API más simple
- Persist middleware incluido

**Desventajas:**
- Requiere refactorizar actions/reducers

#### Opción C: React Context + Server Actions
Para casos simples, usar Context API nativo:

```tsx
// lib/contexts/user-context.tsx
'use client';

import { createContext, useContext } from 'react';

const UserContext = createContext<User | null>(null);

export function UserProvider({ children, user }) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export const useUser = () => useContext(UserContext);
```

---

### Fase 5: API y Data Fetching (3-4 días)

#### 5.1 Estrategia de Backend

**Opción A: Mantener Express Separado**
- Backend en puerto 5050
- Next.js hace fetch a http://localhost:5050
- Deploy backend en Render/Railway/Heroku
- Next.js en Vercel

**Configuración:**
```javascript
// next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5050/api/:path*', // Dev
        // destination: process.env.API_URL + '/api/:path*', // Prod
      },
    ];
  },
};
```

**Opción B: Migrar a API Routes (Gradual)**
- Migrar endpoints simples a `/app/api`
- Mantener Express para lógica compleja
- Eventual migración completa

**Ejemplo de API Route:**
```typescript
// app/api/products/route.ts
import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/db/products';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  const products = await getProducts({ category });

  return NextResponse.json(products);
}
```

#### 5.2 Data Fetching en Next.js

**Server Components (Recomendado para datos iniciales):**
```tsx
// app/products/page.tsx
import { getProducts } from '@/lib/api/products';

export default async function ProductsPage() {
  // Fetch directo en Server Component
  const products = await getProducts();

  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

**Client Components (para datos dinámicos):**
```tsx
'use client';

import useSWR from 'swr';

export function ProductList() {
  const { data, error, isLoading } = useSWR('/api/products', fetcher);

  if (isLoading) return <LoadingBox />;
  if (error) return <MessageBox>Error</MessageBox>;

  return <div>{/* ... */}</div>;
}
```

**Server Actions (para mutaciones):**
```tsx
// app/actions/cart.ts
'use server';

import { revalidatePath } from 'next/cache';

export async function addToCart(productId: string) {
  // Lógica de agregar al carrito
  await db.cart.add(productId);

  // Revalidar la página del carrito
  revalidatePath('/cart');
}

// Uso en Client Component
'use client';

import { addToCart } from '@/app/actions/cart';

export function AddToCartButton({ productId }) {
  return (
    <button onClick={() => addToCart(productId)}>
      Add to Cart
    </button>
  );
}
```

---

### Fase 6: Autenticación y Middleware (2-3 días)

#### 6.1 Middleware de Next.js

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  // Rutas protegidas
  if (request.nextUrl.pathname.startsWith('/profile')) {
    if (!token) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }
  }

  // Rutas de admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Verificar si es admin (decode JWT)
    if (!isAdmin(token)) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/admin/:path*', '/orderhistory/:path*'],
};
```

#### 6.2 Auth con JWT

```typescript
// lib/auth.ts
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function getUser() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded;
  } catch {
    return null;
  }
}

// Uso en Server Component
export default async function ProfilePage() {
  const user = await getUser();

  if (!user) {
    redirect('/signin');
  }

  return <div>Welcome {user.name}</div>;
}
```

---

### Fase 7: Estilos (1-2 días)

#### Opciones de Migración de Estilos

**Opción A: Migrar a Tailwind CSS (RECOMENDADO)**
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Ventajas:**
- Utility-first, muy rápido
- Excelente DX
- Purge automático de CSS no usado
- Bien integrado con Next.js

**Desventajas:**
- Requiere refactorizar todos los estilos

**Opción B: Mantener SASS/SCSS**
```bash
npm install sass
```

**Configuración:**
```typescript
// next.config.js
module.exports = {
  sassOptions: {
    includePaths: ['./styles'],
  },
};
```

**Ventajas:**
- Migración más rápida
- Mantener estilos existentes

**Desventajas:**
- Bundle size más grande
- Menos optimizado

**Opción C: CSS Modules (Híbrido)**
Usar CSS Modules para componentes específicos:

```tsx
// components/Product.module.css
.product {
  border: 1px solid #ddd;
  padding: 1rem;
}

// components/Product.tsx
import styles from './Product.module.css';

export function Product() {
  return <div className={styles.product}>...</div>;
}
```

---

### Fase 8: Deployment en Vercel (1 día)

#### 8.1 Preparación

**1. Crear cuenta en Vercel:**
- https://vercel.com/signup

**2. Instalar Vercel CLI:**
```bash
npm install -g vercel
```

**3. Configurar variables de entorno en Vercel:**
```
JWT_SECRET=...
MONGODB_URL=...
WEB3_INFURA_URL=...
SENDGRID_API_KEY=...
NODE_ENV=production
```

#### 8.2 Configuración de Vercel

**vercel.json:**
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

**next.config.js:**
```javascript
module.exports = {
  env: {
    API_URL: process.env.API_URL,
  },
  images: {
    domains: ['your-bucket.s3.amazonaws.com'],
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
    ];
  },
};
```

#### 8.3 Deploy

**Opción 1: Deploy desde CLI**
```bash
# Login
vercel login

# Deploy (preview)
vercel

# Deploy (production)
vercel --prod
```

**Opción 2: Deploy desde GitHub (RECOMENDADO)**
1. Push código a GitHub
2. Importar proyecto en Vercel dashboard
3. Configurar variables de entorno
4. Deploy automático en cada push

#### 8.4 Backend en Vercel

**Si usas API Routes:**
- Todo en un solo deploy ✅
- Serverless functions automáticas

**Si mantienes Express separado:**
- Deploy backend en Render/Railway/Heroku
- Configurar `API_URL` en Vercel
- Configurar CORS en backend

---

## 🚀 Estrategia de Migración Recomendada

### Enfoque Incremental (RECOMENDADO)

#### Semana 1-2: Setup y Componentes
1. ✅ Crear proyecto Next.js
2. ✅ Configurar TypeScript, ESLint, Prettier
3. ✅ Migrar componentes básicos (no routing)
4. ✅ Configurar estilos (Tailwind o SASS)
5. ✅ Configurar gestión de estado (Zustand)

#### Semana 3-4: Páginas Públicas
1. ✅ Migrar páginas públicas (Home, Products, Seller)
2. ✅ Implementar routing con App Router
3. ✅ Migrar componentes de routing
4. ✅ Configurar API client

#### Semana 5-6: Autenticación y Páginas Privadas
1. ✅ Implementar middleware de autenticación
2. ✅ Migrar páginas de auth (signin, register)
3. ✅ Migrar páginas privadas (profile, orders)
4. ✅ Implementar Server Actions

#### Semana 7-8: Admin y Checkout
1. ✅ Migrar páginas de admin
2. ✅ Migrar flujo de checkout
3. ✅ Implementar páginas de órdenes

#### Semana 9: Testing y Deploy
1. ✅ Testing completo
2. ✅ Optimización de performance
3. ✅ Deploy en Vercel (staging)
4. ✅ Testing en producción
5. ✅ Deploy final

---

## 📋 Checklist de Migración

### Preparación
- [ ] Decisión de arquitectura tomada
- [ ] Proyecto Next.js creado
- [ ] TypeScript configurado
- [ ] Variables de entorno configuradas
- [ ] Estilos configurados (Tailwind/SASS)
- [ ] Gestión de estado elegida

### Componentes
- [ ] Componentes básicos migrados
- [ ] Componentes con estado migrados
- [ ] Componentes de layout migrados
- [ ] Componentes de routing actualizados

### Páginas
- [ ] 29 páginas migradas
- [ ] Routing configurado
- [ ] Parámetros dinámicos funcionando
- [ ] Catch-all routes funcionando

### Estado y Datos
- [ ] Redux migrado o reemplazado
- [ ] API client configurado
- [ ] Data fetching funcionando
- [ ] Server Actions implementados

### Autenticación
- [ ] Middleware configurado
- [ ] JWT funcionando
- [ ] Rutas protegidas funcionando
- [ ] Roles (admin/seller) funcionando

### Backend
- [ ] API funcionando con Next.js
- [ ] Endpoints críticos testeados
- [ ] Blockchain integration funcionando
- [ ] Email integration funcionando

### Deploy
- [ ] Variables de entorno en Vercel
- [ ] Build exitoso
- [ ] Deploy staging funcionando
- [ ] Deploy production funcionando
- [ ] Dominio configurado
- [ ] SSL funcionando

### Post-Deploy
- [ ] Monitoreo configurado
- [ ] Analytics configurado
- [ ] Error tracking configurado
- [ ] Documentation actualizada

---

## ⚠️ Riesgos y Consideraciones

### Riesgos Técnicos
1. **Complejidad de Redux:** Redux puede ser desafiante con Server Components
2. **Blockchain Integration:** Web3 puede necesitar ajustes para Next.js
3. **SASS Migration:** Muchos estilos a migrar
4. **API Integration:** Backend separado puede tener latency

### Mitigación
1. Migrar gradualmente, página por página
2. Mantener rama `main` funcional, trabajar en branch
3. Testing exhaustivo antes de deploy
4. Tener rollback plan

---

## 🔧 Herramientas Útiles

### Development
- **Next.js DevTools:** Debugging de Server Components
- **Vercel CLI:** Deploy y testing local
- **Turbopack:** Bundler ultra-rápido (experimental)

### Testing
- **Vitest:** Unit testing
- **Playwright:** E2E testing
- **React Testing Library:** Component testing

### Performance
- **Lighthouse:** Web vitals
- **Bundle Analyzer:** Analizar bundle size
- **Vercel Analytics:** Performance en producción

---

## 📚 Recursos

### Documentación
- [Next.js Docs](https://nextjs.org/docs)
- [App Router Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)
- [Vercel Deployment](https://vercel.com/docs)

### Tutoriales
- [Next.js 14 Tutorial](https://nextjs.org/learn)
- [Server Components Deep Dive](https://nextjs.org/docs/app/building-your-application/rendering/server-components)

---

## 🎯 Próximos Pasos

¿Quieres que empiece con la migración? Puedo:

1. **Crear el proyecto Next.js base** con la estructura propuesta
2. **Migrar componentes básicos** como primer paso
3. **Configurar el sistema de estado** (Zustand recomendado)
4. **Crear la primera página de ejemplo** completamente migrada

¿Con cuál quieres empezar? 🚀
