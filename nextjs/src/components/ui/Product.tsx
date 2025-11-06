'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import Rating from './Rating';
import type { Product as ProductType } from '@/types';

interface ProductProps {
  product: ProductType;
}

export default function Product({ product }: ProductProps) {
  const [imgError, setImgError] = useState(false);
  const imgSrc = imgError || !product.image?.[0]
    ? '/img-not-found.png'
    : product.image[0];

  const getProductType = () => {
    if (product.section === 'avviso' || product.section === 'propongo') {
      return 'Avviso/Proposta';
    }
    return product.isService ? 'Servizio' : 'Prodotto';
  };

  const showPrices =
    product.section !== 'propongo' &&
    product.section !== 'avviso' &&
    product.section !== 'dono';

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col">
      {/* Image */}
      <Link
        href={`/product/${product._id}`}
        className="relative aspect-square overflow-hidden bg-gray-100"
      >
        <Image
          src={imgSrc}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover hover:scale-105 transition-transform duration-300"
          onError={() => setImgError(true)}
          loading="lazy"
        />
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Product Type Badge */}
        <div className="text-center mb-3">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
            {getProductType()}
          </span>
        </div>

        {/* Product Name */}
        <Link
          href={`/product/${product._id}`}
          className="block mb-2"
        >
          <h2 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 min-h-[3.5rem]">
            {product.name}
          </h2>
        </Link>

        {/* Seller */}
        <div className="mb-2">
          <Link
            href={`/product/${product._id}`}
            className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
          >
            {product.seller?.seller?.name || 'Venditore'}
          </Link>
        </div>

        {/* Rating */}
        <div className="mb-3">
          <Rating
            rating={product.rating || 0}
            numReviews={product.numReviews || 0}
          />
        </div>

        {/* Prices */}
        {showPrices && (
          <div className="mt-auto pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-gray-600">€</span>
                <span className="text-xl font-bold text-gray-900">
                  {product.priceEuro?.toFixed(2) || '0.00'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-lg">☯</span>
                <span className="text-xl font-bold text-blue-600">
                  {product.priceVal || 0}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
