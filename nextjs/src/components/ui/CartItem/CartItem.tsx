'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';
import type { CartItem as CartItemType } from '@/types';
import {
  CartItemContainer,
  ImageContainer,
  ProductInfo,
  ProductLink,
  PricesContainer,
  PriceEuro,
  PriceVal,
  QuantityContainer,
  QuantitySelect,
  DeleteButton,
  ScreenReaderOnly,
} from './CartItem.styles';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
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
    <CartItemContainer>
      {/* Product Image */}
      <ImageContainer>
        <Image
          src={imgSrc}
          alt={item.name}
          fill
          sizes="80px"
          style={{ objectFit: 'cover' }}
          onError={() => setImgError(true)}
        />
      </ImageContainer>

      {/* Product Info */}
      <ProductInfo>
        <ProductLink href={`/product/${item.product}`}>
          {item.name}
        </ProductLink>

        {/* Prices */}
        <PricesContainer>
          <PriceEuro>€ {item.price.toFixed(2)}</PriceEuro>
          <PriceVal>
            <span>☯</span>
            {item.priceVal}
          </PriceVal>
        </PricesContainer>
      </ProductInfo>

      {/* Quantity Selector */}
      <QuantityContainer>
        <ScreenReaderOnly as="label" htmlFor={`qty-${item.product}`}>
          Quantità
        </ScreenReaderOnly>
        <QuantitySelect
          id={`qty-${item.product}`}
          value={item.qty}
          onChange={handleQuantityChange}
        >
          {[...Array(item.countInStock).keys()].map((x) => (
            <option key={x + 1} value={x + 1}>
              {x + 1}
            </option>
          ))}
        </QuantitySelect>
      </QuantityContainer>

      {/* Delete Button */}
      <DeleteButton
        type="button"
        onClick={handleRemove}
        aria-label={`Rimuovi ${item.name} dal carrello`}
      >
        <Trash2 size={20} />
      </DeleteButton>
    </CartItemContainer>
  );
}

export default CartItem;
