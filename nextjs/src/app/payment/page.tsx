'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styled from 'styled-components';
import { useCartStore } from '@/lib/store/cart';
import { useUserStore } from '@/lib/store/user';
import CheckoutSteps from '@/components/ui/CheckoutSteps';
import MessageBox from '@/components/ui/MessageBox';
import { Container, CardBase, FormGroup, Label, Select, PrimaryButton, SecondaryButton } from '@/lib/styles';

const PaymentContainer = styled(Container)`
  max-width: 42rem;
  padding-top: 2rem;
  padding-bottom: 2rem;
`;

const PaymentCard = styled(CardBase)`
  padding: 2rem;
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

const FormSection = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ValDisplay = styled.div`
  background-color: #eff6ff;
  border-radius: 0.75rem;
  padding: 1.5rem;
  text-align: center;
`;

const ValLabel = styled.p`
  color: #6b7280;
  margin-bottom: 0.5rem;
`;

const ValAmount = styled.p`
  font-size: 2.25rem;
  font-weight: 700;
  color: #2563eb;
`;

const TransferButton = styled(PrimaryButton)`
  padding: 1rem 1.5rem;
`;

const StyledLink = styled(Link)`
  text-decoration: underline;
  font-weight: 500;
`;

export default function PaymentPage() {
  const router = useRouter();
  const { userInfo } = useUserStore();
  const { shippingAddress, cartItems, savePaymentMethod } = useCartStore();

  const [paymentMethod, setPaymentMethod] = useState('Concordato');
  const [phase, setPhase] = useState(1);

  const totalVal = cartItems.reduce((acc, item) => acc + item.priceVal * item.qty, 0);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!shippingAddress?.address) {
      router.push('/shipping');
    }
  }, [shippingAddress, router]);

  const handlePhase1Submit = (e: FormEvent) => {
    e.preventDefault();
    setPhase(2);
  };

  const handlePhase2Submit = (e: FormEvent) => {
    e.preventDefault();
    savePaymentMethod(paymentMethod);
    router.push('/placeorder');
  };

  if (!userInfo) return null;

  return (
    <PaymentContainer>
      <CheckoutSteps step1 step2 step3 />

      {phase === 1 && (
        <PaymentCard>
          <Title>Metodo di Pagamento</Title>
          <Subtitle>
            Il metodo di pagamento deve essere concordato direttamente con l&apos;offerente
          </Subtitle>

          <FormSection onSubmit={handlePhase1Submit}>
            <FormGroup>
              <Label htmlFor="paymentMethod">Seleziona il metodo di pagamento</Label>
              <Select
                id="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="Val">Val ☯️</option>
                <option value="Euro" disabled>Euro (attualmente inattivo)</option>
                <option value="Crypto" disabled>Monete speculative (attualmente inattivo)</option>
                <option value="Dinastycoin">Dinastycoin</option>
                <option value="Concordato">Da concordare</option>
              </Select>
            </FormGroup>

            <PrimaryButton type="submit">
              Prosegui
            </PrimaryButton>

            {!userInfo.hasAd && (
              <MessageBox variant="warning">
                Per contattare un offerente devi prima mettere un prodotto in vetrina.{' '}
                <StyledLink href="/productlist/seller">
                  Crea l&apos;annuncio adesso
                </StyledLink>
              </MessageBox>
            )}
          </FormSection>
        </PaymentCard>
      )}

      {phase === 2 && (
        <PaymentCard>
          <Title>Conferma Pagamento VAL</Title>
          <Subtitle>
            Trasferisci i VAL richiesti per questo scambio
          </Subtitle>

          <FormSection onSubmit={handlePhase2Submit}>
            <ValDisplay>
              <ValLabel>Totale VAL da trasferire</ValLabel>
              <ValAmount>☯ {totalVal}</ValAmount>
            </ValDisplay>

            <TransferButton type="submit">
              Trasferisci {totalVal} VAL all&apos;offerente
            </TransferButton>

            <SecondaryButton type="button" onClick={() => setPhase(1)}>
              Torna indietro
            </SecondaryButton>

            {!userInfo.hasAd && (
              <MessageBox variant="warning">
                Per contattare un offerente devi prima mettere un prodotto in vetrina.{' '}
                <StyledLink href="/productlist/seller">
                  Crea l&apos;annuncio adesso
                </StyledLink>
              </MessageBox>
            )}
          </FormSection>
        </PaymentCard>
      )}
    </PaymentContainer>
  );
}
