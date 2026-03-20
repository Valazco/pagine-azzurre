'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import styled from 'styled-components';
import { getUserProfile } from '@/lib/api/users';
import { getProducts } from '@/lib/api/products';
import LoadingBox from '@/components/ui/LoadingBox';
import MessageBox from '@/components/ui/MessageBox';
import Product from '@/components/ui/Product';
import Rating from '@/components/ui/Rating';
import {
  Container,
  SectionTitle,
  CardBase,
  GridContainer,
  LoadingContainer,
  ErrorContainer,
  EmptyContainer
} from '@/lib/styles';
import type { User, Product as ProductType } from '@/types';

// Styled Components
const SellerCard = styled(CardBase)`
  padding: 2rem;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  margin-bottom: 2rem;
`;

const SellerInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: flex-start;
  }
`;

const SellerLogo = styled.img`
  width: 8rem;
  height: 8rem;
  border-radius: 0.75rem;
  object-fit: cover;
`;

const SellerDetails = styled.div`
  flex: 1;
`;

const SellerName = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
`;

const SellerDescription = styled.p`
  color: #6b7280;
  margin-top: 1rem;
`;

const ProductsGrid = styled(GridContainer)`
  @media (min-width: 1280px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export default function SellerPage() {
  const params = useParams();
  const sellerId = params.id as string;

  const [seller, setSeller] = useState<User | null>(null);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSellerData();
  }, [sellerId]);

  const fetchSellerData = async () => {
    try {
      setLoading(true);
      const [sellerData, productsData] = await Promise.all([
        getUserProfile(sellerId),
        getProducts({ pageSize: 100 }),
      ]);
      setSeller(sellerData);
      // Filter products by seller
      const sellerProducts = productsData.products.filter(
        (p) => p.seller._id === sellerId
      );
      setProducts(sellerProducts);
    } catch {
      setError('Errore nel caricamento del venditore');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingContainer><LoadingBox /></LoadingContainer>;
  if (error) return <ErrorContainer><MessageBox variant="danger">{error}</MessageBox></ErrorContainer>;
  if (!seller) return <ErrorContainer><MessageBox variant="danger">Venditore non trovato</MessageBox></ErrorContainer>;

  return (
    <Container style={{ padding: '2rem 1rem' }}>
      {/* Seller Info */}
      <SellerCard>
        <SellerInfo>
          {seller.seller?.logo && (
            <SellerLogo
              src={seller.seller.logo}
              alt={seller.seller.name}
            />
          )}
          <SellerDetails>
            <SellerName>
              {seller.seller?.name || seller.username}
            </SellerName>
            {seller.seller && (
              <div style={{ marginBottom: '1rem' }}>
                <Rating rating={seller.seller.rating} numReviews={seller.seller.numReviews} />
              </div>
            )}
            {seller.seller?.description && (
              <SellerDescription>{seller.seller.description}</SellerDescription>
            )}
          </SellerDetails>
        </SellerInfo>
      </SellerCard>

      {/* Seller Products */}
      <SectionTitle>Prodotti del Venditore</SectionTitle>

      {products.length === 0 ? (
        <EmptyContainer>
          <MessageBox variant="info">Questo venditore non ha ancora prodotti</MessageBox>
        </EmptyContainer>
      ) : (
        <ProductsGrid>
          {products.map((product) => (
            <Product key={product._id} product={product} />
          ))}
        </ProductsGrid>
      )}
    </Container>
  );
}
