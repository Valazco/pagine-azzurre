'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/lib/store/cart';
import { useUserStore } from '@/lib/store/user';
import CheckoutSteps from '@/components/ui/CheckoutSteps';
import LoadingBox from '@/components/ui/LoadingBox';
import MessageBox from '@/components/ui/MessageBox';
import apiClient from '@/lib/api/client';
import {
  Container,
  TwoColumnGrid,
  MainColumn,
  SideColumn,
  CardBase,
  StickyCard,
  PrimaryButton,
  TextLink,
} from '@/lib/styles';

export default function PlaceOrderPage() {
  const router = useRouter();
  const { userInfo } = useUserStore();
  const { cartItems, shippingAddress, paymentMethod, clearCart } = useCartStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const itemsPriceVal = cartItems.reduce((acc, item) => acc + item.priceVal * item.qty, 0);
  const itemsPriceEuro = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!paymentMethod) {
      router.push('/payment');
    }
  }, [paymentMethod, router]);

  const placeOrderHandler = async () => {
    if (!userInfo?.hasAd) {
      alert('Per contattare un offerente devi prima mettere un prodotto in vetrina.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const { data } = await apiClient.post('/orders', {
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice: itemsPriceEuro,
        shippingPrice: 0,
        taxPrice: 0,
        totalPrice: itemsPriceEuro,
      });

      clearCart();
      router.push(`/order/${data._id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Errore nella creazione dell\'ordine');
    } finally {
      setLoading(false);
    }
  };

  if (!userInfo) return null;

  return (
    <Container style={{ padding: '2rem 1rem' }}>
      <CheckoutSteps step1 step2 step3 step4 />

      <TwoColumnGrid style={{ gridTemplateColumns: '1fr', gap: '2rem', marginTop: '2rem' }}>
        {/* Order Details */}
        <MainColumn style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Shipping Info */}
          <CardBase>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>Spedizione</h2>
            <div style={{ color: '#6b7280', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <p><span style={{ fontWeight: '500', color: '#111827' }}>Nome:</span> {shippingAddress?.fullName}</p>
              <p>
                <span style={{ fontWeight: '500', color: '#111827' }}>Indirizzo:</span>{' '}
                {shippingAddress?.address}, {shippingAddress?.city}, {shippingAddress?.postalCode}, {shippingAddress?.country}
              </p>
              {shippingAddress?.phone && (
                <p><span style={{ fontWeight: '500', color: '#111827' }}>Telefono:</span> {shippingAddress.phone}</p>
              )}
            </div>
          </CardBase>

          {/* Payment Method */}
          <CardBase>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>Metodo di Pagamento</h2>
            <p style={{ color: '#6b7280' }}>
              <span style={{ fontWeight: '500', color: '#111827' }}>Metodo:</span> Da concordare con l&apos;offerente
            </p>
          </CardBase>

          {/* Order Items */}
          <CardBase>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>Articoli dell&apos;ordine</h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', borderTop: '1px solid #f3f4f6' }}>
              {cartItems.map((item) => (
                <li key={item.product} style={{ padding: '1rem 0', display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid #f3f4f6' }}>
                  <div style={{ position: 'relative', width: '4rem', height: '4rem', borderRadius: '0.5rem', overflow: 'hidden', backgroundColor: '#f3f4f6', flexShrink: 0 }}>
                    <Image
                      src={item.image || '/img-not-found.png'}
                      alt={item.name}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link
                      href={`/product/${item.product}`}
                      style={{ color: '#111827', fontWeight: '500', textDecoration: 'none', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#2563eb'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#111827'}
                    >
                      {item.name}
                    </Link>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '0.875rem' }}>
                    <p style={{ color: '#111827', margin: 0 }}>
                      {item.qty} x €{item.price.toFixed(2)} = €{(item.qty * item.price).toFixed(2)}
                    </p>
                    <p style={{ color: '#2563eb', margin: 0 }}>
                      {item.qty} x ☯{item.priceVal} = ☯{item.qty * item.priceVal}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </CardBase>
        </MainColumn>

        {/* Order Summary */}
        <SideColumn>
          <StickyCard style={{ boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1.5rem' }}>Riepilogo Ordine</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280' }}>
                <span>Articoli</span>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ display: 'block' }}>€ {itemsPriceEuro.toFixed(2)}</span>
                  <span style={{ display: 'block', color: '#2563eb' }}>☯ {itemsPriceVal}</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280' }}>
                <span>Spedizione</span>
                <span>Da concordare</span>
              </div>

              <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: '600', color: '#111827' }}>Totale</span>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ display: 'block', fontSize: '1.25rem', fontWeight: '700', color: '#111827' }}>€ {itemsPriceEuro.toFixed(2)}</span>
                  <span style={{ display: 'block', fontSize: '1.125rem', fontWeight: '700', color: '#2563eb' }}>☯ {itemsPriceVal}</span>
                </div>
              </div>
            </div>

            {error && (
              <div style={{ marginTop: '1rem' }}>
                <MessageBox variant="danger">{error}</MessageBox>
              </div>
            )}

            <PrimaryButton
              onClick={placeOrderHandler}
              disabled={cartItems.length === 0 || loading}
              style={{ marginTop: '1.5rem' }}
            >
              {loading ? 'Invio in corso...' : 'Invia richiesta all\'offerente'}
            </PrimaryButton>

            {loading && <LoadingBox />}

            {!userInfo.hasAd && (
              <div style={{ marginTop: '1rem' }}>
                <MessageBox variant="warning">
                  Per contattare un offerente devi prima mettere un prodotto in vetrina.{' '}
                  <Link href="/productlist/seller" style={{ textDecoration: 'underline', fontWeight: '500' }}>
                    Crea l&apos;annuncio adesso
                  </Link>
                </MessageBox>
              </div>
            )}
          </StickyCard>
        </SideColumn>
      </TwoColumnGrid>
    </Container>
  );
}
