'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styled from 'styled-components';
import { useUserStore } from '@/lib/store/user';
import LoadingBox from '@/components/ui/LoadingBox';
import MessageBox from '@/components/ui/MessageBox';
import { FlexCenter, PrimaryButton } from '@/lib/styles';
import Link from 'next/link';

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

const IconContainer = styled.div<{ $variant?: 'success' | 'error' | 'loading' }>`
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
  margin-bottom: 1rem;
`;

const Description = styled.p`
  color: #6b7280;
  margin-bottom: 1.5rem;
`;

export default function VerificationLinkPage() {
  const params = useParams();
  const router = useRouter();
  const { setUserInfo } = useUserStore();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [userName, setUserName] = useState('');

  // Use AbortController to handle React Strict Mode double-mounting
  // and prevent race conditions
  useEffect(() => {
    const abortController = new AbortController();
    let isCancelled = false;

    const verifyAccount = async () => {
      const id = params.id as string;

      if (!id) {
        if (!isCancelled) {
          setStatus('error');
          setMessage('Link di verifica non valido');
        }
        return;
      }

      try {
        const response = await fetch(`/api/users/verification/${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ uuid: id }),
          signal: abortController.signal,
        });

        // Don't update state if the request was cancelled
        if (isCancelled) return;

        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setUserName(data.user?.username || '');
          setMessage('Il tuo account è stato verificato con successo!');

          // Store user info for auto-login
          if (data.user) {
            setUserInfo({
              _id: data.user._id,
              username: data.user.username,
              email: data.user.email,
              isAdmin: data.user.isAdmin || false,
              isSeller: data.user.isSeller || false,
              account: data.user.account || '',
              hasAd: data.user.hasAd || false,
              token: data.user.token || '',
              verified: true,
            });
          }

          // Redirect to home after 3 seconds
          setTimeout(() => {
            if (!isCancelled) {
              router.push('/');
            }
          }, 3000);
        } else {
          setStatus('error');
          setMessage(data.message || 'Errore nella verifica');
        }
      } catch (error) {
        // Ignore AbortError - it's expected when component unmounts
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
        console.error('Verification error:', error);
        if (!isCancelled) {
          setStatus('error');
          setMessage('Errore di connessione. Riprova più tardi.');
        }
      }
    };

    verifyAccount();

    // Cleanup function - runs when component unmounts
    return () => {
      isCancelled = true;
      abortController.abort();
    };
  }, [params.id, router, setUserInfo]);

  return (
    <VerificationContainer>
      <VerificationCard>
        {status === 'loading' && (
          <>
            <IconContainer $variant="loading">
              <span>⏳</span>
            </IconContainer>
            <Title>Verifica in corso...</Title>
            <LoadingBox />
          </>
        )}

        {status === 'success' && (
          <>
            <IconContainer $variant="success">
              <span>✅</span>
            </IconContainer>
            <Title>Account Verificato!</Title>
            <MessageBox variant="success">
              {userName && `Benvenuto ${userName}! `}
              {message}
            </MessageBox>
            <Description>
              Verrai reindirizzato alla home page tra pochi secondi...
            </Description>
            <Link href="/">
              <PrimaryButton>Vai alla Home</PrimaryButton>
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <IconContainer $variant="error">
              <span>❌</span>
            </IconContainer>
            <Title>Errore di Verifica</Title>
            <MessageBox variant="danger">{message}</MessageBox>
            <Description>
              Il link potrebbe essere scaduto o già utilizzato.
            </Description>
            <Link href="/signin">
              <PrimaryButton>Vai al Login</PrimaryButton>
            </Link>
          </>
        )}
      </VerificationCard>
    </VerificationContainer>
  );
}
