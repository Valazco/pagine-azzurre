'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cart';
import { useUserStore } from '@/lib/store/user';
import CheckoutSteps from '@/components/ui/CheckoutSteps';
import MessageBox from '@/components/ui/MessageBox';

export default function ShippingPage() {
  const router = useRouter();
  const { userInfo } = useUserStore();
  const { shippingAddress, saveShippingAddress } = useCartStore();

  const [fullName, setFullName] = useState(shippingAddress?.fullName || '');
  const [address, setAddress] = useState(shippingAddress?.address || '');
  const [city, setCity] = useState(shippingAddress?.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
  const [country] = useState('Italia');
  const [phone, setPhone] = useState(shippingAddress?.phone || '');

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!userInfo) {
      router.push('/signin?redirect=shipping');
    }
  }, [userInfo, router]);

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    saveShippingAddress({
      fullName,
      address,
      city,
      postalCode,
      country,
      phone,
    });
    router.push('/payment');
  };

  if (!userInfo) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <CheckoutSteps step1 step2 />

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">
          Indirizzo di Spedizione e Contatto
        </h1>

        <form onSubmit={submitHandler} className="space-y-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Nome e Cognome *
            </label>
            <input
              type="text"
              id="fullName"
              placeholder="Inserisci nome e cognome"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Indirizzo *
            </label>
            <input
              type="text"
              id="address"
              placeholder="Inserisci indirizzo"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                Città *
              </label>
              <input
                type="text"
                id="city"
                placeholder="Inserisci città"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                CAP *
              </label>
              <input
                type="text"
                id="postalCode"
                placeholder="Codice postale"
                required
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
              Nazione
            </label>
            <input
              type="text"
              id="country"
              value="🇮🇹 Italia"
              readOnly
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email 📧
            </label>
            <input
              type="email"
              id="email"
              value={userInfo.email}
              readOnly
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Telefono 📞
            </label>
            <input
              type="tel"
              id="phone"
              placeholder="Inserisci numero di telefono"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continua
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
    </div>
  );
}
