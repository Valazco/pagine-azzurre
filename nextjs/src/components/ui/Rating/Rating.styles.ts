'use client';

import styled from 'styled-components';

export const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const StarsContainer = styled.div`
  display: flex;
  font-size: 1.25rem;
`;

export const Star = styled.span<{ $type: 'full' | 'half' | 'empty' }>`
  position: relative;
  color: ${({ $type }) => ($type === 'empty' ? '#d1d5db' : '#eab308')};

  ${({ $type }) =>
    $type === 'half' &&
    `
    &::before {
      content: '★';
      position: absolute;
      left: 0;
      top: 0;
      width: 50%;
      overflow: hidden;
      color: #eab308;
    }
  `}
`;

export const Caption = styled.span`
  color: #6b7280;
  font-size: 0.875rem;
`;
