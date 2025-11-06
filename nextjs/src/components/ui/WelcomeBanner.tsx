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
    <div className="bg-[#efefef] rounded-lg text-[#232323] flex flex-col gap-4 my-8 mx-auto max-w-[1200px]">
      {/* Welcome Title */}
      <h1 className="text-[1.8rem] p-4 text-center">
        Benvenuti in Pagine Azzurre, piazza dove barattiamo e scambiamo con meno
        Euro e più VAL ☯
      </h1>

      {/* Mission Statement */}
      <h2 className="text-[1.4rem] font-semibold text-[#646464] text-center px-4">
        Pagine Azzurre favorisce ogni scambio di prodotti, servizi e competenze
        finalizzati alla emancipazione umana, per mezzo delle convenzioni monetarie:
        EUR Euro. USD Dollaro Americano. RUR Rublo Russo. CAN Dollaro Canadese.
        CNY Yuan Cinese. INR Rupia Indiana. BRL Real Brasiliano.
        XDR Moneta Fondo Internazionale (IMF).
        AUD Dollaro Australiano. CRIPTO. Ma preferiamo: VAL, Crediti, G1, RISO e ne richiediamo almeno l&apos;utilizzo parziale.
      </h2>

      {/* Logos Container */}
      <div className="flex mx-auto gap-4">
        {logos.map((logo, index) => (
          <div key={index}>
            <Image
              src={logo.src}
              alt={logo.alt}
              width={55}
              height={55}
              className="h-[5.5rem] rounded-full mt-[2px]"
            />
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="text-center px-4 pb-4">
        Pagineazzurre è una attività promossa e gestita dal Banco dei Cittadini Volontari del Val.Az.Co.&nbsp;
        <a
          href="http://valazco.org/scopri-pagine-azzurre.html"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#ff8000]"
        >
          http://valazco.org
        </a>
      </div>
    </div>
  );
}
