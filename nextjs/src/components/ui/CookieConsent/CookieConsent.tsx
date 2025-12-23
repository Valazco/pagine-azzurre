'use client';

import { useState, useEffect } from 'react';
import {
  CookieBanner,
  CookieContainer,
  CookieContent,
  CookieText,
  PrivacyLink,
  ButtonGroup,
  AcceptButton,
  RejectButton,
} from './CookieConsent.styles';

export type CookieConsentValue = 'accepted' | 'rejected' | null;

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const cookieChoice = localStorage.getItem('pagineazzurre-cookies');
    if (!cookieChoice) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('pagineazzurre-cookies', 'accepted');
    localStorage.setItem('pagineazzurre-cookies-date', new Date().toISOString());
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem('pagineazzurre-cookies', 'rejected');
    localStorage.setItem('pagineazzurre-cookies-date', new Date().toISOString());
    // Clear any existing non-essential cookies here if needed
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <CookieBanner
      role="dialog"
      aria-label="Consenso Cookie"
      aria-describedby="cookie-description"
    >
      <CookieContainer>
        <CookieContent>
          <CookieText id="cookie-description">
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
          <ButtonGroup>
            <RejectButton onClick={handleReject}>
              Rifiuto
            </RejectButton>
            <AcceptButton onClick={handleAccept}>
              Accetto
            </AcceptButton>
          </ButtonGroup>
        </CookieContent>
      </CookieContainer>
    </CookieBanner>
  );
}

export default CookieConsent;
