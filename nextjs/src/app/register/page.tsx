'use client';

import { useState, useEffect, FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styled from 'styled-components';
import { useUserStore } from '@/lib/store/user';
import LoadingBox from '@/components/ui/LoadingBox';
import MessageBox from '@/components/ui/MessageBox';
import { FormGroup, Label, Input, PrimaryButton } from '@/lib/styles';

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
  padding: 3rem 1rem;
`;

const FormContainer = styled.div`
  max-width: 32rem;
  margin: 0 auto;
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

const SectionBox = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
`;

const SectionTitle = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.75rem;
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
`;

const RadioInput = styled.input`
  width: 1rem;
  height: 1rem;
  color: #2563eb;
`;

const RadioText = styled.span`
  font-size: 0.875rem;
  color: #374151;
`;

const RefererSection = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const RefererInputRow = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const RefererInput = styled(Input)`
  flex: 1;
  font-size: 0.875rem;
  padding: 0.5rem 0.75rem;
`;

const AddButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #dbeafe;
  color: #2563eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #bfdbfe;
  }
`;

const RefererList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  list-style: none;
  padding: 0;
  margin: 0;
`;

const RefererItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f9fafb;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
`;

const RemoveButton = styled.button`
  color: #ef4444;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;

  &:hover {
    color: #dc2626;
  }
`;

const RequiredText = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 1rem;
`;

const SigninSection = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.875rem;
  color: #6b7280;
`;

const StyledLink = styled(Link)`
  color: #2563eb;
  font-weight: 500;

  &:hover {
    color: #1d4ed8;
  }
`;

function RegisterContent() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hasReferer, setHasReferer] = useState(false);
  const [referer, setReferer] = useState<string[]>([]);
  const [newReferer, setNewReferer] = useState('');
  const [newsletter, setNewsletter] = useState(false);
  const [validationError, setValidationError] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/verification';

  const { userInfo, loading, error, register, clearError } = useUserStore();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (userInfo) {
      router.push(redirect);
    }
  }, [userInfo, redirect, router]);

  useEffect(() => {
    clearError();
  }, [clearError]);

  const addReferer = (e: React.MouseEvent) => {
    e.preventDefault();
    if (newReferer && referer.length < 3) {
      setReferer([...referer, newReferer]);
      setNewReferer('');
    }
  };

  const removeReferer = (index: number) => {
    setReferer(referer.filter((_, i) => i !== index));
  };

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (email !== confirmEmail) {
      setValidationError('Le email non coincidono');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Le password non coincidono');
      return;
    }

    if (password.length < 6) {
      setValidationError('La password deve avere almeno 6 caratteri');
      return;
    }

    try {
      await register({
        username,
        email,
        password,
        phone: username,
        cf: email.split('').map(c => c.charCodeAt(0)).join(''),
        sellername: username,
        referer,
        newsletter,
      });
    } catch {
      // Error is handled by the store
    }
  };

  return (
    <PageWrapper>
      <FormContainer>
        <FormCard onSubmit={submitHandler}>
          <FormHeader>
            <Title>Crea il tuo Account</Title>
            <Subtitle>Unisciti alla comunità di Pagine Azzurre</Subtitle>
          </FormHeader>

          {loading && <LoadingBox />}
          {(error || validationError) && (
            <MessageBox variant="danger">{validationError || error}</MessageBox>
          )}

          <FormFields>
            <FormGroup>
              <Label htmlFor="username">Username *</Label>
              <Input
                type="text"
                id="username"
                placeholder="Inserisci il tuo username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value.toUpperCase())}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="email">Indirizzo Email *</Label>
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
              <Label htmlFor="confirmEmail">Conferma Email *</Label>
              <Input
                type="email"
                id="confirmEmail"
                placeholder="Conferma la tua email"
                required
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="password">Password *</Label>
              <Input
                type="password"
                id="password"
                placeholder="Inserisci la password (min. 6 caratteri)"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="confirmPassword">Conferma Password *</Label>
              <Input
                type="password"
                id="confirmPassword"
                placeholder="Conferma la password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </FormGroup>

            <SectionBox>
              <SectionTitle>
                Partecipi a gruppi, movimenti, comitati o associazioni no profit?
              </SectionTitle>
              <RadioGroup>
                <RadioLabel>
                  <RadioInput
                    type="radio"
                    name="referer"
                    checked={hasReferer}
                    onChange={() => setHasReferer(true)}
                  />
                  <RadioText>Sì</RadioText>
                </RadioLabel>
                <RadioLabel>
                  <RadioInput
                    type="radio"
                    name="referer"
                    checked={!hasReferer}
                    onChange={() => setHasReferer(false)}
                  />
                  <RadioText>No</RadioText>
                </RadioLabel>
              </RadioGroup>

              {hasReferer && (
                <RefererSection>
                  <RefererInputRow>
                    <RefererInput
                      type="text"
                      placeholder="Nome dell'ente"
                      value={newReferer}
                      onChange={(e) => setNewReferer(e.target.value.toUpperCase())}
                    />
                    {newReferer && referer.length < 3 && (
                      <AddButton type="button" onClick={addReferer}>
                        Aggiungi
                      </AddButton>
                    )}
                  </RefererInputRow>
                  {referer.length > 0 && (
                    <RefererList>
                      {referer.map((item, idx) => (
                        <RefererItem key={idx}>
                          <span>{item}</span>
                          <RemoveButton
                            type="button"
                            onClick={() => removeReferer(idx)}
                          >
                            Rimuovi
                          </RemoveButton>
                        </RefererItem>
                      ))}
                    </RefererList>
                  )}
                </RefererSection>
              )}
            </SectionBox>

            <SectionBox>
              <SectionTitle>
                Vuoi iscriverti alla nostra newsletter?
              </SectionTitle>
              <RadioGroup>
                <RadioLabel>
                  <RadioInput
                    type="radio"
                    name="newsletter"
                    checked={newsletter}
                    onChange={() => setNewsletter(true)}
                  />
                  <RadioText>Sì</RadioText>
                </RadioLabel>
                <RadioLabel>
                  <RadioInput
                    type="radio"
                    name="newsletter"
                    checked={!newsletter}
                    onChange={() => setNewsletter(false)}
                  />
                  <RadioText>No</RadioText>
                </RadioLabel>
              </RadioGroup>
            </SectionBox>
          </FormFields>

          <MessageBox variant="info">
            Nello spirito di scambio in solidarietà di beni, per vantaggi comuni;
            sei invitato a creare un annuncio. Una proposta o una richiesta,
            per scambiare prodotti, servizi e conoscenze.
          </MessageBox>

          <RequiredText>(*) Campi obbligatori</RequiredText>

          <PrimaryButton type="submit" disabled={loading}>
            {loading ? 'Registrazione in corso...' : 'Registrati'}
          </PrimaryButton>

          <SigninSection>
            Hai già un account?{' '}
            <StyledLink href={`/signin?redirect=${redirect}`}>
              Accedi
            </StyledLink>
          </SigninSection>
        </FormCard>
      </FormContainer>
    </PageWrapper>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<PageWrapper><LoadingBox /></PageWrapper>}>
      <RegisterContent />
    </Suspense>
  );
}
