# Pagine Azzurre - Next.js Migration

Este es el proyecto Next.js migrado de la aplicación React original.

## 🚀 Estado de la Migración

### ✅ Completado

- **Proyecto Base:** Next.js 16 con TypeScript y Tailwind CSS
- **Estructura de Carpetas:** Arquitectura organizada y escalable
- **Variables de Entorno:** Configuración con `.env.local`
- **Tipos TypeScript:** Definiciones completas para User, Product, Order, Cart
- **API Client:** Axios configurado con interceptores de auth
- **API Wrappers:** Funciones para productos y usuarios
- **Gestión de Estado:** Zustand configurado para Cart y User
- **Componentes UI:** LoadingBox, MessageBox, Rating (con Tailwind)

### 🔄 En Progreso

- Layout principal (Header + Footer)
- Migración de páginas
- Componentes de layout

### ⏳ Pendiente

- 29 páginas de la aplicación
- Componentes complejos (SearchBox, Aside, etc.)
- Middleware de autenticación
- Server Components optimization
- Testing
- Deployment en Vercel

---

## 📁 Estructura del Proyecto

```
nextjs/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx           # Layout raíz
│   │   └── page.tsx             # Home page
│   ├── components/
│   │   ├── ui/                  # Componentes UI básicos
│   │   │   ├── LoadingBox.tsx
│   │   │   ├── MessageBox.tsx
│   │   │   └── Rating.tsx
│   │   └── layout/              # Componentes de layout (pendiente)
│   ├── lib/
│   │   ├── api/                 # Cliente API y wrappers
│   │   │   ├── client.ts
│   │   │   ├── products.ts
│   │   │   └── users.ts
│   │   ├── hooks/               # Custom hooks (pendiente)
│   │   ├── store/               # Zustand stores
│   │   │   ├── cart.ts
│   │   │   └── user.ts
│   │   └── utils/               # Utilidades (pendiente)
│   └── types/
│       └── index.ts             # Definiciones TypeScript
├── public/                       # Archivos estáticos
├── .env.local                    # Variables de entorno (no en git)
├── .env.example                  # Ejemplo de variables
└── package.json
```

---

## 🛠️ Instalación y Desarrollo

### Prerrequisitos

- Node.js 18+
- npm o yarn
- Backend Express corriendo en puerto 5050

### Instalación

```bash
# Navegar al directorio
cd nextjs

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env.local

# Editar .env.local con tus valores
```

### Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# Abrir en http://localhost:3000
```

### Build para Producción

```bash
# Crear build optimizado
npm run build

# Iniciar servidor de producción
npm start
```

---

## 🔧 Configuración

### Variables de Entorno

Edita `.env.local` con tus valores:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5050

# Otras configuraciones en .env.example
```

### Backend API

El frontend Next.js se comunica con el backend Express en `http://localhost:5050`.

Asegúrate de que el backend esté corriendo:

```bash
# En el directorio raíz del proyecto
npm start  # Inicia backend en puerto 5050
```

---

## 📦 Dependencias Principales

- **next**: 16.0.1 - Framework React
- **react**: 19.2.0 - Biblioteca UI
- **typescript**: ^5 - Superset tipado de JavaScript
- **tailwindcss**: ^4 - Framework CSS utility-first
- **zustand**: latest - Gestión de estado
- **axios**: latest - Cliente HTTP
- **react-qr-code**: latest - Generación de QR
- **date-fns**: latest - Manipulación de fechas

---

## 🎨 Diseño y Estilos

### Tailwind CSS

El proyecto usa Tailwind CSS 4 para estilos:

```tsx
// Ejemplo de uso
<div className="flex items-center gap-4 p-4 bg-blue-50">
  <h1 className="text-2xl font-bold">Pagine Azzurre</h1>
</div>
```

### Tema y Colores

Los colores principales están definidos en `tailwind.config.js` y pueden personalizarse.

---

## 🔐 Autenticación

### Zustand Store (Client-Side)

```tsx
import { useUserStore } from '@/lib/store/user';

function MyComponent() {
  const { userInfo, signin, signout } = useUserStore();

  const handleLogin = async () => {
    await signin(email, password);
  };

  return (
    <div>
      {userInfo ? (
        <span>Welcome {userInfo.username}</span>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

### API Client

El cliente API automáticamente añade el token JWT:

```typescript
// lib/api/client.ts ya está configurado
// Las peticiones automáticamente incluyen el Bearer token
```

---

## 🛒 Carrito de Compras

### Zustand Store con Persistencia

```tsx
import { useCartStore } from '@/lib/store/cart';

function ProductPage() {
  const { addToCart, cartItems } = useCartStore();

  const handleAddToCart = () => {
    addToCart({
      product: productId,
      name: productName,
      // ... otros campos
    });
  };

  return (
    <button onClick={handleAddToCart}>
      Add to Cart ({cartItems.length})
    </button>
  );
}
```

---

## 📱 Server Components vs Client Components

### Server Components (por defecto)

```tsx
// app/products/page.tsx
import { getProducts } from '@/lib/api/products';

export default async function ProductsPage() {
  // Fetch directo en Server Component
  const products = await getProducts();

  return (
    <div>
      {products.items.map(product => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
```

### Client Components

```tsx
// components/AddToCartButton.tsx
'use client';

import { useCartStore } from '@/lib/store/cart';

export default function AddToCartButton({ productId }) {
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <button onClick={() => addToCart(productId)}>
      Aggiungi al Carrello
    </button>
  );
}
```

---

## 🚀 Próximos Pasos

1. **Migrar Layout Completo**
   - Header con navegación
   - Footer con enlaces
   - Sidebar/Aside

2. **Migrar Páginas Críticas**
   - Home (/)
   - Product Detail (/product/[id])
   - Cart (/cart)
   - Auth (signin/register)

3. **Implementar Middleware**
   - Protección de rutas privadas
   - Verificación de roles (admin/seller)

4. **Optimizaciones**
   - Implementar Server Actions
   - Optimizar imágenes con next/image
   - Code splitting

5. **Deploy en Vercel**
   - Configurar variables de entorno
   - Deploy automático desde GitHub
   - Configurar dominio

---

## 📚 Recursos

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zustand Documentation](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vercel Deployment](https://vercel.com/docs)

---

## 🤝 Contribuir

Para contribuir a la migración:

1. Revisar `MIGRATION_NEXTJS.md` en el directorio raíz
2. Elegir una tarea pendiente
3. Seguir las convenciones establecidas
4. Crear commit con descripción clara

---

## ❓ FAQ

### ¿Por qué Next.js?

- SSR/SSG para mejor SEO
- Performance mejorado
- Mejor Developer Experience
- Deploy simplificado en Vercel
- Futuro-proof (React 19+)

### ¿Por qué Zustand en lugar de Redux?

- API más simple
- Menos boilerplate
- Mejor integración con Server Components
- Persist middleware incluido
- Bundle size más pequeño

### ¿Qué pasa con el backend?

El backend Express se mantiene independiente por ahora. En el futuro podemos migrar endpoints a Next.js API Routes gradualmente.

---

**Estado:** 🚧 En migración activa
**Última actualización:** 2025-11-06
