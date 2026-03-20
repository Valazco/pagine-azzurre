# 🏪 Pagine Azzurre - Next.js Frontend

Aplicación Next.js moderna para Pagine Azzurre marketplace.

## 🚀 Quick Start

### Desarrollo Local

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus valores

# Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## 📦 Scripts Disponibles

```bash
npm run dev          # Modo desarrollo (puerto 3000)
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linter
npm run type-check   # Verificar tipos TypeScript
```

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env.local` basado en `.env.example`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5050
```

**Importante**: `NEXT_PUBLIC_` hace que la variable esté disponible en el cliente.

## 🏗️ Estructura del Proyecto

```
nextjs/
├── public/              # Archivos estáticos
│   ├── logos/          # Logos de la plataforma
│   └── img-not-found.png
├── src/
│   ├── app/            # App Router (Next.js 13+)
│   │   ├── layout.tsx  # Layout principal
│   │   ├── page.tsx    # Página de inicio
│   │   └── globals.css # Estilos globales
│   ├── components/
│   │   ├── layout/     # Header, Footer
│   │   └── ui/         # Componentes UI reutilizables
│   ├── lib/
│   │   ├── api/        # Cliente API y wrappers
│   │   └── store/      # Zustand stores
│   └── types/          # TypeScript types
├── .env.local          # Variables de entorno (local)
├── .env.example        # Plantilla de variables
├── next.config.ts      # Configuración de Next.js
├── tailwind.config.ts  # Configuración de Tailwind
└── tsconfig.json       # Configuración de TypeScript
```

## 🎨 Stack Tecnológico

- **Framework**: Next.js 16 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS 4.0
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Iconos**: Lucide React

## 📚 Características

- ✅ Diseño responsive moderno
- ✅ Optimización de imágenes con Next.js Image
- ✅ TypeScript para type safety
- ✅ Zustand para estado global
- ✅ Integración completa con API Express
- ✅ Componentes UI modernos
- ✅ Soporte para productos con VAL cryptocurrency

## 🚢 Despliegue

### Vercel (Recomendado)

Ver [DEPLOYMENT.md](./DEPLOYMENT.md) para instrucciones completas.

**Pasos rápidos:**

1. Push a GitHub
2. Conecta en [vercel.com](https://vercel.com)
3. Configura root directory: `nextjs`
4. Añade variable de entorno: `NEXT_PUBLIC_API_URL`
5. Deploy! 🚀

### Otros Proveedores

- **Netlify**: Soportado
- **Railway**: Soportado
- **Cloudflare Pages**: Soportado

## 🔗 Backend

Este frontend requiere el backend Express corriendo. Ver `/backend/README.md`.

**API esperada**: `http://localhost:5050/api`

## 🐛 Troubleshooting

### Error: "Cannot find module"
```bash
rm -rf node_modules .next
npm install
npm run dev
```

### Error: "API not accessible"
Verifica que el backend esté corriendo en el puerto 5050 y que `NEXT_PUBLIC_API_URL` esté correctamente configurado.

### Errores de TypeScript
```bash
npm run type-check
```

## 📖 Documentación Adicional

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Zustand Docs](https://zustand-demo.pmnd.rs/)

## 🤝 Contribuir

Ver [CONTRIBUTING.md](../CONTRIBUTING.md) para guías de contribución.

## 📄 Licencia

Ver [LICENSE](../LICENSE)

---

**Desarrollado con ❤️ para Pagine Azzurre**
