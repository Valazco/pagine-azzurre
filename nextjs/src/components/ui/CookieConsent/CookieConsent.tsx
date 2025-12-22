'use client';

import { useState, useEffect } from 'react';
import {
  CookieBanner,
  CookieContainer,
  CookieContent,
  CookieText,
  PrivacyLink,
  AcceptButton,
} from './CookieConsent.styles';

export function CookieConsent() {
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
    <CookieBanner>
      <CookieContainer>
        <CookieContent>
          <CookieText>
            <p>
              I cookie ci aiutano ad erogare servizi di qualità.
            </p>
            <p>
              Utilizzando i nostri servizi, l&apos;utente accetta le nostre modalità d&apos;uso
              dei cookie. Qualora l&apos;utente non desideri ricevere alcun tipo di cookie
              sul proprio elaboratore, né da questo sito né da altri, può elevare il
              livello di protezione privacy del proprio browser mediante l&apos;apposita
              funzione, come specificato di seguito. Le pagineazzurre.net fa uso dei
              cookie. L&apos;informazione più dettagliata nella nostra pagina sulla{' '}
              <PrivacyLink href="/privacy">Privacy</PrivacyLink>
            </p>
          </CookieText>
          <AcceptButton onClick={handleAccept}>
            Accetto
          </AcceptButton>
        </CookieContent>
      </CookieContainer>
    </CookieBanner>
  );
}

export default CookieConsent;
