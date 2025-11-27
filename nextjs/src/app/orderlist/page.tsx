'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/lib/api/client';
import { useUserStore } from '@/lib/store/user';
import LoadingBox from '@/components/ui/LoadingBox';
import MessageBox from '@/components/ui/MessageBox';
import type { Order } from '@/types';

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
      setOrders(data);
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Gestione Ordini</h1>

      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : orders.length === 0 ? (
        <MessageBox variant="info">Nessun ordine trovato</MessageBox>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Utente</th>
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
                      {typeof order.user === 'object' ? order.user.username : order.user?.slice(-6)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString('it-IT')}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="text-blue-600 font-medium">
                        ☯ {order.orderItems.reduce((a, c) => a + c.priceVal * c.qty, 0)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        order.isPaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.isPaid ? 'Sì' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        order.isDelivered ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {order.isDelivered ? 'Sì' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link
                          href={`/order/${order._id}`}
                          className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                        >
                          Dettaglio
                        </Link>
                        {userInfo.isAdmin && (
                          <button
                            onClick={() => handleDelete(order._id)}
                            className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
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
        </div>
      )}
    </div>
  );
}
