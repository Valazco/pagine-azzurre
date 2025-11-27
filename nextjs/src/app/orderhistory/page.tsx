'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/lib/api/client';
import { useUserStore } from '@/lib/store/user';
import LoadingBox from '@/components/ui/LoadingBox';
import MessageBox from '@/components/ui/MessageBox';
import type { Order } from '@/types';

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Storico Ordini</h1>

      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : orders.length === 0 ? (
        <MessageBox variant="info">
          Non hai ancora effettuato ordini.{' '}
          <Link href="/" className="text-blue-600 hover:underline">
            Vai alla vetrina
          </Link>
        </MessageBox>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Data</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Totale</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Pagato</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Consegnato</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                      {order._id.slice(-8)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString('it-IT')}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="text-blue-600 font-medium">
                        ☯ {order.orderItems.reduce((a, c) => a + c.priceVal * c.qty, 0)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {order.isPaid ? (
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                          {new Date(order.paidAt!).toLocaleDateString('it-IT')}
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
                          In attesa
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {order.isDelivered ? (
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                          {new Date(order.deliveredAt!).toLocaleDateString('it-IT')}
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                          No
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/order/${order._id}`}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        Dettaglio
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
