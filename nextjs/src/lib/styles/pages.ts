'use client';

import styled, { css } from 'styled-components';
import Link from 'next/link';

// ============================================
// LAYOUT CONTAINERS
// ============================================

export const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom, #f9fafb, white);
`;

export const ContentContainer = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  padding: 2rem 1rem;

  @media (min-width: 640px) {
    padding: 2rem 1.5rem;
  }

  @media (min-width: 1024px) {
    padding: 2rem 2rem;
  }
`;

export const Container = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  padding: 1rem;
`;

// ============================================
// GRID LAYOUTS
// ============================================

export const GridContainer = styled.div<{ $cols?: number }>`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(${({ $cols }) => $cols || 3}, 1fr);
  }

  @media (min-width: 1280px) {
    grid-template-columns: repeat(${({ $cols }) => ($cols ? $cols + 1 : 4)}, 1fr);
  }
`;

export const TwoColumnGrid = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: 1fr;

  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr;
  }
`;

export const ThreeColumnGrid = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: 1fr;

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

// ============================================
// TYPOGRAPHY
// ============================================

export const PageTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 2rem;

  @media (min-width: 768px) {
    font-size: 2.25rem;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1.5rem;
`;

export const PageSubtitle = styled.p`
  font-size: 1.125rem;
  color: #6b7280;
`;

export const TextCenter = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

// ============================================
// CARDS
// ============================================

export const CardBase = styled.div`
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  border: 1px solid #f3f4f6;
  padding: 1.5rem;
`;

export const StickyCard = styled(CardBase)`
  position: sticky;
  top: 1rem;
`;

// ============================================
// BUTTONS
// ============================================

const buttonBase = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const PrimaryButton = styled.button`
  ${buttonBase}
  background-color: #2563eb;
  color: white;
  width: 100%;

  &:hover:not(:disabled) {
    background-color: #1d4ed8;
  }
`;

export const SecondaryButton = styled.button`
  ${buttonBase}
  background-color: white;
  color: #374151;
  border: 2px solid #e5e7eb;

  &:hover:not(:disabled) {
    border-color: #3b82f6;
    color: #2563eb;
  }
`;

export const FilterButton = styled.button<{ $isActive?: boolean }>`
  padding: 0.625rem 1.5rem;
  border-radius: 9999px;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;

  ${({ $isActive }) =>
    $isActive
      ? css`
          background-color: #2563eb;
          color: white;
          box-shadow: 0 10px 15px -3px rgb(59 130 246 / 0.3);
          transform: scale(1.05);
        `
      : css`
          background-color: white;
          color: #374151;
          border: 2px solid #e5e7eb;

          &:hover {
            border-color: #93c5fd;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          }
        `}
`;

// ============================================
// FORMS
// ============================================

export const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

export const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  background-color: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
  }
`;

export const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  min-height: 6rem;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
  }
`;

// ============================================
// LISTS
// ============================================

export const ItemList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  list-style: none;
  padding: 0;
  margin: 0;
`;

// ============================================
// UTILITY
// ============================================

export const FlexBetween = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const FlexCenter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const FlexWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
  margin-bottom: 2.5rem;
`;

export const Divider = styled.div`
  border-top: 1px solid #f3f4f6;
  padding-top: 1rem;
  margin-top: 1rem;
`;

export const LoadingContainer = styled.div`
  padding: 3rem 0;
`;

export const ErrorContainer = styled.div`
  max-width: 42rem;
  margin: 0 auto;
  padding: 2rem 0;
`;

export const EmptyContainer = styled.div`
  max-width: 42rem;
  margin: 0 auto;
  padding: 3rem 0;
`;

// ============================================
// LINKS
// ============================================

export const TextLink = styled(Link)`
  color: #2563eb;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

// ============================================
// PRICE DISPLAYS
// ============================================

export const PriceDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const PriceEuro = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
`;

export const PriceVal = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  color: #2563eb;
`;

// ============================================
// SUMMARY ROWS
// ============================================

export const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
`;

export const SummaryLabel = styled.span`
  color: #6b7280;
`;

export const SummaryValue = styled.span`
  font-weight: 600;
  color: #111827;
`;

// ============================================
// MAIN CONTENT AREA
// ============================================

export const MainColumn = styled.div`
  @media (min-width: 1024px) {
    grid-column: span 2;
  }
`;

export const SideColumn = styled.div`
  @media (min-width: 1024px) {
    grid-column: span 1;
  }
`;
