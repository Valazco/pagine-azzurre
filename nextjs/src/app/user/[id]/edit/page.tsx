'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import apiClient from '@/lib/api/client';
import { useUserStore } from '@/lib/store/user';
import LoadingBox from '@/components/ui/LoadingBox';
import MessageBox from '@/components/ui/MessageBox';
import type { User } from '@/types';
import styled from 'styled-components';
import { Container, PageTitle, CardBase, FormGroup, Label, Input, PrimaryButton, SecondaryButton } from '@/lib/styles';

const UserEditContainer = styled(Container)`
  max-width: 42rem;
  padding-top: 2rem;
  padding-bottom: 2rem;
`;

const EditCard = styled(CardBase)`
  border-radius: 1rem;
  padding: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1rem;
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;

  input[type='checkbox'] {
    width: 1.25rem;
    height: 1.25rem;
    color: #2563eb;
    border-radius: 0.25rem;
    cursor: pointer;

    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
    }
  }

  span {
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  padding-top: 1rem;
`;

const FlexButton = styled(PrimaryButton)`
  flex: 1;
`;

const CancelButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: 2px solid #d1d5db;
  color: #374151;
  font-weight: 500;
  border-radius: 0.5rem;
  background-color: white;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f9fafb;
  }
`;

export default function UserEditPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  const { userInfo } = useUserStore();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSeller, setIsSeller] = useState(false);

  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!userInfo?.isAdmin) {
      router.push('/signin');
      return;
    }
    fetchUser();
  }, [userId, userInfo, router]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get<User>(`/users/${userId}`);
      setUsername(data.username);
      setEmail(data.email);
      setIsAdmin(data.isAdmin);
      setIsSeller(data.isSeller);
    } catch {
      setError('Errore nel caricamento dell\'utente');
    } finally {
      setLoading(false);
    }
  };

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setUpdateLoading(true);
      setError('');
      await apiClient.put(`/users/${userId}`, {
        username,
        email,
        isAdmin,
        isSeller,
      });
      setSuccess(true);
      setTimeout(() => router.push('/userlist'), 1500);
    } catch {
      setError('Errore nell\'aggiornamento dell\'utente');
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) return <LoadingBox />;
  if (!userInfo) return null;

  return (
    <UserEditContainer>
      <PageTitle>Modifica Utente</PageTitle>

      <EditCard>
        {error && <MessageBox variant="danger">{error}</MessageBox>}
        {success && <MessageBox variant="success">Utente aggiornato!</MessageBox>}

        <Form onSubmit={submitHandler}>
          <FormGroup>
            <Label>Username *</Label>
            <Input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label>Email *</Label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormGroup>

          <CheckboxGroup>
            <CheckboxLabel>
              <input
                type="checkbox"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              />
              <span>Amministratore</span>
            </CheckboxLabel>

            <CheckboxLabel>
              <input
                type="checkbox"
                checked={isSeller}
                onChange={(e) => setIsSeller(e.target.checked)}
              />
              <span>Venditore</span>
            </CheckboxLabel>
          </CheckboxGroup>

          <ButtonGroup>
            <FlexButton
              type="submit"
              disabled={updateLoading}
            >
              {updateLoading ? 'Salvataggio...' : 'Salva Modifiche'}
            </FlexButton>
            <CancelButton
              type="button"
              onClick={() => router.push('/userlist')}
            >
              Annulla
            </CancelButton>
          </ButtonGroup>
        </Form>
      </EditCard>
    </UserEditContainer>
  );
}
