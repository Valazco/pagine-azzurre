'use client';

import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { theme } from './theme';
import { GlobalStyles } from './GlobalStyles';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <StyledThemeProvider theme={theme}>
      <GlobalStyles />
      {children}
    </StyledThemeProvider>
  );
}

export default ThemeProvider;
