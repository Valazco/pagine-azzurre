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
    <div className="container mx-auto px-4 py-8">
      <CheckoutSteps step1 step2 step3 step4 />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Spedizione</h2>
            <div className="text-gray-600 space-y-1">
              <p><span className="font-medium text-gray-900">Nome:</span> {shippingAddress?.fullName}</p>
              <p>
                <span className="font-medium text-gray-900">Indirizzo:</span>{' '}
                {shippingAddress?.address}, {shippingAddress?.city}, {shippingAddress?.postalCode}, {shippingAddress?.country}
              </p>
              {shippingAddress?.phone && (
                <p><span className="font-medium text-gray-900">Telefono:</span> {shippingAddress.phone}</p>
              )}
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Metodo di Pagamento</h2>
            <p className="text-gray-600">
              <span className="font-medium text-gray-900">Metodo:</span> Da concordare con l&apos;offerente
            </p>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Articoli dell&apos;ordine</h2>
            <ul className="divide-y divide-gray-100">
              {cartItems.map((item) => (
                <li key={item.product} className="py-4 flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image
                      src={item.image || '/img-not-found.png'}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/product/${item.product}`}
                      className="text-gray-900 font-medium hover:text-blue-600 line-clamp-1"
                    >
                      {item.name}
                    </Link>
                  </div>
                  <div className="text-right text-sm">
                    <p className="text-gray-900">
                      {item.qty} x €{item.price.toFixed(2)} = €{(item.qty * item.price).toFixed(2)}
                    </p>
                    <p className="text-blue-600">
                      {item.qty} x ☯{item.priceVal} = ☯{item.qty * item.priceVal}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sticky top-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Riepilogo Ordine</h2>

            <div className="space-y-4">
              <div className="flex justify-between text-gray-600">
                <span>Articoli</span>
                <div className="text-right">
                  <span className="block">€ {itemsPriceEuro.toFixed(2)}</span>
                  <span className="block text-blue-600">☯ {itemsPriceVal}</span>
                </div>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Spedizione</span>
                <span>Da concordare</span>
              </div>

              <div className="border-t border-gray-100 pt-4 flex justify-between">
                <span className="font-semibold text-gray-900">Totale</span>
                <div className="text-right">
                  <span className="block text-xl font-bold text-gray-900">€ {itemsPriceEuro.toFixed(2)}</span>
                  <span className="block text-lg font-bold text-blue-600">☯ {itemsPriceVal}</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-4">
                <MessageBox variant="danger">{error}</MessageBox>
              </div>
            )}

            <button
              onClick={placeOrderHandler}
              disabled={cartItems.length === 0 || loading}
              className="w-full mt-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Invio in corso...' : 'Invia richiesta all\'offerente'}
            </button>

            {loading && <LoadingBox />}

            {!userInfo.hasAd && (
              <div className="mt-4">
                <MessageBox variant="warning">
                  Per contattare un offerente devi prima mettere un prodotto in vetrina.{' '}
                  <Link href="/productlist/seller" className="underline font-medium">
                    Crea l&apos;annuncio adesso
                  </Link>
                </MessageBox>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
