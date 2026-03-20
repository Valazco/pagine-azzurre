'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import styled from 'styled-components';
import { theme } from '@/lib/styles';
import { Header } from './Header';
import { Footer } from './Footer';

// Routes that should not show header/footer
const MINIMAL_LAYOUT_ROUTES = ['/register', '/signin', '/verification', '/password-recovery'];

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: white;
`;

const MainContent = styled.main`
  flex-grow: 1;
  max-width: 80rem;
  margin: 0 auto;
  padding: ${theme.spacing.lg} ${theme.spacing.md};
  width: 100%;

  @media (min-width: 1024px) {
    padding: ${theme.spacing.xl} 4rem;
  }
`;

const MinimalContainer = styled.div`
  min-height: 100vh;
`;

interface LayoutWrapperProps {
  children: ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const isMinimalLayout = MINIMAL_LAYOUT_ROUTES.some(route => pathname?.startsWith(route));

  if (isMinimalLayout) {
    return <MinimalContainer>{children}</MinimalContainer>;
  }

  return (
    <AppContainer>
      <Header />
      <MainContent>{children}</MainContent>
      <Footer />
    </AppContainer>
  );
}

export default LayoutWrapper;
