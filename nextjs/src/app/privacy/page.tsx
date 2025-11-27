export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

      <div className="bg-white rounded-2xl shadow-lg p-8 prose prose-gray max-w-none">
        <h2>Informativa sulla Privacy</h2>
        <p>
          Pagine Azzurre rispetta la privacy dei suoi utenti e si impegna a proteggerla.
          Questa informativa descrive come raccogliamo, utilizziamo e proteggiamo i tuoi dati personali.
        </p>

        <h3>Dati Raccolti</h3>
        <p>
          Raccogliamo i seguenti dati personali quando ti registri sul nostro sito:
        </p>
        <ul>
          <li>Nome utente</li>
          <li>Indirizzo email</li>
          <li>Informazioni di contatto (opzionale)</li>
          <li>Dati di navigazione (cookie tecnici)</li>
        </ul>

        <h3>Utilizzo dei Dati</h3>
        <p>I tuoi dati vengono utilizzati per:</p>
        <ul>
          <li>Gestire il tuo account</li>
          <li>Permettere gli scambi tra utenti</li>
          <li>Inviare comunicazioni relative al servizio</li>
          <li>Migliorare la piattaforma</li>
        </ul>

        <h3>Cookie</h3>
        <p>
          Utilizziamo cookie tecnici necessari per il funzionamento del sito.
          Puoi gestire le preferenze dei cookie tramite le impostazioni del tuo browser.
        </p>

        <h3>Diritti dell&apos;Utente</h3>
        <p>Hai il diritto di:</p>
        <ul>
          <li>Accedere ai tuoi dati personali</li>
          <li>Richiedere la rettifica o la cancellazione</li>
          <li>Opporti al trattamento</li>
          <li>Richiedere la portabilità dei dati</li>
        </ul>

        <h3>Contatti</h3>
        <p>
          Per qualsiasi domanda sulla privacy, contattaci tramite il sito{' '}
          <a href="https://valazco.it" target="_blank" rel="noopener noreferrer" className="text-blue-600">
            valazco.it
          </a>
        </p>
      </div>
    </div>
  );
}
