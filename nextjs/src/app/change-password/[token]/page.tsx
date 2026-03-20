'use client';

import { useState, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { changePassword } from '@/lib/api/users';
import LoadingBox from '@/components/ui/LoadingBox';
import MessageBox from '@/components/ui/MessageBox';
import styled from 'styled-components';
import { FlexCenter, TextCenter, FormGroup, Label, Input, PrimaryButton } from '@/lib/styles';

const ChangePasswordContainer = styled(FlexCenter)`
  min-height: 100vh;
  background-color: #f9fafb;
  padding: 3rem 1rem;
`;

const ChangePasswordWrapper = styled.div`
  max-width: 28rem;
  width: 100%;
`;

const ChangePasswordForm = styled.form`
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

const FieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export default function ChangePasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Le password non coincidono');
      return;
    }

    if (newPassword.length < 6) {
      setError('La password deve avere almeno 6 caratteri');
      return;
    }

    setLoading(true);

    try {
      await changePassword(token, newPassword);
      router.push('/signin');
    } catch {
      setError('Errore durante il cambio password. Il link potrebbe essere scaduto.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChangePasswordContainer>
      <ChangePasswordWrapper>
        <ChangePasswordForm onSubmit={submitHandler}>
          <Header>
            <Title>Ripristina Password</Title>
            <Subtitle>
              Inserisci la tua nuova password
            </Subtitle>
          </Header>

          {loading && <LoadingBox />}
          {error && <MessageBox variant="danger">{error}</MessageBox>}

          <FieldsContainer>
            <FormGroup>
              <Label htmlFor="newPassword">
                Nuova Password
              </Label>
              <Input
                type="password"
                id="newPassword"
                placeholder="Inserisci la nuova password (min. 6 caratteri)"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="confirmPassword">
                Conferma Password
              </Label>
              <Input
                type="password"
                id="confirmPassword"
                placeholder="Conferma la nuova password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </FormGroup>
          </FieldsContainer>

          <PrimaryButton
            type="submit"
            disabled={loading}
          >
            {loading ? 'Salvataggio...' : 'Salva Nuova Password'}
          </PrimaryButton>
        </ChangePasswordForm>
      </ChangePasswordWrapper>
    </ChangePasswordContainer>
  );
}
