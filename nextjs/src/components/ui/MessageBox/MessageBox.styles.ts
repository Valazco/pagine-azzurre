'use client';

import styled, { css } from 'styled-components';
import { theme } from '@/lib/styles';

export type MessageVariant = 'info' | 'success' | 'warning' | 'danger' | 'alert';

interface StyledMessageBoxProps {
  $variant: MessageVariant;
  $centered: boolean;
  $fullWidth: boolean;
}

const variantStyles = {
  info: css`
    background-color: ${theme.colors.infoLight};
    border-color: ${theme.colors.info};
    color: #1e40af;
  `,
  success: css`
    background-color: ${theme.colors.successLight};
    border-color: ${theme.colors.success};
    color: #166534;
  `,
  warning: css`
    background-color: ${theme.colors.warningLight};
    border-color: ${theme.colors.warning};
    color: #92400e;
  `,
  danger: css`
    background-color: ${theme.colors.dangerLight};
    border-color: ${theme.colors.danger};
    color: #991b1b;
  `,
  alert: css`
    background-color: #fff7ed;
    border-color: #fb923c;
    color: #9a3412;
  `,
};

export const StyledMessageBox = styled.div<StyledMessageBoxProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: 1px solid;
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  line-height: ${theme.typography.lineHeight.normal};

  ${({ $variant }) => variantStyles[$variant]}

  ${({ $centered }) =>
    $centered &&
    css`
      text-align: center;
    `}

  ${({ $fullWidth }) =>
    $fullWidth
      ? css`
          display: flex;
          width: 100%;
        `
      : css`
          max-width: fit-content;
        `}
`;

export const MessageBoxWrapper = styled.div<{ $centered: boolean }>`
  ${({ $centered }) =>
    $centered &&
    css`
      display: flex;
      justify-content: center;
      width: 100%;
    `}
`;
