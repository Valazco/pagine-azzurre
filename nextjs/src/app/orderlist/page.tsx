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
} from '@/lib/styles';

export default function OrderListPage() {
  const router = useRouter();
  const { userInfo } = useUserStore();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userInfo?.isAdmin && !userInfo?.isSeller) {
      router.push('/signin');
      return;
    }
    fetchOrders();
  }, [userInfo, router]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get('/orders');
      // Handle both array response and { orders: [...] } response
      setOrders(Array.isArray(data) ? data : data.orders || []);
    } catch {
      setError('Errore nel caricamento degli ordini');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo ordine?')) return;
    try {
      await apiClient.delete(`/orders/${id}`);
      fetchOrders();
    } catch {
      alert('Errore nell\'eliminazione dell\'ordine');
    }
  };

  if (!userInfo) return null;

  return (
    <Container style={{ padding: '2rem 1rem' }}>
      <PageTitle>Gestione Ordini</PageTitle>

      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : orders.length === 0 ? (
        <MessageBox variant="info">Nessun ordine trovato</MessageBox>
      ) : (
        <CardBase style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <tr>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>ID</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>Utente</th>
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
                      {typeof order.user === 'object' ? order.user.username : order.user?.slice(-6)}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                      {new Date(order.createdAt).toLocaleDateString('it-IT')}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>
                      <span style={{ color: '#2563eb', fontWeight: '500' }}>
                        ☯ {order.orderItems.reduce((a, c) => a + c.priceVal * c.qty, 0)}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span style={{
                        display: 'inline-flex',
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        borderRadius: '9999px',
                        backgroundColor: order.isPaid ? '#dcfce7' : '#fef3c7',
                        color: order.isPaid ? '#15803d' : '#a16207'
                      }}>
                        {order.isPaid ? 'Sì' : 'No'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span style={{
                        display: 'inline-flex',
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        borderRadius: '9999px',
                        backgroundColor: order.isDelivered ? '#dcfce7' : '#f3f4f6',
                        color: order.isDelivered ? '#15803d' : '#6b7280'
                      }}>
                        {order.isDelivered ? 'Sì' : 'No'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link
                          href={`/order/${order._id}`}
                          style={{
                            padding: '0.25rem 0.75rem',
                            fontSize: '0.875rem',
                            backgroundColor: '#dbeafe',
                            color: '#2563eb',
                            borderRadius: '0.25rem',
                            textDecoration: 'none',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#bfdbfe'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dbeafe'}
                        >
                          Dettaglio
                        </Link>
                        {userInfo.isAdmin && (
                          <button
                            onClick={() => handleDelete(order._id)}
                            style={{
                              padding: '0.25rem 0.75rem',
                              fontSize: '0.875rem',
                              backgroundColor: '#fee2e2',
                              color: '#dc2626',
                              borderRadius: '0.25rem',
                              border: 'none',
                              cursor: 'pointer',
                              transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fecaca'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                          >
                            Elimina
                          </button>
                        )}
                      </div>
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
