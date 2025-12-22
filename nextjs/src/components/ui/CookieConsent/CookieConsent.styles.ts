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

export const AcceptButton = styled.button`
  background-color: white;
  color: #374151;
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f3f4f6;
  }
`;
