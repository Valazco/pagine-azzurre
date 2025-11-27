'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cart';
import { useUserStore } from '@/lib/store/user';
import CartItem from '@/components/ui/CartItem';
import MessageBox from '@/components/ui/MessageBox';

export default function CartPage() {
  const router = useRouter();
  const { cartItems, itemsPrice, totalPriceVal } = useCartStore();
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Processo di contatto all&apos;offerente
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          {cartItems.length === 0 ? (
            <MessageBox variant="info">
              Il carrello è vuoto.{' '}
              <Link href="/" className="text-blue-600 hover:underline font-medium">
                Torna alla Vetrina
              </Link>
            </MessageBox>
          ) : (
            <ul className="space-y-4">
              {cartItems.map((item) => (
                <CartItem key={item.product} item={item} />
              ))}
            </ul>
          )}
        </div>

        {/* Summary Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Riepilogo</h2>

            <p className="text-gray-600 mb-4">
              Comincia cercando articoli che ti interessano
            </p>

            <div className="border-t border-gray-100 pt-4 space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Articoli ({totalQty})</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">Totale VAL</span>
                <span className="text-xl font-bold text-blue-600">☯ {totalVal}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">Totale Euro</span>
                <span className="text-xl font-bold text-gray-900">€ {totalEuro.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={checkoutHandler}
              disabled={cartItems.length === 0}
              className="w-full mt-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Continua per contattare l&apos;offerente
            </button>

            {userInfo && !userInfo.hasAd && (
              <div className="mt-4">
                <MessageBox variant="warning">
                  Per contattare un offerente devi prima mettere un prodotto in vetrina.{' '}
                  <Link href="/productlist/seller" className="underline font-medium">
                    Crea l&apos;annuncio adesso
                  </Link>
                </MessageBox>
              </div>
            )}

            {!userInfo && (
              <div className="mt-4">
                <MessageBox variant="warning">
                  Devi essere{' '}
                  <Link href="/signin" className="underline font-medium">
                    loggato
                  </Link>{' '}
                  per continuare.
                </MessageBox>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
