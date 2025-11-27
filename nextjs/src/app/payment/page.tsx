'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cart';
import { useUserStore } from '@/lib/store/user';
import CheckoutSteps from '@/components/ui/CheckoutSteps';
import MessageBox from '@/components/ui/MessageBox';

export default function PaymentPage() {
  const router = useRouter();
  const { userInfo } = useUserStore();
  const { shippingAddress, cartItems, savePaymentMethod } = useCartStore();

  const [paymentMethod, setPaymentMethod] = useState('Concordato');
  const [phase, setPhase] = useState(1);

  const totalVal = cartItems.reduce((acc, item) => acc + item.priceVal * item.qty, 0);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!shippingAddress?.address) {
      router.push('/shipping');
    }
  }, [shippingAddress, router]);

  const handlePhase1Submit = (e: FormEvent) => {
    e.preventDefault();
    setPhase(2);
  };

  const handlePhase2Submit = (e: FormEvent) => {
    e.preventDefault();
    savePaymentMethod(paymentMethod);
    router.push('/placeorder');
  };

  if (!userInfo) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <CheckoutSteps step1 step2 step3 />

      {phase === 1 && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Metodo di Pagamento
          </h1>
          <p className="text-gray-600 text-center mb-6">
            Il metodo di pagamento deve essere concordato direttamente con l&apos;offerente
          </p>

          <form onSubmit={handlePhase1Submit} className="space-y-6">
            <div>
              <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-2">
                Seleziona il metodo di pagamento
              </label>
              <select
                id="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Val">Val ☯️</option>
                <option value="Euro" disabled>Euro (attualmente inattivo)</option>
                <option value="Crypto" disabled>Monete speculative (attualmente inattivo)</option>
                <option value="Dinastycoin">Dinastycoin</option>
                <option value="Concordato">Da concordare</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Prosegui
            </button>

            {!userInfo.hasAd && (
              <MessageBox variant="warning">
                Per contattare un offerente devi prima mettere un prodotto in vetrina.{' '}
                <Link href="/productlist/seller" className="underline font-medium">
                  Crea l&apos;annuncio adesso
                </Link>
              </MessageBox>
            )}
          </form>
        </div>
      )}

      {phase === 2 && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Conferma Pagamento VAL
          </h1>
          <p className="text-gray-600 text-center mb-6">
            Trasferisci i VAL richiesti per questo scambio
          </p>

          <form onSubmit={handlePhase2Submit} className="space-y-6">
            <div className="bg-blue-50 rounded-xl p-6 text-center">
              <p className="text-gray-600 mb-2">Totale VAL da trasferire</p>
              <p className="text-4xl font-bold text-blue-600">
                ☯ {totalVal}
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Trasferisci {totalVal} VAL all&apos;offerente
            </button>

            <button
              type="button"
              onClick={() => setPhase(1)}
              className="w-full py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Torna indietro
            </button>

            {!userInfo.hasAd && (
              <MessageBox variant="warning">
                Per contattare un offerente devi prima mettere un prodotto in vetrina.{' '}
                <Link href="/productlist/seller" className="underline font-medium">
                  Crea l&apos;annuncio adesso
                </Link>
              </MessageBox>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
