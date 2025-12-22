'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styled from 'styled-components';
import { getProducts, getProductCategories, type ProductFilters } from '@/lib/api/products';
import LoadingBox from '@/components/ui/LoadingBox';
import MessageBox from '@/components/ui/MessageBox';
import Product from '@/components/ui/Product';
import Rating from '@/components/ui/Rating';
import Pagination from '@/components/ui/Pagination';
import { prices, ratings } from '@/lib/utils/constants';
import {
  Container,
  CardBase,
  StickyCard,
  Select,
  GridContainer,
  LoadingContainer,
  ErrorContainer,
  EmptyContainer
} from '@/lib/styles';
import type { Product as ProductType } from '@/types';

// Styled Components
const SearchHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const ResultsCount = styled.div`
  color: #6b7280;
  font-weight: 500;
`;

const SortContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SortLabel = styled.label`
  font-size: 0.875rem;
  color: #6b7280;
`;

const SearchLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (min-width: 1024px) {
    flex-direction: row;
  }
`;

const Sidebar = styled.aside`
  flex-shrink: 0;

  @media (min-width: 1024px) {
    width: 16rem;
  }
`;

const SidebarCard = styled(StickyCard)`
  padding: 1.5rem;
`;

const FilterSection = styled.div`
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const FilterTitle = styled.h3`
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.75rem;
`;

const FilterList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FilterItem = styled.li`
  margin-bottom: 0.5rem;
`;

const FilterLink = styled(Link)<{ $active?: boolean }>`
  display: block;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
  font-weight: ${({ $active }) => ($active ? '500' : '400')};
  background-color: ${({ $active }) => ($active ? '#eff6ff' : 'transparent')};
  color: ${({ $active }) => ($active ? '#2563eb' : '#6b7280')};

  &:hover {
    background-color: #f9fafb;
  }
`;

const MainContent = styled.main`
  flex: 1;
`;

