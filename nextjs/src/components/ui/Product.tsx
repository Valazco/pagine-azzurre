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
    <div className="group w-full max-w-sm bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Image Container */}
      <Link
        href={`/product/${product._id}`}
        className="block relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100"
      >
        <Image
          src={imgSrc}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          onError={() => setImgError(true)}
          loading="lazy"
        />

        {/* Product Type Badge - Floating */}
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-sm text-gray-700 shadow-md">
            {getProductType()}
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3">
        {/* Product Name */}
        <Link
          href={`/product/${product._id}`}
          className="block group/title"
        >
          <h2 className="text-lg font-semibold text-gray-900 leading-snug line-clamp-2 min-h-[3.5rem] group-hover/title:text-blue-600 transition-colors">
            {product.name}
          </h2>
        </Link>

        {/* Seller */}
        <Link
          href={`/product/${product._id}`}
          className="text-sm text-gray-600 hover:text-blue-600 transition-colors font-medium"
        >
          {product.seller?.seller?.name || 'Venditore'}
        </Link>

        {/* Rating */}
        <div className="flex items-center">
          <Rating
            rating={product.rating || 0}
            numReviews={product.numReviews || 0}
          />
        </div>

        {/* Prices */}
        {showPrices && (
          <div className="pt-3 mt-auto border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-1">
                <span className="text-sm text-gray-500 font-medium">€</span>
                <span className="text-2xl font-bold text-gray-900">
                  {product.priceEuro?.toFixed(2) || '0.00'}
                </span>
              </div>
              <div className="flex items-center gap-1 px-3 py-1 bg-blue-50 rounded-lg">
                <span className="text-base">☯</span>
                <span className="text-lg font-bold text-blue-600">
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
