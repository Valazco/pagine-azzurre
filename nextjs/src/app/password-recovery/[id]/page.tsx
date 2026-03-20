'use client';

import { useState, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import styled from 'styled-components';
import LoadingBox from '@/components/ui/LoadingBox';
import MessageBox from '@/components/ui/MessageBox';
import { FlexCenter, FormGroup, Label, Input, PrimaryButton } from '@/lib/styles';

const PageContainer = styled(FlexCenter)`
  min-height: 100vh;
  background-color: #f9fafb;
  padding: 3rem 1rem;
`;

const FormCard = styled.form`
  max-width: 28rem;
  width: 100%;
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  padding: 2rem;
`;

const IconContainer = styled.div<{ $variant?: 'success' | 'error' | 'default' }>`
  width: 4rem;
  height: 4rem;
  background-color: ${({ $variant }) =>
    $variant === 'success' ? '#d1fae5' :
    $variant === 'error' ? '#fee2e2' : '#dbeafe'};
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
  text-align: center;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #6b7280;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const FormFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const FooterLink = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.875rem;
  color: #4b5563;

  a {
    color: #2563eb;
    font-weight: 500;
    text-decoration: none;

    &:hover {
      color: #1d4ed8;
    }
  }
`;

export default function PasswordResetPage() {
  const params = useParams();
  const router = useRouter();
  const recoveryId = params.id as string;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Le password non coincidono');
      return;
    }

    if (password.length < 6) {
      setError('La password deve avere almeno 6 caratteri');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/users/password-replacement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: recoveryId, newData: password }),
      });

      const data = await response.json();

      if (response.ok && data.password_replacement) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/signin');
        }, 3000);
      } else {
        setError(data.message || 'Errore nel cambio password');
      }
    } catch {
      setError('Errore di connessione. Riprova più tardi.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <PageContainer>
        <FormCard as="div">
          <IconContainer $variant="success">
            <span>✅</span>
          </IconContainer>
          <Title>Password Aggiornata!</Title>
          <MessageBox variant="success">
            La tua password è stata cambiata con successo.
          </MessageBox>
          <Subtitle>
            Verrai reindirizzato al login tra pochi secondi...
          </Subtitle>
          <Link href="/signin">
            <PrimaryButton type="button">Vai al Login</PrimaryButton>
          </Link>
        </FormCard>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <FormCard onSubmit={submitHandler}>
        <IconContainer $variant="default">
          <span>🔐</span>
        </IconContainer>
        <Title>Nuova Password</Title>
        <Subtitle>Inserisci la tua nuova password</Subtitle>

        {loading && <LoadingBox />}
        {error && <MessageBox variant="danger">{error}</MessageBox>}

        <FormFields>
          <FormGroup>
            <Label htmlFor="password">Nuova Password</Label>
            <Input
              type="password"
              id="password"
              placeholder="Inserisci la nuova password (min. 6 caratteri)"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="confirmPassword">Conferma Password</Label>
            <Input
              type="password"
              id="confirmPassword"
              placeholder="Conferma la nuova password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </FormGroup>
        </FormFields>

        <PrimaryButton type="submit" disabled={loading}>
          {loading ? 'Aggiornamento...' : 'Cambia Password'}
        </PrimaryButton>

        <FooterLink>
          <Link href="/signin">Torna al login</Link>
        </FooterLink>
      </FormCard>
    </PageContainer>
  );
}
