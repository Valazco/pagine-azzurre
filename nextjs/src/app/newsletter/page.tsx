'use client';

import { useState, FormEvent } from 'react';
import MessageBox from '@/components/ui/MessageBox';
import LoadingBox from '@/components/ui/LoadingBox';
import apiClient from '@/lib/api/client';
import styled from 'styled-components';
import { FlexCenter, TextCenter, FormGroup, Label, Input, PrimaryButton } from '@/lib/styles';

const NewsletterContainer = styled(FlexCenter)`
  min-height: 100vh;
  background-color: #f9fafb;
  padding: 3rem 1rem;
`;

const NewsletterWrapper = styled.div`
  max-width: 28rem;
  width: 100%;
`;

const NewsletterCard = styled.div`
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  padding: 2rem;
`;

const Header = styled(TextCenter)`
  margin-bottom: 2rem;
`;

const IconContainer = styled.div`
  width: 4rem;
  height: 4rem;
  background-color: #dbeafe;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;

  span {
    font-size: 1.875rem;
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
`;

const Subtitle = styled.p`
  color: #4b5563;
  margin-top: 0.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SuccessContainer = styled.div`
  text-align: center;
`;

export default function NewsletterPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      setLoading(true);
      await apiClient.post('/users/newsletter', { email, name });
      setSuccess(true);
      setEmail('');
      setName('');
    } catch {
      setError('Errore nell\'iscrizione. Riprova più tardi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <NewsletterContainer>
      <NewsletterWrapper>
        <NewsletterCard>
          <Header>
            <IconContainer>
              <span>📬</span>
            </IconContainer>
            <Title>Newsletter</Title>
            <Subtitle>
              Resta aggiornato sulle novità di Pagine Azzurre
            </Subtitle>
          </Header>

          {success ? (
            <SuccessContainer>
              <MessageBox variant="success">
                Grazie per l&apos;iscrizione! Controlla la tua email per confermare.
              </MessageBox>
            </SuccessContainer>
          ) : (
            <Form onSubmit={submitHandler}>
              {loading && <LoadingBox />}
              {error && <MessageBox variant="danger">{error}</MessageBox>}

              <FormGroup>
                <Label htmlFor="name">
                  Nome
                </Label>
                <Input
                  type="text"
                  id="name"
                  placeholder="Il tuo nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="email">
                  Email *
                </Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="La tua email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormGroup>

              <PrimaryButton
                type="submit"
                disabled={loading}
              >
                {loading ? 'Iscrizione...' : 'Iscriviti'}
              </PrimaryButton>
            </Form>
          )}
        </NewsletterCard>
      </NewsletterWrapper>
    </NewsletterContainer>
  );
}
