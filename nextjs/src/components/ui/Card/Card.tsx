'use client';

import React from 'react';
import {
  StyledCard,
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
  /** Card contents */
  children: React.ReactNode;
  /** Additional className */
  className?: string;
}

export function Card({
  variant = 'default',
  padding = 'none',
  hoverable = false,
  clickable = false,
  onClick,
  children,
  className,
}: CardProps) {
  return (
    <StyledCard
      $variant={variant}
      $padding={padding}
      $hoverable={hoverable}
      $clickable={clickable || !!onClick}
      onClick={onClick}
      className={className}
    >
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
