'use client';

import styled from 'styled-components';
import { Container, PageTitle, CardBase } from '@/lib/styles';

const PrivacyContainer = styled(Container)`
  max-width: 56rem;
  padding-top: 2rem;
  padding-bottom: 2rem;
`;

const ProseCard = styled(CardBase)`
  border-radius: 1rem;
  padding: 2rem;

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: #111827;

    &:first-child {
      margin-top: 0;
    }
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    color: #111827;
  }

  p {
    margin-bottom: 1rem;
    line-height: 1.75;
    color: #4b5563;
  }

  ul {
    list-style-type: disc;
    padding-left: 1.5rem;
    margin-bottom: 1rem;

    li {
      margin-bottom: 0.5rem;
      line-height: 1.75;
      color: #4b5563;
    }
  }

  a {
    color: #2563eb;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export default function PrivacyPage() {
  return (
    <PrivacyContainer>
      <PageTitle>Privacy Policy</PageTitle>

      <ProseCard>
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
          <a href="https://valazco.it" target="_blank" rel="noopener noreferrer">
            valazco.it
          </a>
        </p>
      </ProseCard>
    </PrivacyContainer>
  );
}
