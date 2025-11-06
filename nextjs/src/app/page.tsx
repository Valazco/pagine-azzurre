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
    <div>
      {/* Welcome Banner */}
      <WelcomeBanner />

      {/* Cookie Consent */}
      <CookieConsent />

      <div>
        {/* Section Title */}
        <h1 className="text-[1.8rem] text-center p-4">
          ULTIME ATTIVITÀ
        </h1>

        {/* Section Filters */}
        <div className="flex justify-center my-4">
          {sectionButtons.map((btn) => (
            <button
              key={btn.value}
              onClick={() => setSection(btn.value)}
              className={
                section === btn.value
                  ? 'bg-[#dff3f7] px-[0.6rem] py-[0.6rem] mx-[0.4rem] shadow-[5px_5px_8px_#c7c7c7] underline rounded-[0.5rem] border-[0.2rem] border-[#a4a4a4]'
                  : 'bg-[#caf0f8] px-[0.4rem] py-[0.4rem] mx-[0.4rem] rounded-[0.5rem] border-[0.2rem] border-[#a4a4a4] hover:outline hover:outline-[0.1rem] hover:outline-[#9c9b9b]'
              }
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && <LoadingBox />}

        {/* Error State */}
        {error && !loading && (
          <MessageBox variant="danger">{error}</MessageBox>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <>
            {filteredProducts.length === 0 ? (
              <MessageBox variant="info">
                Nessun prodotto trovato in questa sezione
              </MessageBox>
            ) : (
              <div className="flex justify-center flex-wrap max-w-[1200px] mx-auto">
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
