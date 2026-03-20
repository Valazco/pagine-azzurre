'use client';

import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

export const GlobalStyles = createGlobalStyle`
  /* Modern CSS Reset */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    overflow-x: hidden;
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: ${theme.typography.fontFamily.sans};
    font-size: ${theme.typography.fontSize.base};
    line-height: ${theme.typography.lineHeight.normal};
    color: ${theme.colors.text};
    background-color: ${theme.colors.background};
    min-height: 100vh;
  }

  /* Links */
  a {
    color: inherit;
    text-decoration: none;
    transition: color ${theme.transitions.fast};
  }

  /* Lists */
  ul, ol {
    list-style: none;
  }

  /* Images */
  img, picture, video, canvas, svg {
    display: block;
    max-width: 100%;
  }

  /* Form elements */
  input, button, textarea, select {
    font: inherit;
  }

  /* Focus styles for accessibility */
  *:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
  }

  /* Remove focus outline for mouse users */
  *:focus:not(:focus-visible) {
    outline: none;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  ::-webkit-scrollbar-track {
    background: ${theme.colors.backgroundSecondary};
  }

  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.borderDark};
    border-radius: 5px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.secondary};
  }

  /* Marquee Animation for PreHeader */
  @keyframes marquee {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }

  .animate-marquee {
    display: inline-block;
    animation: marquee 30s linear infinite;
  }

  .animate-marquee:hover {
    animation-play-state: paused;
  }

  /* Loading animation */
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Fade in animation */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export default GlobalStyles;
