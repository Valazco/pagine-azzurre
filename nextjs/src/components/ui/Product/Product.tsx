'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Rating } from '../Rating';
import type { Product as ProductType } from '@/types';
import {
  ProductCard,
  ImageLink,
  ProductImage,
  BadgeContainer,
  ProductBadge,
  ProductContent,
  TitleLink,
  ProductTitle,
  SellerLink,
  RatingContainer,
  PricesSection,
  PricesRow,
  EuroPriceContainer,
  EuroSymbol,
  EuroAmount,
  ValPriceContainer,
  ValSymbol,
  ValAmount,
} from './Product.styles';

interface ProductProps {
  product: ProductType;
}

export function Product({ product }: ProductProps) {
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
    <ProductCard>
      {/* Image Container */}
      <ImageLink href={`/product/${product._id}`}>
        <ProductImage>
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
            onError={() => setImgError(true)}
            loading="lazy"
          />
        </ProductImage>

        {/* Product Type Badge - Floating */}
        <BadgeContainer>
          <ProductBadge>{getProductType()}</ProductBadge>
        </BadgeContainer>
      </ImageLink>

      {/* Content */}
      <ProductContent>
        {/* Product Name */}
        <TitleLink href={`/product/${product._id}`}>
          <ProductTitle>{product.name}</ProductTitle>
        </TitleLink>

        {/* Seller */}
        <SellerLink href={`/product/${product._id}`}>
          {product.seller?.seller?.name || 'Venditore'}
        </SellerLink>

        {/* Rating */}
        <RatingContainer>
          <Rating
            rating={product.rating || 0}
            numReviews={product.numReviews || 0}
          />
        </RatingContainer>

        {/* Prices */}
        {showPrices && (
          <PricesSection>
            <PricesRow>
              <EuroPriceContainer>
                <EuroSymbol>€</EuroSymbol>
                <EuroAmount>
                  {product.priceEuro?.toFixed(2) || '0.00'}
                </EuroAmount>
              </EuroPriceContainer>
              <ValPriceContainer>
                <ValSymbol>☯</ValSymbol>
                <ValAmount>{product.priceVal || 0}</ValAmount>
              </ValPriceContainer>
            </PricesRow>
          </PricesSection>
        )}
      </ProductContent>
    </ProductCard>
  );
}

export default Product;
