'use client';

import { useEffect, useState } from 'react';
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
import {
  PageContainer,
  ContentContainer,
  TextCenter,
  PageTitle,
  PageSubtitle,
  FlexWrap,
  FilterButton,
  LoadingContainer,
  ErrorContainer,
  EmptyContainer,
  GridContainer,
} from '@/lib/styles';

type Section = 'offro' | 'cerco' | 'propongo' | 'avviso' | 'dono';

export default function HomePage() {
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
        const data = await getProducts({ section, pageNumber: page });
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
  }, [page, section]);

  const sectionButtons: { value: Section; label: string }[] = [
    { value: 'offro', label: 'Offerte' },
    { value: 'cerco', label: 'Richieste' },
    { value: 'propongo', label: 'Proposte' },
    { value: 'avviso', label: 'Avvisi' },
    { value: 'dono', label: 'Dono/Tempo' },
  ];

  return (
    <PageContainer>
      {/* Welcome Banner */}
      <WelcomeBanner />

      {/* Cookie Consent */}
      <CookieConsent />

      <ContentContainer>
        {/* Section Title */}
        <TextCenter>
          <PageTitle>Ultime Attività</PageTitle>
          <PageSubtitle>
            Esplora le nostre sezioni di prodotti e servizi
          </PageSubtitle>
        </TextCenter>

        {/* Section Filters */}
        <FlexWrap>
          {sectionButtons.map((btn) => (
            <FilterButton
              key={btn.value}
              onClick={() => { setSection(btn.value); setPage(1); }}
              $isActive={section === btn.value}
            >
              {btn.label}
            </FilterButton>
          ))}
        </FlexWrap>

        {/* Loading State */}
        {loading && (
          <LoadingContainer>
            <LoadingBox />
          </LoadingContainer>
        )}

        {/* Error State */}
        {error && !loading && (
          <ErrorContainer>
            <MessageBox variant="danger">{error}</MessageBox>
          </ErrorContainer>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <>
            {products.length === 0 ? (
              <EmptyContainer>
                <MessageBox variant="info">
                  Nessun prodotto trovato in questa sezione
                </MessageBox>
              </EmptyContainer>
            ) : (
              <GridContainer style={{ marginBottom: '3rem' }}>
                {products.map((product) => (
                  <Product key={product._id} product={product} />
                ))}
              </GridContainer>
            )}

            {/* Pagination */}
            <Pagination currentPage={page} totalPages={pages} onPageChange={setPage} />
          </>
        )}
      </ContentContainer>
    </PageContainer>
  );
}
