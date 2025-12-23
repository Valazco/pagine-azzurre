'use client';

import React from 'react';
import {
  StyledCard,
  StyledCardButton,
  CardHeader,
  CardTitle,
  CardSubtitle,
  CardContent,
  CardFooter,
  CardImage,
  CardVariant,
  CardPadding,
} from './Card.styles';

export interface CardProps {
  /** Visual style variant */
  variant?: CardVariant;
  /** Padding inside the card */
  padding?: CardPadding;
  /** Enable hover effect */
  hoverable?: boolean;
  /** Make card clickable (adds cursor pointer) */
  clickable?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Accessible label for clickable cards */
  ariaLabel?: string;
  /** Card contents */
  children: React.ReactNode;
  /** Additional className */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

export function Card({
  variant = 'default',
  padding = 'none',
  hoverable = false,
  clickable = false,
  onClick,
  ariaLabel,
  children,
  className,
  style,
}: CardProps) {
  const isClickable = clickable || !!onClick;
  const sharedProps = {
    $variant: variant,
    $padding: padding,
    $hoverable: hoverable,
    $clickable: isClickable,
    className,
    style,
  };

  // Use button element for clickable cards (better accessibility)
  if (isClickable && onClick) {
    return (
      <StyledCardButton
        {...sharedProps}
        onClick={onClick}
        type="button"
        aria-label={ariaLabel}
      >
        {children}
      </StyledCardButton>
    );
  }

  return (
    <StyledCard {...sharedProps}>
      {children}
    </StyledCard>
  );
}

// Sub-components for composition
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Subtitle = CardSubtitle;
Card.Content = CardContent;
Card.Footer = CardFooter;
Card.Image = CardImage;

export default Card;
