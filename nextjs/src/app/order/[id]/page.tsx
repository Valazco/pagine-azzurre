'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import apiClient from '@/lib/api/client';
import { useUserStore } from '@/lib/store/user';
import LoadingBox from '@/components/ui/LoadingBox';
import MessageBox from '@/components/ui/MessageBox';
import type { Order } from '@/types';
import {
  Container,
  PageTitle,
  TwoColumnGrid,
  MainColumn,
  SideColumn,
  CardBase,
  StickyCard,
  TextLink,
} from '@/lib/styles';

export default function OrderPage() {
  const params = useParams();
  const orderId = params.id as string;
  const { userInfo } = useUserStore();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get(`/orders/${orderId}`);
      setOrder(data);
    } catch {
      setError('Errore nel caricamento dell\'ordine');
    } finally {
      setLoading(false);
    }
  };

  const markAsPaid = async () => {
    try {
      setActionLoading(true);
      await apiClient.put(`/orders/${orderId}/pay`);
      fetchOrder();
    } catch {
      alert('Errore nel segnare come pagato');
    } finally {
      setActionLoading(false);
    }
  };

  const markAsDelivered = async () => {
    try {
      setActionLoading(true);
      await apiClient.put(`/orders/${orderId}/deliver`);
      fetchOrder();
    } catch {
      alert('Errore nel segnare come consegnato');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <LoadingBox />;
  if (error) return <MessageBox variant="danger">{error}</MessageBox>;
  if (!order) return <MessageBox variant="danger">Ordine non trovato</MessageBox>;

  const isSeller = userInfo?._id === order.seller;

  return (
    <Container style={{ padding: '2rem 1rem' }}>
      <PageTitle style={{ marginBottom: '1.5rem' }}>
        Ordine <span style={{ color: '#6b7280', fontSize: '1.125rem' }}>#{order._id}</span>
      </PageTitle>

      <TwoColumnGrid style={{ gridTemplateColumns: '1fr', gap: '2rem' }}>
        {/* Order Details */}
        <MainColumn style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Shipping */}
          <CardBase>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>Spedizione</h2>
            <div style={{ color: '#6b7280', display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '1rem' }}>
              <p><span style={{ fontWeight: '500' }}>Nome:</span> {order.shippingAddress.fullName}</p>
              <p><span style={{ fontWeight: '500' }}>Indirizzo:</span> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
            </div>
            {order.isDelivered ? (
              <MessageBox variant="success">Consegnato il {new Date(order.deliveredAt!).toLocaleDateString('it-IT')}</MessageBox>
            ) : (
              <MessageBox variant="warning">Non ancora consegnato</MessageBox>
            )}
          </CardBase>

          {/* Payment */}
          <CardBase>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>Pagamento</h2>
            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
              <span style={{ fontWeight: '500' }}>Metodo:</span> Da concordare tra le parti
            </p>
            {order.isPaid ? (
              <MessageBox variant="success">Pagato il {new Date(order.paidAt!).toLocaleDateString('it-IT')}</MessageBox>
            ) : (
              <MessageBox variant="warning">Non ancora pagato</MessageBox>
            )}
          </CardBase>

          {/* Order Items */}
          <CardBase>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>Articoli</h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', borderTop: '1px solid #f3f4f6' }}>
              {order.orderItems.map((item) => (
                <li key={item.product} style={{ padding: '1rem 0', display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid #f3f4f6' }}>
                  <div style={{ position: 'relative', width: '4rem', height: '4rem', borderRadius: '0.5rem', overflow: 'hidden', backgroundColor: '#f3f4f6', flexShrink: 0 }}>
                    <Image
                      src={item.image || '/img-not-found.png'}
                      alt={item.name}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Link
                      href={`/product/${item.product}`}
                      style={{ color: '#111827', fontWeight: '500', textDecoration: 'none' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#2563eb'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#111827'}
                    >
                      {item.name}
                    </Link>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '0.875rem' }}>
                    <p style={{ margin: 0 }}>{item.qty} x ☯{item.priceVal} = ☯{item.qty * item.priceVal}</p>
                    <p style={{ color: '#6b7280', margin: 0 }}>{item.qty} x €{item.price} = €{(item.qty * item.price).toFixed(2)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardBase>
        </MainColumn>

        {/* Summary */}
        <SideColumn>
          <StickyCard style={{ boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1.5rem' }}>Riepilogo</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Articoli</span>
                <span>☯ {order.orderItems.reduce((a, c) => a + c.priceVal * c.qty, 0)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280' }}>
                <span>Spedizione</span>
                <span>Da concordare</span>
              </div>
              <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontWeight: '600', fontSize: '1.125rem' }}>
                <span>Totale</span>
                <span>☯ {order.orderItems.reduce((a, c) => a + c.priceVal * c.qty, 0)}</span>
              </div>
            </div>

            <div style={{ backgroundColor: '#eff6ff', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
              L&apos;offerente ha ricevuto una email con i tuoi dati di contatto.
              Controlla la tua email per concordare pagamento e consegna.
            </div>

            {/* Actions for Seller */}
            {isSeller && !order.isPaid && (
              <button
                onClick={markAsPaid}
                disabled={actionLoading}
                style={{
                  width: '100%',
                  marginBottom: '0.75rem',
                  padding: '0.75rem',
                  backgroundColor: '#16a34a',
                  color: 'white',
                  fontWeight: '600',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: actionLoading ? 'not-allowed' : 'pointer',
                  opacity: actionLoading ? 0.5 : 1,
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => !actionLoading && (e.currentTarget.style.backgroundColor = '#15803d')}
                onMouseLeave={(e) => !actionLoading && (e.currentTarget.style.backgroundColor = '#16a34a')}
              >
                Segna come Pagato
              </button>
            )}

            {/* Actions for Buyer */}
            {!isSeller && order.isPaid && !order.isDelivered && (
              <button
                onClick={markAsDelivered}
                disabled={actionLoading}
                style={{
                  width: '100%',
                  marginBottom: '0.75rem',
                  padding: '0.75rem',
                  backgroundColor: '#16a34a',
                  color: 'white',
                  fontWeight: '600',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: actionLoading ? 'not-allowed' : 'pointer',
                  opacity: actionLoading ? 0.5 : 1,
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => !actionLoading && (e.currentTarget.style.backgroundColor = '#15803d')}
                onMouseLeave={(e) => !actionLoading && (e.currentTarget.style.backgroundColor = '#16a34a')}
              >
                Segna come Consegnato
              </button>
            )}

            <Link
              href="/"
              style={{
                display: 'block',
                textAlign: 'center',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                color: '#374151',
                fontWeight: '500',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Torna alla Vetrina
            </Link>

            {actionLoading && <LoadingBox />}
          </StickyCard>
        </SideColumn>
      </TwoColumnGrid>
    </Container>
  );
}
