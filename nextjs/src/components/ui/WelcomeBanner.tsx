import Image from 'next/image';

export default function WelcomeBanner() {
  const logos = [
    { src: '/logos/magic_hands.jpg', alt: 'Magic Hands Logo' },
    { src: '/logos/bannerarancione.jpg', alt: 'Banner Arancione' },
    { src: '/logos/valazco-logo.png', alt: 'Valazco Logo' },
    { src: '/logos/bannerblu.jpg', alt: 'Banner Blu' },
    { src: '/logos/bannergiallo.jpg', alt: 'Banner Giallo' },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50 rounded-3xl shadow-lg my-8 mx-auto max-w-7xl border border-blue-100">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-200 rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2" />

      <div className="relative px-6 py-10 md:px-12 md:py-14 flex flex-col gap-8">
        {/* Welcome Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            Benvenuti in <span className="text-blue-600">Pagine Azzurre</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 font-medium">
            Piazza dove barattiamo e scambiamo con meno Euro e più <span className="text-2xl">☯</span> VAL
          </p>
        </div>

        {/* Mission Statement */}
        <div className="max-w-4xl mx-auto">
          <p className="text-base md:text-lg text-gray-600 text-center leading-relaxed">
            Pagine Azzurre favorisce ogni scambio di prodotti, servizi e competenze
            finalizzati alla emancipazione umana, per mezzo delle convenzioni monetarie:
            <span className="font-semibold text-gray-700"> EUR, USD, RUR, CAN, CNY, INR, BRL, XDR, AUD, CRIPTO</span>.
            <br />
            <span className="text-blue-600 font-semibold">
              Ma preferiamo: VAL, Crediti, G1, RISO
            </span> e ne richiediamo almeno l&apos;utilizzo parziale.
          </p>
        </div>

        {/* Logos Container */}
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
          {logos.map((logo, index) => (
            <div
              key={index}
              className="group relative w-16 h-16 md:w-20 md:h-20 transition-transform duration-300 hover:scale-110"
            >
              <div className="absolute inset-0 bg-white rounded-2xl shadow-md group-hover:shadow-xl transition-shadow" />
              <Image
                src={logo.src}
                alt={logo.alt}
                width={80}
                height={80}
                className="relative w-full h-full object-contain p-2 rounded-2xl"
              />
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="text-center">
          <p className="text-sm md:text-base text-gray-600">
            Pagineazzurre è una attività promossa e gestita dal{' '}
            <span className="font-semibold text-gray-700">Banco dei Cittadini Volontari del Val.Az.Co</span>
          </p>
          <a
            href="http://valazco.org/scopri-pagine-azzurre.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-3 text-blue-600 hover:text-blue-700 font-medium transition-colors group/link"
          >
            <span>Scopri di più</span>
            <svg
              className="w-4 h-4 transition-transform group-hover/link:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
