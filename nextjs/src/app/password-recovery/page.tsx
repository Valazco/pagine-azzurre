'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { requestPasswordRecovery } from '@/lib/api/users';
import LoadingBox from '@/components/ui/LoadingBox';
import MessageBox from '@/components/ui/MessageBox';
import styled from 'styled-components';
import { FlexCenter, TextCenter, FormGroup, Label, Input, PrimaryButton } from '@/lib/styles';

const RecoveryContainer = styled(FlexCenter)`
  min-height: 100vh;
  background-color: #f9fafb;
  padding: 3rem 1rem;
`;

const RecoveryWrapper = styled.div`
  max-width: 28rem;
  width: 100%;
`;

const RecoveryForm = styled.form`
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Header = styled(TextCenter)`
  margin-bottom: 0;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
`;

const Subtitle = styled.p`
  margin-top: 0.5rem;
  color: #4b5563;
`;

const ErrorContainer = styled.div`
  text-align: center;
`;

const RegisterLink = styled.div`
  margin-top: 1rem;
  text-align: center;

  a {
    color: #2563eb;
    font-weight: 500;
    text-decoration: none;

    &:hover {
      color: #1d4ed8;
    }
  }
`;

const FooterLink = styled.div`
  text-align: center;
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

export default function PasswordRecoveryPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await requestPasswordRecovery(email);
      setSuccess(true);
    } catch {
      setError("L'email non risulta registrata. Vuoi registrarti adesso?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <RecoveryContainer>
      <RecoveryWrapper>
        <RecoveryForm onSubmit={submitHandler}>
          <Header>
            <Title>Recupero Password</Title>
            <Subtitle>
              Inserisci la tua email per ricevere le istruzioni
            </Subtitle>
          </Header>

          {loading && <LoadingBox />}

          {success && (
            <MessageBox variant="success">
              Controlla la tua email per confermare il ripristino della password
            </MessageBox>
          )}

          {error && (
            <ErrorContainer>
              <MessageBox variant="danger">{error}</MessageBox>
              <RegisterLink>
                <Link href="/register">
                  Registrati ora
                </Link>
              </RegisterLink>
            </ErrorContainer>
          )}

          {!success && (
            <FormGroup>
              <Label htmlFor="email">
                Indirizzo Email
              </Label>
              <Input
                type="email"
                id="email"
                placeholder="Inserisci la tua email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormGroup>
          )}

          {!success && (
            <PrimaryButton
              type="submit"
              disabled={loading}
            >
              {loading ? 'Invio in corso...' : 'Recupera Password'}
            </PrimaryButton>
          )}

          <FooterLink>
            <Link href="/signin">
              Torna al login
            </Link>
          </FooterLink>
        </RecoveryForm>
      </RecoveryWrapper>
    </RecoveryContainer>
  );
}
