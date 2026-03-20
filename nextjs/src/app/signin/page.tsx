'use client';

import { useState, useEffect, FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import styled from 'styled-components';
import LoadingBox from '@/components/ui/LoadingBox';
import MessageBox from '@/components/ui/MessageBox';
import { FormGroup, Label, Input, PrimaryButton } from '@/lib/styles';

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
`;

const FormContainer = styled.div`
  max-width: 28rem;
  width: 100%;
`;

const FormCard = styled.form`
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  padding: 2rem;
`;

const FormHeader = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
`;

const Subtitle = styled.p`
  margin-top: 0.5rem;
  color: #6b7280;
`;

const FormFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const LinksSection = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  font-size: 0.875rem;
`;

const LinkText = styled.p`
  color: #6b7280;
`;

const StyledLink = styled(Link)`
  color: #2563eb;
  font-weight: 500;

  &:hover {
    color: #1d4ed8;
  }
`;

function SigninContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || searchParams.get('redirect') || '/';
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.push(callbackUrl);
    }
  }, [session, status, callbackUrl, router]);

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError(result.error);
    } else if (result?.ok) {
      router.push(callbackUrl);
    }
  };

  return (
    <PageWrapper>
      <FormContainer>
        <FormCard onSubmit={submitHandler}>
          <FormHeader>
            <Title>Accedi</Title>
            <Subtitle>Benvenuto su Pagine Azzurre</Subtitle>
          </FormHeader>

          {loading && <LoadingBox />}
          {error && <MessageBox variant="danger">{error}</MessageBox>}

          <FormFields>
            <FormGroup>
              <Label htmlFor="email">Indirizzo Email</Label>
              <Input
                type="email"
                id="email"
                placeholder="Inserisci la tua email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                placeholder="Inserisci la tua password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormGroup>
          </FormFields>

          <PrimaryButton type="submit" disabled={loading}>
            {loading ? 'Accesso in corso...' : 'Accedi'}
          </PrimaryButton>

          <LinksSection>
            <LinkText>
              Nuovo utente?{' '}
              <StyledLink href={`/register?redirect=${callbackUrl}`}>
                Registrati
              </StyledLink>
            </LinkText>
            <LinkText>
              Hai dimenticato la password?{' '}
              <StyledLink href="/password-recovery">
                Recupera password
              </StyledLink>
            </LinkText>
          </LinksSection>
        </FormCard>
      </FormContainer>
    </PageWrapper>
  );
}

export default function SigninPage() {
  return (
    <Suspense fallback={<PageWrapper><LoadingBox /></PageWrapper>}>
      <SigninContent />
    </Suspense>
  );
}
