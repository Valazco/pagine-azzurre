'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { useUserStore } from '@/lib/store/user';
import { updateUserProfile } from '@/lib/api/users';
import LoadingBox from '@/components/ui/LoadingBox';
import MessageBox from '@/components/ui/MessageBox';
import { Container, PageTitle, CardBase, FormGroup, Label, Input, PrimaryButton, Divider } from '@/lib/styles';

const ProfileContainer = styled(Container)`
  max-width: 42rem;
  padding-top: 2rem;
  padding-bottom: 2rem;
`;

const ProfileCard = styled(CardBase)`
  padding: 2rem;
`;

const FormSection = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1rem;
`;

const PasswordSection = styled.div`
  border-top: 1px solid #e5e7eb;
  padding-top: 1.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 500;
  color: #111827;
  margin-bottom: 1rem;
`;

const PasswordFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const AccountInfo = styled.div`
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  font-size: 0.875rem;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const InfoLabel = styled.span`
  color: #6b7280;
`;

const InfoValue = styled.span<{ $color?: string }>`
  margin-left: 0.5rem;
  color: ${({ $color }) => $color || '#111827'};
`;

export default function ProfilePage() {
  const router = useRouter();
  const { userInfo } = useUserStore();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userInfo) {
      router.push('/signin?redirect=profile');
      return;
    }
    setUsername(userInfo.username || '');
    setEmail(userInfo.email || '');
  }, [userInfo, router]);

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (password && password !== confirmPassword) {
      setError('Le password non coincidono');
      return;
    }

    try {
      setLoading(true);
      await updateUserProfile({
        username,
        email,
        ...(password && { password }),
      });
      setSuccess(true);
      setPassword('');
      setConfirmPassword('');
    } catch {
      setError('Errore nell\'aggiornamento del profilo');
    } finally {
      setLoading(false);
    }
  };

  if (!userInfo) return null;

  return (
    <ProfileContainer>
      <PageTitle>Il Mio Profilo</PageTitle>

      <ProfileCard>
        {loading && <LoadingBox />}
        {success && <MessageBox variant="success">Profilo aggiornato con successo!</MessageBox>}
        {error && <MessageBox variant="danger">{error}</MessageBox>}

        <FormSection onSubmit={submitHandler}>
          <FormGroup>
            <Label htmlFor="username">Username</Label>
            <Input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormGroup>

          <PasswordSection>
            <SectionTitle>Cambia Password</SectionTitle>

            <PasswordFields>
              <FormGroup>
                <Label htmlFor="password">Nuova Password</Label>
                <Input
                  type="password"
                  id="password"
                  placeholder="Lascia vuoto per non modificare"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="confirmPassword">Conferma Nuova Password</Label>
                <Input
                  type="password"
                  id="confirmPassword"
                  placeholder="Conferma la nuova password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </FormGroup>
            </PasswordFields>
          </PasswordSection>

          <PrimaryButton type="submit" disabled={loading}>
            {loading ? 'Aggiornamento...' : 'Aggiorna Profilo'}
          </PrimaryButton>
        </FormSection>

        <AccountInfo>
          <SectionTitle>Info Account</SectionTitle>
          <InfoGrid>
            <InfoItem>
              <InfoLabel>Stato:</InfoLabel>
              <InfoValue $color={userInfo.verified ? '#16a34a' : '#ca8a04'}>
                {userInfo.verified ? 'Verificato' : 'Non verificato'}
              </InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Tipo:</InfoLabel>
              <InfoValue>
                {userInfo.isAdmin ? 'Admin' : userInfo.isSeller ? 'Venditore' : 'Utente'}
              </InfoValue>
            </InfoItem>
          </InfoGrid>
        </AccountInfo>
      </ProfileCard>
    </ProfileContainer>
  );
}
