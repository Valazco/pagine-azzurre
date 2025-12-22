'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getTopSellers } from '@/lib/api/users';
import LoadingBox from '@/components/ui/LoadingBox';
import MessageBox from '@/components/ui/MessageBox';
import Rating from '@/components/ui/Rating';
import type { User } from '@/types';
import styled from 'styled-components';
import { Container, PageTitle, GridContainer } from '@/lib/styles';

const SellerCard = styled(Link)`
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  border: 1px solid #f3f4f6;
  padding: 1.5rem;
  text-decoration: none;
  display: block;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  }
`;

const SellerHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const SellerAvatar = styled.img`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  object-fit: cover;
`;

const AvatarPlaceholder = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background-color: #dbeafe;
  display: flex;
  align-items: center;
  justify-content: center;

  span {
    font-size: 1.5rem;
    color: #2563eb;
  }
`;

const SellerInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const SellerName = styled.h3`
  font-weight: 600;
  color: #111827;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const SellerDescription = styled.p`
  margin-top: 1rem;
  font-size: 0.875rem;
  color: #4b5563;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export default function TopSellersPage() {
  const [sellers, setSellers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const data = await getTopSellers();
      setSellers(data);
    } catch {
      setError('Errore nel caricamento dei venditori');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <PageTitle>Top Venditori</PageTitle>

      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : sellers.length === 0 ? (
        <MessageBox variant="info">Nessun venditore trovato</MessageBox>
      ) : (
        <GridContainer>
          {sellers.map((seller) => (
            <SellerCard
              key={seller._id}
              href={`/seller/${seller._id}`}
            >
              <SellerHeader>
                {seller.seller?.logo ? (
                  <SellerAvatar
                    src={seller.seller.logo}
                    alt={seller.seller.name}
                  />
                ) : (
                  <AvatarPlaceholder>
                    <span>
                      {(seller.seller?.name || seller.username || 'V')[0]}
                    </span>
                  </AvatarPlaceholder>
                )}
                <SellerInfo>
                  <SellerName>
                    {seller.seller?.name || seller.username}
                  </SellerName>
                  {seller.seller && (
                    <Rating
                      rating={seller.seller.rating}
                      numReviews={seller.seller.numReviews}
                    />
                  )}
                </SellerInfo>
              </SellerHeader>
              {seller.seller?.description && (
                <SellerDescription>
                  {seller.seller.description}
                </SellerDescription>
              )}
            </SellerCard>
          ))}
        </GridContainer>
      )}
    </Container>
  );
}
