# Piano di Migrazione: Express.js → Next.js API Routes

## Panoramica

Migrazione completa del backend Express.js a Next.js API Routes con NextAuth.js per l'autenticazione.

**Stack Attuale:**
- Backend: Express.js + MongoDB + JWT custom
- Frontend: React 16 + Redux
- Deployment: Railway (backend) + Vercel (frontend Next.js)

**Stack Finale:**
- Full-stack: Next.js 16 + MongoDB + NextAuth.js
- Blockchain: **Viem + Wagmi** (sostituisce web3.js)
- Email: **Mailtrap** (sostituisce SendGrid)
- Deployment: Vercel (tutto)

---

## Fase 1: Setup Fondamentale

### 1.1 Connessione Database MongoDB

Creare `/nextjs/src/lib/db/mongoose.ts`:
```typescript
// Singleton pattern per serverless
import mongoose from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URL!;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URL);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
```

### 1.2 Migrare Modelli MongoDB

Copiare e convertire a TypeScript:

| File Origine | File Destinazione |
|--------------|-------------------|
| `backend/models/userModel.js` | `nextjs/src/lib/db/models/User.ts` |
| `backend/models/productModel.js` | `nextjs/src/lib/db/models/Product.ts` |
| `backend/models/orderModel.js` | `nextjs/src/lib/db/models/Order.ts` |
| `backend/models/newsletterModel.js` | `nextjs/src/lib/db/models/Newsletter.ts` |
| `backend/models/messageModel.js` | `nextjs/src/lib/db/models/Message.ts` |

### 1.3 Setup NextAuth.js

Installare dipendenze:
```bash
npm install next-auth @auth/mongodb-adapter
```

Creare `/nextjs/src/app/api/auth/[...nextauth]/route.ts`:
```typescript
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectDB } from '@/lib/db/mongoose';
import User from '@/lib/db/models/User';
import bcrypt from 'bcryptjs';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        await connectDB();
        const user = await User.findOne({ email: credentials?.email });

        if (user && bcrypt.compareSync(credentials!.password, user.password)) {
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.username,
            isAdmin: user.isAdmin,
            isSeller: user.isSeller,
          };
        }
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.isAdmin = user.isAdmin;
        token.isSeller = user.isSeller;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.isAdmin = token.isAdmin;
      session.user.isSeller = token.isSeller;
      session.user.id = token.id;
      return session;
    }
  },
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: '/signin' }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

### 1.4 Middleware Protezione Route

Creare `/nextjs/src/middleware.ts`:
```typescript
import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const path = req.nextUrl.pathname;

      if (path.startsWith('/api/users') && req.method === 'GET' && !path.includes('/')) {
        return token?.isAdmin === true;
      }

      if (path.startsWith('/api/products') && ['POST', 'PUT', 'DELETE'].includes(req.method!)) {
        return token?.isSeller === true || token?.isAdmin === true;
      }

      return !!token;
    }
  }
});

export const config = {
  matcher: ['/api/orders/:path*', '/api/users/profile', '/api/uploads/:path*']
};
```

---

## Fase 2: Migrazione API Endpoints

### Struttura Directory API

```
nextjs/src/app/api/
├── auth/[...nextauth]/route.ts
├── users/
│   ├── route.ts                    # GET (admin), POST register
│   ├── [id]/route.ts               # GET, PUT, DELETE
│   ├── profile/route.ts            # GET, PUT
│   ├── top-sellers/route.ts
│   ├── sellers/route.ts
│   ├── upgrade/[id]/route.ts
│   ├── password-recovery/route.ts
│   ├── password-replacement/route.ts
│   ├── newsletter/route.ts
│   ├── newsletter/[email]/route.ts
│   ├── newsletterVerify/route.ts
│   ├── newsletterUpdate/route.ts
│   └── verification/[id]/route.ts
├── products/
│   ├── route.ts                    # GET (search), POST (create)
│   ├── [id]/route.ts               # GET, PUT, DELETE
│   ├── [id]/reviews/route.ts
│   ├── categories/route.ts
│   └── seed/route.ts
├── orders/
│   ├── route.ts                    # GET (all), POST (create)
│   ├── mine/route.ts
│   ├── [id]/route.ts               # GET, DELETE
│   ├── [id]/pay/route.ts
│   ├── [id]/deliver/route.ts
│   ├── mailing/route.ts
│   └── notifications/route.ts
├── payment/prepare/route.ts
├── uploads/
│   ├── route.ts
│   └── s3/route.ts
└── config/
    ├── paypal/route.ts
    ├── google/route.ts
    └── web3/route.ts
