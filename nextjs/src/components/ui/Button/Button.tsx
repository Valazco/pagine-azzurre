'use client';

import React from 'react';
import { StyledButton, ButtonIcon, ButtonVariant, ButtonSize } from './Button.styles';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Size of the button */
  size?: ButtonSize;
  /** Make button full width */
  fullWidth?: boolean;
  /** Show loading spinner */
  isLoading?: boolean;
  /** Icon to show before text */
  leftIcon?: React.ReactNode;
  /** Icon to show after text */
  rightIcon?: React.ReactNode;
  /** Button contents */
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      $isLoading={isLoading}
      disabled={disabled || isLoading}
      {...props}
    >
      {leftIcon && <ButtonIcon>{leftIcon}</ButtonIcon>}
      {children}
      {rightIcon && <ButtonIcon>{rightIcon}</ButtonIcon>}
    </StyledButton>
  );
}

export default Button;
