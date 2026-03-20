'use client';

import styled, { css } from 'styled-components';
import Link from 'next/link';

export const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 40;
  transition: opacity 0.3s ease;

  ${({ $isOpen }) =>
    $isOpen
      ? css`
          opacity: 1;
        `
      : css`
          opacity: 0;
          pointer-events: none;
        `}
`;

export const SidebarContainer = styled.aside<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 18rem;
  background-color: white;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  z-index: 50;
  transform: translateX(${({ $isOpen }) => ($isOpen ? '0' : '-100%')});
  transition: transform 0.3s ease-in-out;
`;

export const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
`;

export const SidebarTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
`;

export const CloseButton = styled.button`
  padding: 0.5rem;
  color: #6b7280;
  background: transparent;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: #374151;
    background-color: #f3f4f6;
  }
`;

export const SidebarNav = styled.nav`
  padding: 1rem;
  overflow-y: auto;
  max-height: calc(100vh - 80px);
`;

export const CategoryList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const CategoryItem = styled.li``;

export const CategoryLink = styled(Link)`
  display: block;
  padding: 0.75rem 1rem;
  color: #374151;
  border-radius: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: #eff6ff;
    color: #2563eb;
  }
`;
