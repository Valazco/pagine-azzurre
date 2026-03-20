'use client';

import styled, { css } from 'styled-components';
import { theme } from '@/lib/styles';

export type CardVariant = 'default' | 'elevated' | 'outlined';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

interface StyledCardProps {
  $variant: CardVariant;
  $padding: CardPadding;
  $hoverable: boolean;
  $clickable: boolean;
}

const paddingStyles = {
  none: css`
    padding: 0;
  `,
  sm: css`
    padding: ${theme.spacing.sm};
  `,
  md: css`
    padding: ${theme.spacing.md};
  `,
  lg: css`
    padding: ${theme.spacing.lg};
  `,
};

const variantStyles = {
  default: css`
    background-color: ${theme.colors.background};
    border: 1px solid ${theme.colors.border};
  `,
  elevated: css`
    background-color: ${theme.colors.background};
    border: none;
    box-shadow: ${theme.shadows.md};
  `,
  outlined: css`
    background-color: transparent;
    border: 2px solid ${theme.colors.border};
  `,
};

const baseCardStyles = css<StyledCardProps>`
  border-radius: ${theme.borderRadius.xl};
  transition: all ${theme.transitions.normal};
  overflow: hidden;
  text-align: left;
  width: 100%;
  font-family: inherit;
  font-size: inherit;

  ${({ $variant }) => variantStyles[$variant]}
  ${({ $padding }) => paddingStyles[$padding]}

  ${({ $hoverable }) =>
    $hoverable &&
    css`
      &:hover {
        box-shadow: ${theme.shadows.lg};
        border-color: ${theme.colors.borderDark};
        transform: translateY(-2px);
      }
    `}

  ${({ $clickable }) =>
    $clickable &&
    css`
      cursor: pointer;

      &:hover {
        box-shadow: ${theme.shadows.lg};
      }

      &:active {
        transform: translateY(0);
      }

      &:focus-visible {
        outline: 2px solid ${theme.colors.primary};
        outline-offset: 2px;
      }
    `}
`;

export const StyledCard = styled.div<StyledCardProps>`
  ${baseCardStyles}
`;

export const StyledCardButton = styled.button<StyledCardProps>`
  ${baseCardStyles}
  display: block;
`;

export const CardHeader = styled.div`
  padding: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.borderLight};
`;

export const CardTitle = styled.h3`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text};
  margin: 0;
`;

export const CardSubtitle = styled.p`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.textSecondary};
  margin: ${theme.spacing.xs} 0 0 0;
`;

export const CardContent = styled.div`
  padding: ${theme.spacing.md};
`;

export const CardFooter = styled.div`
  padding: ${theme.spacing.md};
  border-top: 1px solid ${theme.colors.borderLight};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

export const CardImage = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;

  img {
    width: 100%;
    height: auto;
    display: block;
    object-fit: cover;
  }
`;