```

### 2.5 Payment con Viem + Wagmi (Architettura Client-Side)

**IMPORTANTE:** Il polling per conferma transazioni avviene nel **frontend** con Wagmi, non nelle API Routes.

#### Backend (API Route) - Solo preparazione/validazione
```typescript
// nextjs/src/app/api/payment/prepare/route.ts
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    contractAddress: process.env.TOKEN_CONTRACT_ADDRESS,
    recipientAddress: seller.account,
    amount: order.totalPriceVal,
  });
}
```

#### Frontend (Wagmi) - Transazione + Polling
```typescript
// nextjs/src/components/PaymentButton.tsx
'use client';
import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';

export function PaymentButton({ orderId }: { orderId: string }) {
  const { data: hash, sendTransaction, isPending } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isSuccess && hash) {
      fetch(`/api/orders/${orderId}/pay`, {
        method: 'PUT',
        body: JSON.stringify({ txHash: hash }),
      });
    }
  }, [isSuccess, hash]);

  return (
    <button onClick={() => sendTransaction({...})} disabled={isPending}>
      {isPending ? 'Confermando...' : isConfirming ? 'In attesa blockchain...' : 'Paga'}
    </button>
  );
}
```

---

## Fase 3: Servizi Esterni

### 3.1 Mailtrap Email

```typescript
// nextjs/src/lib/services/email.ts
import { MailtrapClient } from 'mailtrap';

const mailtrap = new MailtrapClient({ token: process.env.MAILTRAP_API_KEY! });

export async function sendVerificationEmail(to: string, name: string, verifyLink: string) {
  await mailtrap.send({
    from: { name: 'Pagine Azzurre', email: 'noreply@pagineazzurre.it' },
    to: [{ email: to }],
    template_uuid: process.env.MAILTRAP_TEMPLATE_VERIFICATION!,
    template_variables: { user_name: name, verification_link: verifyLink },
  });
}
```

### 3.2 Viem + Wagmi Setup

#### Wagmi Config
```typescript
// nextjs/src/lib/wagmi/config.ts
import { createConfig, http } from 'wagmi';
import { mainnet, goerli, sepolia } from 'wagmi/chains';

export const config = createConfig({
  chains: [mainnet, goerli, sepolia],
  transports: {
    [mainnet.id]: http(),
    [goerli.id]: http(process.env.NEXT_PUBLIC_INFURA_URL),
    [sepolia.id]: http(process.env.NEXT_PUBLIC_INFURA_SEPOLIA_URL),
  },
});
```

#### Wagmi CLI
```typescript
// wagmi.config.ts
import { defineConfig } from '@wagmi/cli';
import { react } from '@wagmi/cli/plugins';

export default defineConfig({
  out: 'src/lib/contracts/generated.ts',
  contracts: [{ name: 'ValorinoToken', abi: valorinoTokenAbi }],
  plugins: [react()],
});
```

---

## Fase 5: Environment Variables

```env
# Database
MONGODB_URL=mongodb+srv://...

# NextAuth
NEXTAUTH_SECRET=your-super-secret-key
NEXTAUTH_URL=https://your-domain.vercel.app

# Mailtrap
MAILTRAP_API_KEY=your-mailtrap-api-key
MAILTRAP_TEMPLATE_VERIFICATION=uuid-template-verifica
MAILTRAP_TEMPLATE_ORDER=uuid-template-ordine

# Viem/Wagmi
NEXT_PUBLIC_INFURA_URL=https://goerli.infura.io/v3/xxx
INFURA_URL=https://goerli.infura.io/v3/xxx
TOKEN_CONTRACT_ADDRESS=0x...

# AWS S3
S3_KEY_ID=xxx
S3_ACCESS_KEY=xxx
```

---

## Fase 6: Frontend Providers

```typescript
// nextjs/src/app/providers.tsx
'use client';
import { SessionProvider } from 'next-auth/react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from '@/lib/wagmi/config';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>{children}</SessionProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

---

## Dipendenze da Installare

```bash
# Core
npm install mongoose next-auth @auth/mongodb-adapter bcryptjs zod uuid @aws-sdk/client-s3

# Mailtrap
npm install mailtrap

# Viem + Wagmi
npm install wagmi viem @tanstack/react-query

# Dev
npm install -D @types/bcryptjs @types/uuid @wagmi/cli
```

---

## Ordine di Implementazione

1. Setup base - mongoose, NextAuth, modelli
2. Config endpoints - `/api/config/*`
3. Auth endpoints - signin, register, password recovery
4. User endpoints - profile, sellers, newsletter
5. Product endpoints - CRUD, search, reviews
6. Order endpoints - CRUD, notifications
7. Payment con Wagmi - frontend client-side
8. Upload endpoints - S3
9. Testing
10. Cutover - rimuovere Railway

---

## Riepilogo Cambiamenti Tecnologici

| Prima | Dopo |
|-------|------|
| SendGrid | **Mailtrap** |
| web3.js + HDWalletProvider | **Viem + Wagmi** |
| Polling server-side (timeout) | **Polling client-side** |
| Bundle ~590KB | **Bundle ~35KB** |
| ABI manuale | **Wagmi CLI** hooks tipizzati |
