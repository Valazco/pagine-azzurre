'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getTopSellers } from '@/lib/api/users';
import LoadingBox from '@/components/ui/LoadingBox';
import MessageBox from '@/components/ui/MessageBox';
import Rating from '@/components/ui/Rating';
import type { User } from '@/types';

export default function TopSellersPage() {
  const [sellers, setSellers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const data = await getTopSellers();
      setSellers(data);
    } catch {
      setError('Errore nel caricamento dei venditori');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Top Venditori</h1>

      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : sellers.length === 0 ? (
        <MessageBox variant="info">Nessun venditore trovato</MessageBox>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sellers.map((seller) => (
            <Link
              key={seller._id}
              href={`/seller/${seller._id}`}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-4">
                {seller.seller?.logo ? (
                  <img
                    src={seller.seller.logo}
                    alt={seller.seller.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-2xl text-blue-600">
                      {(seller.seller?.name || seller.username || 'V')[0]}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {seller.seller?.name || seller.username}
                  </h3>
                  {seller.seller && (
                    <Rating
                      rating={seller.seller.rating}
                      numReviews={seller.seller.numReviews}
                    />
                  )}
                </div>
              </div>
              {seller.seller?.description && (
                <p className="mt-4 text-sm text-gray-600 line-clamp-2">
                  {seller.seller.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
