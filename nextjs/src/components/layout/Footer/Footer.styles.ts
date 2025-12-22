'use client';

import styled from 'styled-components';
import { theme } from '@/lib/styles';

export const FooterContainer = styled.footer`
  background-color: ${theme.colors.backgroundSecondary};
  border-top: 1px solid ${theme.colors.border};
`;

export const FooterContent = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  padding: ${theme.spacing.xl} ${theme.spacing.xl};

  @media (min-width: 1024px) {
    padding: ${theme.spacing.xl} 4rem;
  }
`;

export const FooterRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.md};

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

export const Brand = styled.div`
  flex: 1;
  margin-left: 2rem;

  @media (max-width: 767px) {
    margin-left: 0;
    text-align: center;
  }
`;

export const BrandText = styled.span`
  font-size: 1.125rem;
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text};
`;

export const BrandAccent = styled.span`
  font-size: 1.125rem;
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary};
`;

export const CenterText = styled.p`
  flex: 1;
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.textSecondary};
  text-align: center;
`;

export const HeartIcon = styled.span`
  color: #ef4444;
`;

export const TeamLink = styled.a`
  color: ${theme.colors.primary};
  font-weight: ${theme.typography.fontWeight.medium};
  transition: color ${theme.transitions.fast};

  &:hover {
    color: ${theme.colors.primaryHover};
  }
`;

export const Copyright = styled.p`
  flex: 1;
  font-size: ${theme.typography.fontSize.sm};
  color: #9ca3af;
  text-align: right;

  @media (max-width: 767px) {
    text-align: center;
  }
`;
