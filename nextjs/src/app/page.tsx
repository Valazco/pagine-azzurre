import { LoadingBox, MessageBox } from '@/components/ui';

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-12 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Benvenuto su Pagine Azzurre
        </h1>
        <p className="text-xl text-gray-700 mb-6">
          VALorizzatore del AZione COncordata
        </p>
        <p className="text-gray-600 max-w-2xl mx-auto">
          La piattaforma italiana per lo scambio di beni e servizi utilizzando VAL
        </p>
      </section>

      {/* Info Section */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold text-blue-600 mb-3">🤝 Offri</h2>
          <p className="text-gray-700">
            Metti in vetrina i tuoi prodotti e servizi per condividerli con la comunità
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold text-blue-600 mb-3">🔍 Cerca</h2>
          <p className="text-gray-700">
            Trova ciò di cui hai bisogno nella nostra rete di offerenti verificati
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold text-blue-600 mb-3">☯ VAL</h2>
          <p className="text-gray-700">
            Utilizza i VAL per valorizzare le azioni concordate nella comunità
          </p>
        </div>
      </section>

      {/* Status Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Stato della Migrazione</h2>

        <MessageBox variant="success">
          <strong>✅ Completato:</strong> Layout (Header + Footer), Componenti UI base,
          API Client, Gestione stato (Zustand)
        </MessageBox>

        <MessageBox variant="info">
          <strong>🔄 In Corso:</strong> Migrazione delle pagine principali e componenti avanzati
        </MessageBox>

        <MessageBox variant="warning">
          <strong>⏳ Prossimi Passi:</strong> Migrazione di Home, Product, Cart, Auth pages
        </MessageBox>
      </section>

      {/* Test Components */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Componenti di Test</h2>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 space-y-4">
          <h3 className="text-lg font-semibold">LoadingBox Component</h3>
          <LoadingBox />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">MessageBox Variants</h3>
          <MessageBox variant="info">Questo è un messaggio informativo</MessageBox>
          <MessageBox variant="success">Operazione completata con successo!</MessageBox>
          <MessageBox variant="warning">Attenzione: verifica i dati inseriti</MessageBox>
          <MessageBox variant="danger">Errore: impossibile completare l&apos;operazione</MessageBox>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="text-center py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Pagine in Arrivo
        </h2>
        <ul className="text-gray-700 space-y-2">
          <li>🏠 Home con lista prodotti</li>
          <li>🛍️ Dettaglio prodotto</li>
          <li>🛒 Carrello</li>
          <li>🔐 Autenticazione (Signin/Register)</li>
          <li>👤 Profilo utente</li>
          <li>📦 Gestione ordini</li>
          <li>⚙️ Pannello admin</li>
        </ul>
      </section>
    </div>
  );
}
