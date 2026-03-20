'use client';

import styled from 'styled-components';
import { theme } from '@/lib/styles';

export const PostHeaderContainer = styled.div`
  background-color: rgba(249, 250, 251, 0.8);
  padding: ${theme.spacing.md} 0;
`;

export const PostHeaderContent = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 ${theme.spacing.md};
  text-align: center;
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.textSecondary};

  @media (min-width: 1024px) {
    padding: 0 ${theme.spacing.xl};
  }
`;

export const PostHeaderLink = styled.a`
  color: ${theme.colors.primary};
  font-weight: ${theme.typography.fontWeight.semibold};
  transition: color ${theme.transitions.fast};

  &:hover {
    color: ${theme.colors.primaryHover};
  }
`;
