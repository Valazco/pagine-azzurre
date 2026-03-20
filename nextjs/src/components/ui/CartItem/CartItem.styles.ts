'use client';

import styled from 'styled-components';
import Link from 'next/link';

export const CartItemContainer = styled.li`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  border: 1px solid #f3f4f6;
`;

export const ImageContainer = styled.div`
  position: relative;
  width: 5rem;
  height: 5rem;
  flex-shrink: 0;
  border-radius: 0.5rem;
  overflow: hidden;
  background-color: #f3f4f6;
`;

export const ProductInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ProductLink = styled(Link)`
  color: #111827;
  font-weight: 500;
  transition: color 0.2s ease;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  &:hover {
    color: #2563eb;
  }
`;

export const PricesContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

export const PriceEuro = styled.span`
  color: #111827;
  font-weight: 600;
`;

export const PriceVal = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #2563eb;
  font-weight: 600;
`;

export const QuantityContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const QuantitySelect = styled.select`
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: white;
  color: #111827;
  cursor: pointer;

  &:focus {
    outline: none;
    ring: 2px solid #3b82f6;
    border-color: transparent;
  }
`;

export const DeleteButton = styled.button`
  padding: 0.5rem;
  color: #9ca3af;
  background: transparent;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: #dc2626;
    background-color: #fef2f2;
  }
`;

export const ScreenReaderOnly = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
`;