const ProductsGrid = styled(GridContainer)`
  @media (min-width: 1280px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

function SearchContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse params from URL
  const paramsArray = (params.params as string[]) || [];
  const getParamValue = (key: string): string => {
    const index = paramsArray.indexOf(key);
    return index !== -1 && paramsArray[index + 1] ? paramsArray[index + 1] : '';
  };

  const name = getParamValue('name') || searchParams.get('name') || '';
  const category = getParamValue('category') || '';
  const min = Number(getParamValue('min')) || 0;
  const max = Number(getParamValue('max')) || 0;
  const ratingFilter = Number(getParamValue('rating')) || 0;
  const order = (getParamValue('order') || 'newest') as ProductFilters['order'];
  const pageNumber = Number(getParamValue('pageNumber')) || 1;

  // State
  const [products, setProducts] = useState<ProductType[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [categories, setCategories] = useState<string[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [name, category, min, max, ratingFilter, order, pageNumber]);

  const fetchCategories = async () => {
    try {
      const data = await getProductCategories();
      setCategories(data);
    } catch {
      console.error('Error fetching categories');
    } finally {
      setCategoriesLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts({
        name: name || undefined,
        category: category || undefined,
        min: min || undefined,
        max: max || undefined,
        rating: ratingFilter || undefined,
        order,
        pageNumber,
      });
      setProducts(data.products);
      setPage(data.page);
      setPages(data.pages);
    } catch {
      setError('Errore nel caricamento dei prodotti');
    } finally {
      setLoading(false);
    }
  };

  const buildFilterUrl = (filter: Partial<{
    name: string;
    category: string;
    min: number;
    max: number;
    rating: number;
    order: string;
    page: number;
  }>) => {
    const newName = filter.name ?? name;
    const newCategory = filter.category ?? category;
    const newMin = filter.min ?? min;
    const newMax = filter.max ?? max;
    const newRating = filter.rating ?? ratingFilter;
    const newOrder = filter.order ?? order;
    const newPage = filter.page ?? pageNumber;

    let url = '/search';
    if (newCategory) url += `/category/${encodeURIComponent(newCategory)}`;
    if (newName) url += `/name/${encodeURIComponent(newName)}`;
    if (newMin || newMax) url += `/min/${newMin}/max/${newMax}`;
    if (newRating) url += `/rating/${newRating}`;
    url += `/order/${newOrder}`;
    url += `/pageNumber/${newPage}`;

    return url;
  };

  return (
    <Container style={{ padding: '2rem 1rem' }}>
      {/* Header with results count and sort */}
      <SearchHeader>
        <ResultsCount>
          {loading ? (
            'Caricamento...'
          ) : error ? (
            ''
          ) : (
            <span>{products.length} risultati</span>
          )}
        </ResultsCount>

        <SortContainer>
          <SortLabel htmlFor="sort">Ordina per</SortLabel>
          <Select
            id="sort"
            value={order}
            onChange={(e) => router.push(buildFilterUrl({ order: e.target.value, page: 1 }))}
          >
            <option value="newest">Più recenti</option>
            <option value="lowest">Prezzo: dal più basso</option>
            <option value="highest">Prezzo: dal più alto</option>
            <option value="toprated">Migliori recensioni</option>
          </Select>
        </SortContainer>
      </SearchHeader>

      <SearchLayout>
        {/* Filters Sidebar */}
        <Sidebar>
          <SidebarCard>
            {/* Categories */}
            <FilterSection>
              <FilterTitle>Categorie</FilterTitle>
              {categoriesLoading ? (
                <LoadingBox />
              ) : (
                <FilterList>
                  <FilterItem>
                    <FilterLink
                      href={buildFilterUrl({ category: '', page: 1 })}
                      $active={!category}
                    >
                      Tutte le categorie
                    </FilterLink>
                  </FilterItem>
                  {categories.map((c) => (
                    <FilterItem key={c}>
                      <FilterLink
                        href={buildFilterUrl({ category: c, page: 1 })}
                        $active={c === category}
                      >
                        {c.charAt(0).toUpperCase() + c.slice(1).toLowerCase()}
                      </FilterLink>
                    </FilterItem>
                  ))}
                </FilterList>
              )}
            </FilterSection>

            {/* Price Range */}
            <FilterSection>
              <FilterTitle>Prezzo</FilterTitle>
              <FilterList>
                {prices.map((p) => (
                  <FilterItem key={p.name}>
                    <FilterLink
                      href={buildFilterUrl({ min: p.min, max: p.max, page: 1 })}
                      $active={`${p.min}-${p.max}` === `${min}-${max}`}
                    >
                      {p.name}
                    </FilterLink>
                  </FilterItem>
                ))}
              </FilterList>
            </FilterSection>

            {/* Rating Filter */}
            <FilterSection>
              <FilterTitle>Valutazione</FilterTitle>
              <FilterList>
                {ratings.map((r) => (
                  <FilterItem key={r.rating}>
                    <FilterLink
                      href={buildFilterUrl({ rating: r.rating, page: 1 })}
                      $active={r.rating === ratingFilter}
                    >
                      <Rating rating={r.rating} caption=" & +" />
                    </FilterLink>
                  </FilterItem>
                ))}
              </FilterList>
            </FilterSection>
          </SidebarCard>
        </Sidebar>

        {/* Products Grid */}
        <MainContent>
          {loading ? (
            <LoadingContainer>
              <LoadingBox />
            </LoadingContainer>
          ) : error ? (
            <ErrorContainer>
              <MessageBox variant="danger">{error}</MessageBox>
            </ErrorContainer>
          ) : products.length === 0 ? (
            <EmptyContainer>
              <MessageBox variant="info">Nessun prodotto trovato</MessageBox>
            </EmptyContainer>
          ) : (
            <>
              <ProductsGrid>
                {products.map(
                  (product) =>
                    product && <Product key={product._id} product={product} />
                )}
              </ProductsGrid>

              {/* Pagination */}
              {pages > 1 && (
                <Pagination
                  currentPage={page}
                  totalPages={pages}
                  basePath={buildFilterUrl({}).replace(/\/pageNumber\/\d+$/, '/pageNumber')}
                />
              )}
            </>
          )}
        </MainContent>
      </SearchLayout>
    </Container>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<Container><LoadingBox /></Container>}>
      <SearchContent />
    </Suspense>
  );
}
