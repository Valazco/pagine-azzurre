'use client';

import styled, { keyframes } from 'styled-components';
import { theme } from '@/lib/styles';

const marquee = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
`;

export const PreHeaderContainer = styled.div`
  background: linear-gradient(to right, #111827, #1f2937, #111827);
  color: #f3f4f6;
  overflow: hidden;
  padding: 0.625rem 0;
`;

export const MarqueeWrapper = styled.div`
  display: inline-block;
  white-space: nowrap;
  animation: ${marquee} 30s linear infinite;

  &:hover {
    animation-play-state: paused;
  }
`;

export const MarqueeText = styled.p`
  display: inline-block;
  padding: 0 ${theme.spacing.md};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  letter-spacing: 0.025em;
  margin: 0;
`;

export const BrandHighlight = styled.span`
  color: #60a5fa;
`;

export const HeartIcon = styled.span`
  color: #f87171;
`;

export const TeamHighlight = styled.span`
  color: #60a5fa;
  font-weight: ${theme.typography.fontWeight.semibold};
`;
