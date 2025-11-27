'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getProduct, createProductReview } from '@/lib/api/products';
import { useUserStore } from '@/lib/store/user';
import { useCartStore } from '@/lib/store/cart';
import LoadingBox from '@/components/ui/LoadingBox';
import MessageBox from '@/components/ui/MessageBox';
import Rating from '@/components/ui/Rating';
import type { Product } from '@/types';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);

  // Review state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const { userInfo } = useUserStore();
  const { addToCart } = useCartStore();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await getProduct(productId);
      setProduct(data);
    } catch {
      setError('Errore nel caricamento del prodotto');
    } finally {
      setLoading(false);
    }
  };

  const addToCartHandler = () => {
    if (!product) return;
    addToCart({
      product: product._id,
      name: product.name,
      image: product.image[0] || '/img-not-found.png',
      price: product.priceEuro,
      priceVal: product.priceVal,
      countInStock: product.countInStock,
      qty,
      seller: product.seller._id,
    });
    router.push('/cart');
  };

  const submitReviewHandler = async (e: FormEvent) => {
    e.preventDefault();
    if (!rating || !comment) {
      alert('Per favore lascia la tua valutazione e un commento');
      return;
    }

    try {
      setReviewLoading(true);
      setReviewError('');
      await createProductReview(productId, { rating, comment });
      alert('Recensione pubblicata con successo!');
      setRating(0);
      setComment('');
      fetchProduct();
    } catch {
      setReviewError('Errore nella pubblicazione della recensione');
    } finally {
      setReviewLoading(false);
    }
  };

  const showPrices =
    product &&
    product.section !== 'avviso' &&
    product.section !== 'propongo' &&
    product.section !== 'dono';

  if (loading) return <LoadingBox />;
  if (error) return <MessageBox variant="danger">{error}</MessageBox>;
  if (!product) return <MessageBox variant="danger">Prodotto non trovato</MessageBox>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Image Gallery */}
        <div className="lg:col-span-1">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-4">
            <Image
              src={product.image[currentImage] || '/img-not-found.png'}
              alt={product.name}
              fill
              className="object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/img-not-found.png';
              }}
            />
          </div>
          {product.image.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.image.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImage(idx)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                    currentImage === idx ? 'border-blue-600' : 'border-transparent'
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="lg:col-span-1 space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <Rating rating={product.rating} numReviews={product.numReviews} />

          {showPrices && (
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-gray-900">
                € {product.priceEuro.toFixed(2)}
              </span>
              <span className="flex items-center gap-1 text-xl text-blue-600 font-semibold">
                <span>☯</span> {product.priceVal}
              </span>
            </div>
          )}

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Descrizione</h3>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>
        </div>

        {/* Purchase Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-4 sticky top-4">
            {/* Seller Info */}
            <div className="border-b border-gray-100 pb-4">
              <p className="text-sm text-gray-500">Offerente</p>
              <Link
                href={`/seller/${product.seller._id}`}
                className="text-lg font-semibold text-blue-600 hover:text-blue-700"
              >
                {product.seller.seller?.name || 'Venditore'}
              </Link>
              {product.seller.seller && (
                <Rating
                  rating={product.seller.seller.rating}
                  numReviews={product.seller.seller.numReviews}
                />
              )}
            </div>

            {/* Price */}
            {showPrices && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Prezzo</span>
                <div className="text-right">
                  <span className="text-2xl font-bold">€ {product.priceEuro.toFixed(2)}</span>
                  <span className="block text-blue-600">☯ {product.priceVal}</span>
                </div>
              </div>
            )}

            {/* Availability */}
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Disponibilità</span>
              {product.countInStock > 0 ? (
                <span className="text-green-600 font-medium">Disponibile</span>
              ) : (
                <span className="text-red-600 font-medium">Non disponibile</span>
              )}
            </div>

            {/* Quantity & Add to Cart */}
            {product.countInStock > 0 && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Quantità</span>
                  <select
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[...Array(product.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={addToCartHandler}
                  className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Contatta Offerente
                </button>

                {userInfo && !userInfo.hasAd && (
                  <MessageBox variant="warning">
                    Per contattare un offerente devi prima mettere un prodotto in vetrina.{' '}
                    <Link href="/productlist/seller" className="underline font-medium">
                      Crea l&apos;annuncio adesso
                    </Link>
                  </MessageBox>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recensioni</h2>

        {product.reviews?.length === 0 && (
          <MessageBox variant="info">Non ci sono ancora recensioni</MessageBox>
        )}

        <div className="space-y-6">
          {product.reviews?.map((review) => (
            <div key={review._id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">{review.name}</span>
                <span className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString('it-IT')}
                </span>
              </div>
              <Rating rating={review.rating} />
              <p className="mt-2 text-gray-600">{review.comment}</p>
            </div>
          ))}

          {/* Review Form */}
          <div className="bg-gray-50 rounded-xl p-6">
            {userInfo ? (
              <form onSubmit={submitReviewHandler} className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Scrivi una recensione
                </h3>

                <div>
                  <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
                    Valutazione
                  </label>
                  <select
                    id="rating"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={0}>Seleziona...</option>
                    <option value={1}>1 - Scarso</option>
                    <option value={2}>2 - Discreto</option>
                    <option value={3}>3 - Buono</option>
                    <option value={4}>4 - Molto Buono</option>
                    <option value={5}>5 - Eccellente</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                    Commento
                  </label>
                  <textarea
                    id="comment"
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Scrivi la tua recensione..."
                  />
                </div>

                {reviewError && <MessageBox variant="danger">{reviewError}</MessageBox>}

                <button
                  type="submit"
                  disabled={reviewLoading}
                  className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {reviewLoading ? 'Pubblicazione...' : 'Pubblica Recensione'}
                </button>
              </form>
            ) : (
              <MessageBox variant="info">
                <Link href="/signin" className="text-blue-600 hover:underline font-medium">
                  Accedi
                </Link>{' '}
                per scrivere una recensione
              </MessageBox>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
