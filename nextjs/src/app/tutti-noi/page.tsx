'use client';

import Link from 'next/link';
import styled from 'styled-components';
import { Container, PageTitle, CardBase } from '@/lib/styles';

const TuttiNoiContainer = styled(Container)`
  max-width: 56rem;
  padding-top: 2rem;
  padding-bottom: 2rem;
`;

const ContentCard = styled(CardBase)`
  border-radius: 1rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Section = styled.section`
  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 1rem;
  }

  p {
    color: #4b5563;
    line-height: 1.75;
  }

  ul {
    list-style-type: disc;
    list-style-position: inside;
    color: #4b5563;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 1rem;
  }
`;

const ButtonContainer = styled.div`
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 640px) {
    flex-direction: row;
  }
`;

const PrimaryLinkButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  background-color: #2563eb;
  color: white;
  font-weight: 600;
  border-radius: 0.5rem;
  text-decoration: none;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1d4ed8;
  }
`;

const SecondaryLinkButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border: 2px solid #2563eb;
  color: #2563eb;
  font-weight: 600;
  border-radius: 0.5rem;
  text-decoration: none;
  transition: background-color 0.2s;

  &:hover {
    background-color: #eff6ff;
  }
`;

export default function TuttiNoiPage() {
  return (
    <TuttiNoiContainer>
      <PageTitle>Tutti Noi</PageTitle>

      <ContentCard>
        <Section>
          <h2>Chi Siamo</h2>
          <p>
            Pagine Azzurre è una piattaforma di scambio dove barattiamo e scambiamo con meno Euro e più VAL.
            Siamo una comunità che favorisce ogni scambio di prodotti, servizi e competenze
            finalizzati alla emancipazione umana.
          </p>
        </Section>

        <Section>
          <h2>La Nostra Missione</h2>
          <p>
            Promuoviamo uno scambio solidale di beni per vantaggi comuni.
            Crediamo nella sovranità e nella consapevolezza economica,
            utilizzando convenzioni monetarie alternative come i VAL.
          </p>
        </Section>

        <Section>
          <h2>Il VAL</h2>
          <p>
            Il VAL è la nostra unità di scambio alternativa. Preferiamo l&apos;utilizzo di:
          </p>
          <ul>
            <li>VAL - Valorizzatore dell&apos;Azione Concordata</li>
            <li>Crediti</li>
            <li>G1</li>
            <li>RISO</li>
          </ul>
        </Section>

        <Section>
          <h2>Val.Az.Co</h2>
          <p>
            Pagine Azzurre è un&apos;attività promossa e gestita dal{' '}
            <strong>Banco dei Cittadini Volontari del Val.Az.Co</strong>{' '}
            (VALorizzatore dell&apos;AZione COncordata).
          </p>
        </Section>

        <ButtonContainer>
          <PrimaryLinkButton
            href="https://valazco.it"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visita valazco.it
          </PrimaryLinkButton>
          <SecondaryLinkButton href="/newsletter">
            Iscriviti alla Newsletter
          </SecondaryLinkButton>
        </ButtonContainer>
      </ContentCard>
    </TuttiNoiContainer>
  );
}
