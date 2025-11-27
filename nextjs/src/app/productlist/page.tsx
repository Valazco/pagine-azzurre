'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getProducts, deleteProduct, createProduct } from '@/lib/api/products';
import { useUserStore } from '@/lib/store/user';
import LoadingBox from '@/components/ui/LoadingBox';
import MessageBox from '@/components/ui/MessageBox';
import Pagination from '@/components/ui/Pagination';
import type { Product } from '@/types';

export default function ProductListPage() {
  const router = useRouter();
  const { userInfo } = useUserStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!userInfo?.isAdmin && !userInfo?.isSeller) {
      router.push('/signin');
      return;
    }
    fetchProducts();
  }, [userInfo, router, page]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts({ pageNumber: page });
      setProducts(data.products);
      setPages(data.pages);
    } catch {
      setError('Errore nel caricamento dei prodotti');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      setActionLoading(true);
      const product = await createProduct();
      router.push(`/product/${product._id}/edit`);
    } catch {
      alert('Errore nella creazione del prodotto');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo prodotto?')) return;
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch {
      alert('Errore nell\'eliminazione del prodotto');
    }
  };

  if (!userInfo) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestione Prodotti</h1>
        <button
          onClick={handleCreate}
          disabled={actionLoading}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {actionLoading ? 'Creazione...' : 'Nuovo Prodotto'}
        </button>
      </div>

      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : products.length === 0 ? (
        <MessageBox variant="info">Nessun prodotto trovato</MessageBox>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Immagine</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nome</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Prezzo</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Categoria</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Stock</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Azioni</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={product.image?.[0] || '/img-not-found.png'}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="text-gray-900">€{product.priceEuro}</span>
                        <span className="text-blue-600 ml-2">☯{product.priceVal}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={product.countInStock > 0 ? 'text-green-600' : 'text-red-600'}>
                          {product.countInStock}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Link
                            href={`/product/${product._id}/edit`}
                            className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                          >
                            Modifica
                          </Link>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                          >
                            Elimina
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {pages > 1 && (
            <Pagination currentPage={page} totalPages={pages} basePath="/productlist/page" />
          )}
        </>
      )}
    </div>
  );
}
