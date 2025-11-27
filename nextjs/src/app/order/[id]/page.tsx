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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Ordine <span className="text-gray-500 text-lg">#{order._id}</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Spedizione</h2>
            <div className="text-gray-600 space-y-1 mb-4">
              <p><span className="font-medium">Nome:</span> {order.shippingAddress.fullName}</p>
              <p><span className="font-medium">Indirizzo:</span> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
            </div>
            {order.isDelivered ? (
              <MessageBox variant="success">Consegnato il {new Date(order.deliveredAt!).toLocaleDateString('it-IT')}</MessageBox>
            ) : (
              <MessageBox variant="warning">Non ancora consegnato</MessageBox>
            )}
          </div>

          {/* Payment */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pagamento</h2>
            <p className="text-gray-600 mb-4">
              <span className="font-medium">Metodo:</span> Da concordare tra le parti
            </p>
            {order.isPaid ? (
              <MessageBox variant="success">Pagato il {new Date(order.paidAt!).toLocaleDateString('it-IT')}</MessageBox>
            ) : (
              <MessageBox variant="warning">Non ancora pagato</MessageBox>
            )}
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Articoli</h2>
            <ul className="divide-y divide-gray-100">
              {order.orderItems.map((item) => (
                <li key={item.product} className="py-4 flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image
                      src={item.image || '/img-not-found.png'}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <Link href={`/product/${item.product}`} className="text-gray-900 font-medium hover:text-blue-600">
                      {item.name}
                    </Link>
                  </div>
                  <div className="text-right text-sm">
                    <p>{item.qty} x ☯{item.priceVal} = ☯{item.qty * item.priceVal}</p>
                    <p className="text-gray-500">{item.qty} x €{item.price} = €{(item.qty * item.price).toFixed(2)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sticky top-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Riepilogo</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Articoli</span>
                <span>☯ {order.orderItems.reduce((a, c) => a + c.priceVal * c.qty, 0)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Spedizione</span>
                <span>Da concordare</span>
              </div>
              <div className="border-t pt-4 flex justify-between font-semibold text-lg">
                <span>Totale</span>
                <span>☯ {order.orderItems.reduce((a, c) => a + c.priceVal * c.qty, 0)}</span>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mb-6 text-sm text-gray-600">
              L&apos;offerente ha ricevuto una email con i tuoi dati di contatto.
              Controlla la tua email per concordare pagamento e consegna.
            </div>

            {/* Actions for Seller */}
            {isSeller && !order.isPaid && (
              <button
                onClick={markAsPaid}
                disabled={actionLoading}
                className="w-full mb-3 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                Segna come Pagato
              </button>
            )}

            {/* Actions for Buyer */}
            {!isSeller && order.isPaid && !order.isDelivered && (
              <button
                onClick={markAsDelivered}
                disabled={actionLoading}
                className="w-full mb-3 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                Segna come Consegnato
              </button>
            )}

            <Link
              href="/"
              className="block text-center py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Torna alla Vetrina
            </Link>

            {actionLoading && <LoadingBox />}
          </div>
        </div>
      </div>
    </div>
  );
}
