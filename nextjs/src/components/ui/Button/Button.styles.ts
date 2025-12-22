'use client';

import styled, { css } from 'styled-components';
import { theme } from '@/lib/styles';

// Button variants
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface StyledButtonProps {
  $variant: ButtonVariant;
  $size: ButtonSize;
  $fullWidth: boolean;
  $isLoading: boolean;
}

const sizeStyles = {
  sm: css`
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
    font-size: ${theme.typography.fontSize.xs};
    border-radius: ${theme.borderRadius.md};
    gap: ${theme.spacing.xs};
  `,
  md: css`
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.typography.fontSize.sm};
    border-radius: ${theme.borderRadius.lg};
    gap: ${theme.spacing.sm};
  `,
  lg: css`
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    font-size: ${theme.typography.fontSize.base};
    border-radius: ${theme.borderRadius.xl};
    gap: ${theme.spacing.sm};
  `,
};

const variantStyles = {
  primary: css`
    background-color: ${theme.colors.primary};
    color: ${theme.colors.textLight};
    border: 2px solid transparent;

    &:hover:not(:disabled) {
      background-color: ${theme.colors.primaryHover};
      transform: translateY(-1px);
      box-shadow: ${theme.shadows.md};
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }
  `,
  secondary: css`
    background-color: ${theme.colors.secondary};
    color: ${theme.colors.textLight};
    border: 2px solid transparent;

    &:hover:not(:disabled) {
      background-color: ${theme.colors.secondaryHover};
    }
  `,
  outline: css`
    background-color: transparent;
    color: ${theme.colors.primary};
    border: 2px solid ${theme.colors.primary};

    &:hover:not(:disabled) {
      background-color: ${theme.colors.primaryLighter};
    }
  `,
  ghost: css`
    background-color: transparent;
    color: ${theme.colors.text};
    border: 2px solid transparent;

    &:hover:not(:disabled) {
      background-color: ${theme.colors.backgroundSecondary};
    }
  `,
  danger: css`
    background-color: ${theme.colors.danger};
    color: ${theme.colors.textLight};
    border: 2px solid transparent;

    &:hover:not(:disabled) {
      background-color: #dc2626;
      transform: translateY(-1px);
      box-shadow: ${theme.shadows.md};
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }
  `,
};

export const StyledButton = styled.button<StyledButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: ${theme.typography.fontFamily.sans};
  font-weight: ${theme.typography.fontWeight.medium};
  line-height: 1;
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  white-space: nowrap;
  user-select: none;

  ${({ $size }) => sizeStyles[$size]}
  ${({ $variant }) => variantStyles[$variant]}

  ${({ $fullWidth }) =>
    $fullWidth &&
    css`
      width: 100%;
    `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${({ $isLoading }) =>
    $isLoading &&
    css`
      position: relative;
      color: transparent;

      &::after {
        content: '';
        position: absolute;
        width: 1em;
        height: 1em;
        border: 2px solid currentColor;
        border-right-color: transparent;
        border-radius: 50%;
        animation: spin 0.6s linear infinite;
        color: ${theme.colors.textLight};
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `}
`;

export const ButtonIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;
