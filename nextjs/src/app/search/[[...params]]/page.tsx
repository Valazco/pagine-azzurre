'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getProducts, getProductCategories, type ProductFilters } from '@/lib/api/products';
import LoadingBox from '@/components/ui/LoadingBox';
import MessageBox from '@/components/ui/MessageBox';
import Product from '@/components/ui/Product';
import Rating from '@/components/ui/Rating';
import Pagination from '@/components/ui/Pagination';
import { prices, ratings } from '@/lib/utils/constants';
import type { Product as ProductType } from '@/types';

export default function SearchPage() {
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
    <div className="container mx-auto px-4 py-8">
      {/* Header with results count and sort */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="text-gray-600">
          {loading ? (
            'Caricamento...'
          ) : error ? (
            ''
          ) : (
            <span className="font-medium">{products.length} risultati</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm text-gray-600">
            Ordina per
          </label>
          <select
            id="sort"
            value={order}
            onChange={(e) => router.push(buildFilterUrl({ order: e.target.value, page: 1 }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Più recenti</option>
            <option value="lowest">Prezzo: dal più basso</option>
            <option value="highest">Prezzo: dal più alto</option>
            <option value="toprated">Migliori recensioni</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6 sticky top-4">
            {/* Categories */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Categorie</h3>
              {categoriesLoading ? (
                <LoadingBox />
              ) : (
                <ul className="space-y-2">
                  <li>
                    <Link
                      href={buildFilterUrl({ category: '', page: 1 })}
                      className={`block px-3 py-2 rounded-lg transition-colors ${
                        !category
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      Tutte le categorie
                    </Link>
                  </li>
                  {categories.map((c) => (
                    <li key={c}>
                      <Link
                        href={buildFilterUrl({ category: c, page: 1 })}
                        className={`block px-3 py-2 rounded-lg transition-colors ${
                          c === category
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {c.charAt(0).toUpperCase() + c.slice(1).toLowerCase()}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Price Range */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Prezzo</h3>
              <ul className="space-y-2">
                {prices.map((p) => (
                  <li key={p.name}>
                    <Link
                      href={buildFilterUrl({ min: p.min, max: p.max, page: 1 })}
                      className={`block px-3 py-2 rounded-lg transition-colors ${
                        `${p.min}-${p.max}` === `${min}-${max}`
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {p.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Rating Filter */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Valutazione</h3>
              <ul className="space-y-2">
                {ratings.map((r) => (
                  <li key={r.rating}>
                    <Link
                      href={buildFilterUrl({ rating: r.rating, page: 1 })}
                      className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                        r.rating === ratingFilter
                          ? 'bg-blue-50'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <Rating rating={r.rating} caption=" & +" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="flex-1">
          {loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : products.length === 0 ? (
            <MessageBox variant="info">Nessun prodotto trovato</MessageBox>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map(
                  (product) =>
                    product && <Product key={product._id} product={product} />
                )}
              </div>

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
        </main>
      </div>
    </div>
  );
}
