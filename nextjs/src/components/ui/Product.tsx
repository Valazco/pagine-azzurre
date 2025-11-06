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
    <div className="w-[280px] h-[768px] flex flex-col gap-4 overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0px_2px_4px_rgba(192,192,192,0.5)]">
      {/* Image Container */}
      <Link
        href={`/product/${product._id}`}
        className="block"
      >
        <Image
          src={imgSrc}
          alt={product.name}
          width={280}
          height={280}
          className="w-[280px] h-[280px] object-cover block"
          onError={() => setImgError(true)}
          loading="lazy"
        />
      </Link>

      {/* Content */}
      <div className="flex flex-col h-full gap-4">
        {/* Product Type Badge */}
        <div className="text-center">
          <span className="text-base">
            {getProductType()}
          </span>
        </div>

        {/* Card Body */}
        <div className="flex flex-col justify-between h-full px-4 pb-4">
          {/* Product Name */}
          <Link
            href={`/product/${product._id}`}
            className="block"
          >
            <h2 className="text-[1.6rem] leading-tight p-0 break-words hover:text-[#ff8000] transition-colors">
              {product.name}
            </h2>
          </Link>

          {/* Details Section */}
          <div className="flex flex-col gap-2">
            {/* Seller */}
            <div>
              <Link
                href={`/product/${product._id}`}
                className="hover:text-[#ff8000] transition-colors"
              >
                {product.seller?.seller?.name || 'Venditore'}
              </Link>
            </div>

            {/* Rating */}
            <div>
              <Rating
                rating={product.rating || 0}
                numReviews={product.numReviews || 0}
              />
            </div>

            {/* Prices */}
            {showPrices && (
              <div className="mx-auto text-[1.6rem] flex items-center">
                <div className="flex items-center">
                  <span>€ {product.priceEuro?.toFixed(2) || '0.00'}</span>
                  <span className="mx-2">e</span>
                </div>
                <div className="flex items-center ml-2">
                  <span>☯ {product.priceVal || 0}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
