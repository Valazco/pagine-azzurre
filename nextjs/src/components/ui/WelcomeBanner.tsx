import Image from 'next/image';
import Link from 'next/link';

export default function WelcomeBanner() {
  const logos = [
    { src: '/logos/magic_hands.jpg', alt: 'Magic Hands Logo' },
    { src: '/logos/bannerarancione.jpg', alt: 'Banner Arancione' },
    { src: '/logos/valazco-logo.png', alt: 'Valazco Logo' },
    { src: '/logos/bannerblu.jpg', alt: 'Banner Blu' },
    { src: '/logos/bannergiallo.jpg', alt: 'Banner Giallo' },
  ];

  return (
    <div className="bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 rounded-lg shadow-md p-6 md:p-8 mb-8">
      {/* Welcome Title */}
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-6">
        Benvenuti in Pagine Azzurre, piazza dove barattiamo e scambiamo con meno
        Euro e più VAL ☯
      </h1>

      {/* Mission Statement */}
      <h2 className="text-base md:text-lg text-center text-gray-700 mb-8 max-w-5xl mx-auto leading-relaxed">
        Pagine Azzurre favorisce ogni scambio di prodotti, servizi e competenze
        finalizzati alla emancipazione umana, per mezzo delle convenzioni monetarie:
        EUR Euro. USD Dollaro Americano. RUR Rublo Russo. CAN Dollaro Canadese.
        CNY Yuan Cinese. INR Rupia Indiana. BRL Real Brasiliano.
        XDR Moneta Fondo Internazionale (IMF).
        AUD Dollaro Australiano. CRIPTO. Ma preferiamo: VAL, Crediti, G1, RISO e ne richiediamo almeno l&apos;utilizzo parziale.
      </h2>

      {/* Logos Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {logos.map((logo, index) => (
          <div
            key={index}
            className="relative aspect-square bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-contain p-2"
            />
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <p className="text-center text-gray-700 text-sm md:text-base">
        Pagineazzurre è una attività promossa e gestita dal Banco dei Cittadini Volontari del Val.Az.Co.&nbsp;
        <a
          href="http://valazco.org/scopri-pagine-azzurre.html"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 font-medium underline"
        >
          http://valazco.org
        </a>
      </p>
    </div>
  );
}
