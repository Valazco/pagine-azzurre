'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cart';
import { useUserStore } from '@/lib/store/user';
import { CartItem, MessageBox } from '@/components/ui';
import {
  Container,
  PageTitle,
  TwoColumnGrid,
  MainColumn,
  SideColumn,
  CardBase,
  SectionTitle,
  ItemList,
  Divider,
  SummaryRow,
  SummaryLabel,
  PriceVal,
  PriceEuro,
  PrimaryButton,
  TextLink,
} from '@/lib/styles';

export default function CartPage() {
  const router = useRouter();
  const { cartItems } = useCartStore();
  const { userInfo } = useUserStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const checkoutHandler = () => {
    if (!userInfo) {
      router.push('/signin?redirect=shipping');
    } else {
      router.push('/shipping');
    }
  };

  const totalQty = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const totalVal = cartItems.reduce((acc, item) => acc + item.priceVal * item.qty, 0);
  const totalEuro = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <Container style={{ padding: '2rem 1rem' }}>
      <PageTitle>Processo di contatto all&apos;offerente</PageTitle>

      <TwoColumnGrid>
        {/* Cart Items */}
        <MainColumn>
          {cartItems.length === 0 ? (
            <MessageBox variant="info">
              Il carrello è vuoto.{' '}
              <TextLink href="/">Torna alla Vetrina</TextLink>
            </MessageBox>
          ) : (
            <ItemList>
              {cartItems.map((item) => (
                <CartItem key={item.product} item={item} />
              ))}
            </ItemList>
          )}
        </MainColumn>

        {/* Summary Card */}
        <SideColumn>
          <CardBase style={{ position: 'sticky', top: '1rem' }}>
            <SectionTitle>Riepilogo</SectionTitle>

            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
              Comincia cercando articoli che ti interessano
            </p>

            <Divider>
              <SummaryRow>
                <SummaryLabel>Articoli ({totalQty})</SummaryLabel>
              </SummaryRow>

              <SummaryRow>
                <span style={{ fontWeight: 500, color: '#111827' }}>Totale VAL</span>
                <PriceVal>☯ {totalVal}</PriceVal>
              </SummaryRow>

              <SummaryRow>
                <span style={{ fontWeight: 500, color: '#111827' }}>Totale Euro</span>
                <PriceEuro>€ {totalEuro.toFixed(2)}</PriceEuro>
              </SummaryRow>
            </Divider>

            <PrimaryButton
              onClick={checkoutHandler}
              disabled={cartItems.length === 0}
              style={{ marginTop: '1.5rem' }}
            >
              Continua per contattare l&apos;offerente
            </PrimaryButton>

            {userInfo && !userInfo.hasAd && (
              <div style={{ marginTop: '1rem' }}>
                <MessageBox variant="warning">
                  Per contattare un offerente devi prima mettere un prodotto in vetrina.{' '}
                  <Link href="/productlist/seller" style={{ textDecoration: 'underline', fontWeight: 500 }}>
                    Crea l&apos;annuncio adesso
                  </Link>
                </MessageBox>
              </div>
            )}

            {!userInfo && (
              <div style={{ marginTop: '1rem' }}>
                <MessageBox variant="warning">
                  Devi essere{' '}
                  <Link href="/signin" style={{ textDecoration: 'underline', fontWeight: 500 }}>
                    loggato
                  </Link>{' '}
                  per continuare.
                </MessageBox>
              </div>
            )}
          </CardBase>
        </SideColumn>
      </TwoColumnGrid>
    </Container>
  );
}
