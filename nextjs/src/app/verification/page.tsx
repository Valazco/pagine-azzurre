'use client';

import MessageBox from '@/components/ui/MessageBox';
import Link from 'next/link';
import styled from 'styled-components';
import { FlexCenter, TextCenter } from '@/lib/styles';

const VerificationContainer = styled(FlexCenter)`
  min-height: 100vh;
  background-color: #f9fafb;
  padding: 3rem 1rem;
`;

const VerificationCard = styled.div`
  max-width: 28rem;
  width: 100%;
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  padding: 2rem;
  text-align: center;
`;

const IconContainer = styled.div`
  width: 4rem;
  height: 4rem;
  background-color: #dbeafe;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;

  span {
    font-size: 1.875rem;
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1rem;
`;

const FooterText = styled.p`
  color: #4b5563;
  margin-top: 1.5rem;
  font-size: 0.875rem;

  a {
    color: #2563eb;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export default function VerificationPage() {
  return (
    <VerificationContainer>
      <VerificationCard>
        <IconContainer>
          <span>📧</span>
        </IconContainer>

        <Title>
          Verifica la tua Email
        </Title>

        <MessageBox variant="info">
          Ti abbiamo inviato una email di conferma.
          Controlla la tua casella di posta e clicca sul link per attivare il tuo account.
        </MessageBox>

        <FooterText>
          Non hai ricevuto l&apos;email? Controlla la cartella spam o{' '}
          <Link href="/signin">
            torna al login
          </Link>
        </FooterText>
      </VerificationCard>
    </VerificationContainer>
  );
}
