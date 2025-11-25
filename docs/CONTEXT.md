# Contesto del Progetto Pagine Azzurre

## Descrizione del Progetto

Pagine Azzurre è un'applicazione e-commerce/marketplace con un sistema di pagamento Web3 basato su criptovaluta custom (token VAL - Valorino). Il progetto supporta dual pricing (EUR e VAL) e include funzionalità per venditori, acquirenti e amministratori.

---

## Architettura Attuale (MERN Stack)

### Backend (`/backend/`)
- **Framework:** Express.js
- **Database:** MongoDB con Mongoose
- **Autenticazione:** JWT custom (30 giorni)
- **Email:** SendGrid
- **Blockchain:** web3.js + HDWalletProvider (Goerli testnet)
- **Storage:** AWS S3 + local uploads

### Frontend (`/frontend/`)
- **Framework:** React 16
- **Routing:** react-router-dom v5
- **State Management:** Redux + Redux-Thunk
- **Styling:** SASS/SCSS custom

### Frontend Next.js (`/nextjs/`)
- **Framework:** Next.js 16 con App Router
- **State Management:** Zustand
- **Styling:** Tailwind CSS v4
- **Deployment:** Vercel

---

## Modelli Database

### User
- Account Web3 (address + private key)
- Credenziali (email, password hash)
- Ruoli: isAdmin, isSeller
- Premium: hasAd
- Verifica email con UUID

### Product
- Dual pricing: priceVal (token) + priceEuro
- Sezioni: offro, cerco, avviso, propongo
- Localizzazione: 150+ città italiane
- Reviews con rating

### Order
- Riferimenti buyer/seller
- Stati: isPaid, isDelivered
- Notifiche email

### Newsletter
- Gestione separata dagli utenti
- Verifica email

---

## API Endpoints (35 totali)

| Router | Endpoint Count | Funzionalità |
|--------|---------------|--------------|
| `/api/users` | 17 | Auth, profilo, newsletter, verifica |
| `/api/products` | 7 | CRUD, search, reviews |
| `/api/orders` | 9 | CRUD, pagamenti, notifiche |
| `/api/payment` | 1 | Blockchain Web3 |
| `/api/uploads` | 2 | Local + S3 |

---

## Integrazioni Esterne

### SendGrid → **Mailtrap** (migrazione)
8 template email:
- Verifica registrazione
- Benvenuto
- Reset password
- Conferma cambio password
- Notifica ordine (venditore)
- Notifica ordine (compratore)
- Newsletter welcome

### Web3/Blockchain
- **Network:** Goerli testnet (ID: 5)
- **Provider:** Infura
- **Token:** ERC-20 custom (Valorino)
- **Migrazione:** web3.js → **Viem + Wagmi**

### AWS S3
- Bucket: `pagineazzurre2`
- Upload immagini prodotti

---

## Decisioni Tecniche della Sessione

### 1. Backend in Next.js
**Decisione:** Migrare tutte le API Express a Next.js API Routes
**Motivazione:** Un solo deployment, infrastruttura semplificata

### 2. NextAuth.js
**Decisione:** Usare NextAuth.js con CredentialsProvider
**Motivazione:** Supporto SSR, integrazione Next.js nativa

### 3. Mailtrap invece di SendGrid
**Decisione:** Migrare a Mailtrap
**Motivazione:**
- Template gestiti via dashboard (no codice HTML nel repo)
- Variabili Handlebars
- Modifica template senza deploy

### 4. Viem + Wagmi invece di web3.js
**Decisione:** Sostituire web3.js + HDWalletProvider con Viem + Wagmi
**Motivazione:**
- Bundle size: 590KB → 35KB
- Type safety nativo
- Polling client-side (risolve timeout serverless)
- Wagmi CLI genera hooks tipizzati

### 5. Architettura Pagamenti Client-Side
**Problema:** Vercel ha timeout di 60s, transazioni blockchain possono essere più lente
**Soluzione:**
- Backend prepara i dati (veloce)
- Frontend esegue transazione + polling con Wagmi `useWaitForTransactionReceipt`
- Nessun timeout perché il polling avviene nel browser

---

## Deployment

### Attuale
- **Backend:** Railway (Express.js)
- **Frontend Next.js:** Vercel

### Futuro
- **Full-stack:** Vercel (Next.js con API Routes integrate)

---

## File Critici per la Migrazione

| File | Contenuto |
|------|-----------|
| `backend/routers/userRouter.js` | 17 endpoint, logica auth, Web3 wallet |
| `backend/routers/productRouter.js` | Ricerca con filtri città |
| `backend/routers/paymentRouter.js` | Pagamento blockchain |
| `backend/utils.js` | Middleware auth |
| `backend/emailTemplates/mailMsg.js` | 8 template email |
| `backend/models/userModel.js` | Schema utente con Web3 |

---

## Prossimi Passi

1. Setup MongoDB connection in Next.js
2. Implementare NextAuth.js
3. Migrare modelli a TypeScript
4. Creare API Routes
5. Setup Viem + Wagmi
6. Creare template su Mailtrap
7. Testing
8. Cutover da Railway

---

## Note Tecniche

### Vercel Limits
- Timeout default: 10s (60s con Pro)
- Body size: 4.5MB
- Soluzione upload: S3 direct upload

### MongoDB in Serverless
- Usare singleton pattern per connection pooling
- Evitare cold start con connection caching

### Environment Variables
- `NEXT_PUBLIC_*` → disponibili client-side
- Senza prefix → solo server-side

---

## Contatti e Risorse

- **Repository:** `/Users/chocos/Desktop/pagine_azzurre`
- **Branch attuale:** master
- **Data piano:** 2025-11-25
