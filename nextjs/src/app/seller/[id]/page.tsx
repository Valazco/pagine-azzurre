'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getUserProfile } from '@/lib/api/users';
import { getProducts } from '@/lib/api/products';
import LoadingBox from '@/components/ui/LoadingBox';
import MessageBox from '@/components/ui/MessageBox';
import Product from '@/components/ui/Product';
import Rating from '@/components/ui/Rating';
import type { User, Product as ProductType } from '@/types';

export default function SellerPage() {
  const params = useParams();
  const sellerId = params.id as string;

  const [seller, setSeller] = useState<User | null>(null);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSellerData();
  }, [sellerId]);

  const fetchSellerData = async () => {
    try {
      setLoading(true);
      const [sellerData, productsData] = await Promise.all([
        getUserProfile(sellerId),
        getProducts({ pageSize: 100 }),
      ]);
      setSeller(sellerData);
      // Filter products by seller
      const sellerProducts = productsData.products.filter(
        (p) => p.seller._id === sellerId
      );
      setProducts(sellerProducts);
    } catch {
      setError('Errore nel caricamento del venditore');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingBox />;
  if (error) return <MessageBox variant="danger">{error}</MessageBox>;
  if (!seller) return <MessageBox variant="danger">Venditore non trovato</MessageBox>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Seller Info */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <div className="flex flex-col md:flex-row items-start gap-6">
          {seller.seller?.logo && (
            <img
              src={seller.seller.logo}
              alt={seller.seller.name}
              className="w-32 h-32 rounded-xl object-cover"
            />
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {seller.seller?.name || seller.username}
            </h1>
            {seller.seller && (
              <div className="mb-4">
                <Rating rating={seller.seller.rating} numReviews={seller.seller.numReviews} />
              </div>
            )}
            {seller.seller?.description && (
              <p className="text-gray-600">{seller.seller.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Seller Products */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Prodotti del Venditore</h2>

      {products.length === 0 ? (
        <MessageBox variant="info">Questo venditore non ha ancora prodotti</MessageBox>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Product key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
