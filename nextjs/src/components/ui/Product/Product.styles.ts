'use client';

import styled from 'styled-components';
import Link from 'next/link';

export const ProductCard = styled.div`
  width: 100%;
  max-width: 24rem;
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  overflow: hidden;
  border: 1px solid #f3f4f6;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  }
`;

export const ImageLink = styled(Link)`
  display: block;
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  background: linear-gradient(to bottom right, #f9fafb, #f3f4f6);
`;

export const ProductImage = styled.div`
  position: absolute;
  inset: 0;
  transition: transform 0.5s ease;

  ${ProductCard}:hover & {
    transform: scale(1.05);
  }
`;

export const BadgeContainer = styled.div`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
`;

export const ProductBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  color: #374151;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
`;

export const ProductContent = styled.div`
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const TitleLink = styled(Link)`
  display: block;
`;

export const ProductTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 3.5rem;
  transition: color 0.2s ease;

  ${TitleLink}:hover & {
    color: #2563eb;
  }
`;

export const SellerLink = styled(Link)`
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
  transition: color 0.2s ease;

  &:hover {
    color: #2563eb;
  }
`;

export const RatingContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const PricesSection = styled.div`
  padding-top: 0.75rem;
  margin-top: auto;
  border-top: 1px solid #f3f4f6;
`;

export const PricesRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const EuroPriceContainer = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
`;

export const EuroSymbol = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
`;

export const EuroAmount = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
`;

export const ValPriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  background-color: #eff6ff;
  border-radius: 0.5rem;
`;

export const ValSymbol = styled.span`
  font-size: 1rem;
`;

export const ValAmount = styled.span`
  font-size: 1.125rem;
  font-weight: 700;
  color: #2563eb;
`;
