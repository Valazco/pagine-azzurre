import Link from 'next/link';

export default function TuttiNoiPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Tutti Noi</h1>

      <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Chi Siamo</h2>
          <p className="text-gray-600 leading-relaxed">
            Pagine Azzurre è una piattaforma di scambio dove barattiamo e scambiamo con meno Euro e più VAL.
            Siamo una comunità che favorisce ogni scambio di prodotti, servizi e competenze
            finalizzati alla emancipazione umana.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">La Nostra Missione</h2>
          <p className="text-gray-600 leading-relaxed">
            Promuoviamo uno scambio solidale di beni per vantaggi comuni.
            Crediamo nella sovranità e nella consapevolezza economica,
            utilizzando convenzioni monetarie alternative come i VAL.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Il VAL</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Il VAL è la nostra unità di scambio alternativa. Preferiamo l&apos;utilizzo di:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>VAL - Valorizzatore dell&apos;Azione Concordata</li>
            <li>Crediti</li>
            <li>G1</li>
            <li>RISO</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Val.Az.Co</h2>
          <p className="text-gray-600 leading-relaxed">
            Pagine Azzurre è un&apos;attività promossa e gestita dal{' '}
            <strong>Banco dei Cittadini Volontari del Val.Az.Co</strong>{' '}
            (VALorizzatore dell&apos;AZione COncordata).
          </p>
        </section>

        <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-4">
          <a
            href="https://valazco.it"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Visita valazco.it
          </a>
          <Link
            href="/newsletter"
            className="inline-flex items-center justify-center px-6 py-3 border border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
          >
            Iscriviti alla Newsletter
          </Link>
        </div>
      </div>
    </div>
  );
}
