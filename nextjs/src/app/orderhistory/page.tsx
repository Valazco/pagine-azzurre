'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/lib/api/client';
import { useUserStore } from '@/lib/store/user';
import LoadingBox from '@/components/ui/LoadingBox';
import MessageBox from '@/components/ui/MessageBox';
import type { Order } from '@/types';
import {
  Container,
  PageTitle,
  CardBase,
  TextLink,
} from '@/lib/styles';

export default function OrderHistoryPage() {
  const router = useRouter();
  const { userInfo } = useUserStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!userInfo) {
      router.push('/signin?redirect=orderhistory');
      return;
    }
    fetchOrders();
  }, [userInfo, router]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get('/orders/mine');
      setOrders(data);
    } catch {
      setError('Errore nel caricamento degli ordini');
    } finally {
      setLoading(false);
    }
  };

  if (!userInfo) return null;

  return (
    <Container style={{ padding: '2rem 1rem' }}>
      <PageTitle>Storico Ordini</PageTitle>

      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : orders.length === 0 ? (
        <MessageBox variant="info">
          Non hai ancora effettuato ordini.{' '}
          <TextLink href="/">
            Vai alla vetrina
          </TextLink>
        </MessageBox>
      ) : (
        <CardBase style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <tr>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>ID</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>Data</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>Totale</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>Pagato</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>Consegnato</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>Azioni</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    style={{ borderBottom: '1px solid #f3f4f6', transition: 'background-color 0.15s' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#6b7280', fontFamily: 'monospace' }}>
                      {order._id.slice(-8)}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#111827' }}>
                      {new Date(order.createdAt).toLocaleDateString('it-IT')}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>
                      <span style={{ color: '#2563eb', fontWeight: '500' }}>
                        ☯ {order.orderItems.reduce((a, c) => a + c.priceVal * c.qty, 0)}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      {order.isPaid ? (
                        <span style={{ display: 'inline-flex', padding: '0.25rem 0.5rem', fontSize: '0.75rem', fontWeight: '500', backgroundColor: '#dcfce7', color: '#15803d', borderRadius: '9999px' }}>
                          {new Date(order.paidAt!).toLocaleDateString('it-IT')}
                        </span>
                      ) : (
                        <span style={{ display: 'inline-flex', padding: '0.25rem 0.5rem', fontSize: '0.75rem', fontWeight: '500', backgroundColor: '#fef3c7', color: '#a16207', borderRadius: '9999px' }}>
                          In attesa
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      {order.isDelivered ? (
                        <span style={{ display: 'inline-flex', padding: '0.25rem 0.5rem', fontSize: '0.75rem', fontWeight: '500', backgroundColor: '#dcfce7', color: '#15803d', borderRadius: '9999px' }}>
                          {new Date(order.deliveredAt!).toLocaleDateString('it-IT')}
                        </span>
                      ) : (
                        <span style={{ display: 'inline-flex', padding: '0.25rem 0.5rem', fontSize: '0.75rem', fontWeight: '500', backgroundColor: '#f3f4f6', color: '#374151', borderRadius: '9999px' }}>
                          No
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <Link
                        href={`/order/${order._id}`}
                        style={{ color: '#2563eb', fontWeight: '500', fontSize: '0.875rem', textDecoration: 'none' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#1d4ed8'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#2563eb'}
                      >
                        Dettaglio
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBase>
      )}
    </Container>
  );
}
