'use client';

import styled, { css } from 'styled-components';
import Link from 'next/link';

export const PaginationNav = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin: 3rem 0;
`;

export const PageNumbersContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const baseButtonStyles = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s ease;
`;

export const NavButton = styled(Link)`
  ${baseButtonStyles}
  background-color: white;
  border: 2px solid #e5e7eb;
  color: #374151;

  &:hover {
    border-color: #3b82f6;
    color: #2563eb;
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

export const PageLink = styled(Link)<{ $isActive?: boolean }>`
  ${baseButtonStyles}

  ${({ $isActive }) =>
    $isActive
      ? css`
          background-color: #2563eb;
          color: white;
          box-shadow: 0 10px 15px -3px rgb(59 130 246 / 0.3);
        `
      : css`
          background-color: white;
          color: #374151;
          border: 2px solid #e5e7eb;

          &:hover {
            border-color: #3b82f6;
            color: #2563eb;
          }
        `}
`;

export const NavAction = styled.button`
  ${baseButtonStyles}
  background-color: white;
  border: 2px solid #e5e7eb;
  color: #374151;
  cursor: pointer;

  &:hover {
    border-color: #3b82f6;
    color: #2563eb;
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

export const PageButton = styled.button<{ $isActive?: boolean }>`
  ${baseButtonStyles}
  cursor: pointer;

  ${({ $isActive }) =>
    $isActive
      ? css`
          background-color: #2563eb;
          color: white;
          border: none;
          box-shadow: 0 10px 15px -3px rgb(59 130 246 / 0.3);
        `
      : css`
          background-color: white;
          color: #374151;
          border: 2px solid #e5e7eb;

          &:hover {
            border-color: #3b82f6;
            color: #2563eb;
          }
        `}
`;

export const Ellipsis = styled.span`
  ${baseButtonStyles}
  color: #9ca3af;
`;

export const NavIcon = styled.svg`
  width: 1.25rem;
  height: 1.25rem;
`;
