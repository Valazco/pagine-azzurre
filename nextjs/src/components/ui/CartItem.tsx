'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';
import type { CartItem as CartItemType } from '@/types';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateCartItemQty, removeFromCart } = useCartStore();
  const [imgError, setImgError] = useState(false);

  const imgSrc = imgError || !item.image
    ? '/img-not-found.png'
    : item.image;

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateCartItemQty(item.product, Number(e.target.value));
  };

  const handleRemove = () => {
    removeFromCart(item.product);
  };

  return (
    <li className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
      {/* Product Image */}
      <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
        <Image
          src={imgSrc}
          alt={item.name}
          fill
          sizes="80px"
          className="object-cover"
          onError={() => setImgError(true)}
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/product/${item.product}`}
          className="text-gray-900 font-medium hover:text-blue-600 transition-colors line-clamp-2"
        >
          {item.name}
        </Link>

        {/* Prices */}
        <div className="flex items-center gap-3 mt-2">
          <span className="text-gray-900 font-semibold">
            € {item.price.toFixed(2)}
          </span>
          <span className="flex items-center gap-1 text-blue-600 font-semibold">
            <span>☯</span>
            {item.priceVal}
          </span>
        </div>
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center gap-2">
        <label htmlFor={`qty-${item.product}`} className="sr-only">
          Quantità
        </label>
        <select
          id={`qty-${item.product}`}
          value={item.qty}
          onChange={handleQuantityChange}
          className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {[...Array(item.countInStock).keys()].map((x) => (
            <option key={x + 1} value={x + 1}>
              {x + 1}
            </option>
          ))}
        </select>
      </div>

      {/* Delete Button */}
      <button
        type="button"
        onClick={handleRemove}
        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        aria-label={`Rimuovi ${item.name} dal carrello`}
      >
        <Trash2 size={20} />
      </button>
    </li>
  );
}
