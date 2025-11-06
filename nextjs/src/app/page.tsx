'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  LoadingBox,
  MessageBox,
  Product,
  WelcomeBanner,
  Pagination,
  CookieConsent,
} from '@/components/ui';
import { getProducts } from '@/lib/api/products';
import type { Product as ProductType } from '@/types';

type Section = 'offro' | 'cerco' | 'propongo' | 'avviso' | 'dono';

export default function HomePage() {
  const router = useRouter();
  const [section, setSection] = useState<Section>('offro');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProducts({ pageNumber: page });
        setProducts(data.products || []);
        setPages(data.pages || 1);
        setPage(data.page || 1);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Errore nel caricamento dei prodotti'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page]);

  const filteredProducts = products.filter(
    (product) =>
      product.section === section &&
      !product.pause &&
      !product.name.match(/Annunciø/)
  );

  const sectionButtons: { value: Section; label: string }[] = [
    { value: 'offro', label: 'Offerte' },
    { value: 'cerco', label: 'Richieste' },
    { value: 'propongo', label: 'Proposte' },
    { value: 'avviso', label: 'Avvisi' },
    { value: 'dono', label: 'Dono/Tempo' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Welcome Banner */}
      <WelcomeBanner />

      {/* Cookie Consent */}
      <CookieConsent />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Section Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Ultime Attività
          </h1>
          <p className="text-gray-600 text-lg">
            Esplora le nostre sezioni di prodotti e servizi
          </p>
        </div>

        {/* Section Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {sectionButtons.map((btn) => (
            <button
              key={btn.value}
              onClick={() => setSection(btn.value)}
              className={`
                px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-200
                ${
                  section === btn.value
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300 hover:shadow-md'
                }
              `}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-12">
            <LoadingBox />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="max-w-2xl mx-auto py-8">
            <MessageBox variant="danger">{error}</MessageBox>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <>
            {filteredProducts.length === 0 ? (
              <div className="max-w-2xl mx-auto py-12">
                <MessageBox variant="info">
                  Nessun prodotto trovato in questa sezione
                </MessageBox>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {filteredProducts.map((product) => (
                  <Product key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            <Pagination currentPage={page} totalPages={pages} />
          </>
        )}
      </div>
    </div>
  );
}
