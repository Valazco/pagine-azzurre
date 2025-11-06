'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasAccepted = localStorage.getItem('pagineazzurre-cookies');
    if (!hasAccepted) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('pagineazzurre-cookies', 'accepted');
    localStorage.setItem('pagineazzurre-cookies-date', new Date().toISOString());
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-700 text-white p-4 shadow-lg z-50">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm md:text-base flex-1">
            <p>
              I cookie ci aiutano ad erogare servizi di qualità.
            </p>
            <p className="mt-1">
              Utilizzando i nostri servizi, l&apos;utente accetta le nostre modalità d&apos;uso
              dei cookie. Qualora l&apos;utente non desideri ricevere alcun tipo di cookie
              sul proprio elaboratore, né da questo sito né da altri, può elevare il
              livello di protezione privacy del proprio browser mediante l&apos;apposita
              funzione, come specificato di seguito. Le pagineazzurre.net fa uso dei
              cookie. L&apos;informazione più dettagliata nella nostra pagina sulla{' '}
              <Link href="/privacy" className="underline hover:text-blue-300">
                Privacy
              </Link>
            </p>
          </div>
          <button
            onClick={handleAccept}
            className="bg-white text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors whitespace-nowrap"
          >
            Accetto
          </button>
        </div>
      </div>
    </div>
  );
}
