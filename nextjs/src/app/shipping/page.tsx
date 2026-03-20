'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styled from 'styled-components';
import { useCartStore } from '@/lib/store/cart';
import { useUserStore } from '@/lib/store/user';
import CheckoutSteps from '@/components/ui/CheckoutSteps';
import MessageBox from '@/components/ui/MessageBox';
import { Container, CardBase, FormGroup, Label, Input, PrimaryButton } from '@/lib/styles';

const ShippingContainer = styled(Container)`
  max-width: 42rem;
  padding-top: 2rem;
  padding-bottom: 2rem;
`;

const ShippingCard = styled(CardBase)`
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const FormSection = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const GridRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const ReadOnlyInput = styled(Input)`
  background-color: #f9fafb;
  color: #6b7280;
  border-color: #e5e7eb;
`;

const StyledLink = styled(Link)`
  text-decoration: underline;
  font-weight: 500;
`;

export default function ShippingPage() {
  const router = useRouter();
  const { userInfo } = useUserStore();
  const { shippingAddress, saveShippingAddress } = useCartStore();

  const [fullName, setFullName] = useState(shippingAddress?.fullName || '');
  const [address, setAddress] = useState(shippingAddress?.address || '');
  const [city, setCity] = useState(shippingAddress?.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
  const [country] = useState('Italia');
  const [phone, setPhone] = useState(shippingAddress?.phone || '');

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!userInfo) {
      router.push('/signin?redirect=shipping');
    }
  }, [userInfo, router]);

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    saveShippingAddress({
      fullName,
      address,
      city,
      postalCode,
      country,
      phone,
    });
    router.push('/payment');
  };

  if (!userInfo) return null;

  return (
    <ShippingContainer>
      <CheckoutSteps step1 step2 />

      <ShippingCard>
        <Title>Indirizzo di Spedizione e Contatto</Title>

        <FormSection onSubmit={submitHandler}>
          <FormGroup>
            <Label htmlFor="fullName">Nome e Cognome *</Label>
            <Input
              type="text"
              id="fullName"
              placeholder="Inserisci nome e cognome"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="address">Indirizzo *</Label>
            <Input
              type="text"
              id="address"
              placeholder="Inserisci indirizzo"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </FormGroup>

          <GridRow>
            <FormGroup>
              <Label htmlFor="city">Città *</Label>
              <Input
                type="text"
                id="city"
                placeholder="Inserisci città"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="postalCode">CAP *</Label>
              <Input
                type="text"
                id="postalCode"
                placeholder="Codice postale"
                required
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </FormGroup>
          </GridRow>

          <FormGroup>
            <Label htmlFor="country">Nazione</Label>
            <ReadOnlyInput
              type="text"
              id="country"
              value="🇮🇹 Italia"
              readOnly
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="email">Email 📧</Label>
            <ReadOnlyInput
              type="email"
              id="email"
              value={userInfo.email}
              readOnly
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="phone">Telefono 📞</Label>
            <Input
              type="tel"
              id="phone"
              placeholder="Inserisci numero di telefono"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </FormGroup>

          <PrimaryButton type="submit">
            Continua
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
      </ShippingCard>
    </ShippingContainer>
  );
}
