'use client';

import styled from 'styled-components';
import Link from 'next/link';

export const CookieBanner = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #374151;
  color: white;
  padding: 1rem;
  box-shadow: 0 -4px 6px -1px rgb(0 0 0 / 0.1);
  z-index: 50;
`;

export const CookieContainer = styled.div`
  max-width: 72rem;
  margin: 0 auto;
`;

export const CookieContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

export const CookieText = styled.div`
  flex: 1;
  font-size: 0.875rem;

  @media (min-width: 768px) {
    font-size: 1rem;
  }

  p {
    margin: 0;
  }

  p + p {
    margin-top: 0.25rem;
  }
`;

export const PrivacyLink = styled(Link)`
  text-decoration: underline;
  transition: color 0.2s ease;

  &:hover {
    color: #93c5fd;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-shrink: 0;
`;

const BaseButton = styled.button`
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
  min-height: 44px; /* Touch target accessibility */

  &:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
`;

export const AcceptButton = styled(BaseButton)`
  background-color: #10b981;
  color: white;

  &:hover {
    background-color: #059669;
  }
`;

export const RejectButton = styled(BaseButton)`
  background-color: transparent;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.5);

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    border-color: white;
  }
`;
