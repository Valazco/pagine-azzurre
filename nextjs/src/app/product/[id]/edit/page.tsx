'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getProduct, updateProduct } from '@/lib/api/products';
import { useUserStore } from '@/lib/store/user';
import LoadingBox from '@/components/ui/LoadingBox';
import MessageBox from '@/components/ui/MessageBox';

export default function ProductEditPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const { userInfo } = useUserStore();

  const [name, setName] = useState('');
  const [priceEuro, setPriceEuro] = useState(0);
  const [priceVal, setPriceVal] = useState(0);
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [section, setSection] = useState<'offro' | 'cerco' | 'propongo' | 'avviso' | 'dono'>('offro');
  const [isService, setIsService] = useState(false);

  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!userInfo?.isAdmin && !userInfo?.isSeller) {
      router.push('/signin');
      return;
    }
    fetchProduct();
  }, [productId, userInfo, router]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const product = await getProduct(productId);
      setName(product.name);
      setPriceEuro(product.priceEuro);
      setPriceVal(product.priceVal);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
      setSection(product.section);
      setIsService(product.isService);
    } catch {
      setError('Errore nel caricamento del prodotto');
    } finally {
      setLoading(false);
    }
  };

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setUpdateLoading(true);
      setError('');
      await updateProduct(productId, {
        name,
        priceEuro,
        priceVal,
        category,
        countInStock,
        description,
        section,
        isService,
      });
      setSuccess(true);
      setTimeout(() => router.push('/productlist'), 1500);
    } catch {
      setError('Errore nell\'aggiornamento del prodotto');
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) return <LoadingBox />;
  if (!userInfo) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Modifica Prodotto</h1>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        {error && <MessageBox variant="danger">{error}</MessageBox>}
        {success && <MessageBox variant="success">Prodotto aggiornato!</MessageBox>}

        <form onSubmit={submitHandler} className="space-y-6 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prezzo Euro *</label>
              <input
                type="number"
                step="0.01"
                required
                value={priceEuro}
                onChange={(e) => setPriceEuro(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prezzo VAL *</label>
              <input
                type="number"
                required
                value={priceVal}
                onChange={(e) => setPriceVal(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
              <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantità *</label>
              <input
                type="number"
                required
                value={countInStock}
                onChange={(e) => setCountInStock(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sezione</label>
              <select
                value={section}
                onChange={(e) => setSection(e.target.value as typeof section)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="offro">Offro</option>
                <option value="cerco">Cerco</option>
                <option value="propongo">Propongo</option>
                <option value="avviso">Avviso</option>
                <option value="dono">Dono</option>
              </select>
            </div>
            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isService}
                  onChange={(e) => setIsService(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded"
                />
                <span className="text-sm font-medium text-gray-700">È un servizio</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrizione *</label>
            <textarea
              rows={5}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={updateLoading}
              className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {updateLoading ? 'Salvataggio...' : 'Salva Modifiche'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/productlist')}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annulla
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
