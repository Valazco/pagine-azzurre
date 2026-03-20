'use client';

import styled, { css } from 'styled-components';
import Link from 'next/link';
import { theme } from '@/lib/styles';

export const HeaderContainer = styled.header`
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  position: sticky;
  top: 0;
  z-index: 50;
`;

export const HeaderContent = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 ${theme.spacing.md};

  @media (min-width: 1024px) {
    padding: 0 ${theme.spacing.xl};
  }
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing.md} 0;

  @media (min-width: 1024px) {
    padding: ${theme.spacing.lg} 0;
  }
`;

export const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.lg};
  flex: 1;
  margin-left: 2rem;

  @media (max-width: 767px) {
    margin-left: ${theme.spacing.sm};
  }
`;

export const SidebarButton = styled.button`
  padding: 0.625rem;
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: ${theme.borderRadius.lg};
  transition: background-color ${theme.transitions.normal};
  color: ${theme.colors.textSecondary};

  &:hover {
    background-color: ${theme.colors.backgroundSecondary};
  }

  @media (min-width: 1024px) {
    display: none;
  }
`;

export const BrandLink = styled(Link)`
  font-size: 1.5rem;
  font-weight: ${theme.typography.fontWeight.bold};
  letter-spacing: -0.025em;
  white-space: nowrap;
  text-decoration: none;

  &:hover span:last-child {
    color: #3b82f6;
  }
`;

export const BrandText = styled.span`
  color: ${theme.colors.text};
`;

export const BrandAccent = styled.span`
  color: ${theme.colors.primary};
  transition: color ${theme.transitions.fast};
`;

export const SearchWrapper = styled.div`
  flex: 1;
  max-width: 32rem;
  display: none;

  @media (min-width: 768px) {
    display: block;
  }
`;

export const MobileSearchWrapper = styled.div`
  padding-bottom: ${theme.spacing.md};

  @media (min-width: 768px) {
    display: none;
  }
`;

export const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};

  @media (min-width: 1024px) {
    gap: ${theme.spacing.md};
  }
`;

export const NavLink = styled(Link)`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  color: ${theme.colors.textSecondary};
  font-weight: ${theme.typography.fontWeight.medium};
  font-size: ${theme.typography.fontSize.sm};
  border-radius: ${theme.borderRadius.md};
  transition: all ${theme.transitions.normal};
  text-decoration: none;
  display: none;

  &:hover {
    color: ${theme.colors.text};
    background-color: ${theme.colors.backgroundSecondary};
  }

  @media (min-width: 640px) {
    display: block;
  }
`;

export const CartLink = styled(Link)`
  position: relative;
  padding: 0.625rem;
  border-radius: ${theme.borderRadius.lg};
  transition: background-color ${theme.transitions.normal};
  color: ${theme.colors.textSecondary};

  &:hover {
    background-color: ${theme.colors.backgroundSecondary};
  }
`;

export const CartBadge = styled.span`
  position: absolute;
  top: -2px;
  right: -2px;
  background-color: ${theme.colors.primary};
  color: white;
  font-size: 0.75rem;
  font-weight: ${theme.typography.fontWeight.semibold};
  border-radius: 9999px;
  width: 1.25rem;
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${theme.shadows.sm};
`;

export const DropdownContainer = styled.div`
  position: relative;
`;

export const DropdownButton = styled.button<{ $variant?: 'default' | 'admin' }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: none;
  border-radius: ${theme.borderRadius.lg};
  cursor: pointer;
  font-size: ${theme.typography.fontSize.sm};
  transition: all ${theme.transitions.normal};

  ${({ $variant }) =>
    $variant === 'admin'
      ? css`
          background-color: ${theme.colors.text};
          color: white;

          &:hover {
            background-color: #1f2937;
          }
        `
      : css`
          background: transparent;
          color: ${theme.colors.textSecondary};

          &:hover {
            background-color: ${theme.colors.backgroundSecondary};
          }
        `}
`;

export const DropdownUsername = styled.span`
  font-weight: ${theme.typography.fontWeight.medium};
  display: none;

  @media (min-width: 640px) {
    display: inline;
  }
`;

export const ChevronIcon = styled.span<{ $isOpen: boolean }>`
  transition: transform ${theme.transitions.normal};
  transform: ${({ $isOpen }) => ($isOpen ? 'rotate(180deg)' : 'rotate(0)')};
  display: flex;
  align-items: center;
`;

export const DropdownOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10;
`;

export const DropdownMenu = styled.ul`
  position: absolute;
  right: 0;
  margin-top: ${theme.spacing.sm};
  width: 14rem;
  background-color: white;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.lg};
  z-index: 20;
  padding: ${theme.spacing.xs} 0;
  overflow: hidden;
  list-style: none;
`;

export const DropdownItem = styled.li<{ $hasBorder?: boolean }>`
  ${({ $hasBorder }) =>
    $hasBorder &&
    css`
      border-top: 1px solid ${theme.colors.border};
    `}
`;

export const DropdownLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  padding: 0.625rem ${theme.spacing.md};
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.textSecondary};
  text-decoration: none;
  transition: background-color ${theme.transitions.fast};

  &:hover {
    background-color: ${theme.colors.backgroundSecondary};
  }

  svg {
    color: #9ca3af;
  }
`;

export const DropdownLogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  width: 100%;
  padding: 0.625rem ${theme.spacing.md};
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.danger};
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background-color ${theme.transitions.fast};

  &:hover {
    background-color: #fef2f2;
  }
`;

export const HeaderBorder = styled.div`
  height: 1px;
  background: linear-gradient(to right, transparent, ${theme.colors.border}, transparent);
`;
