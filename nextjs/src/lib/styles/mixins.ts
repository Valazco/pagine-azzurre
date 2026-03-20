'use client';

import { css } from 'styled-components';
import { theme } from './theme';

/**
 * Focus visible mixin - adds accessible focus ring
 * Use this for interactive elements
 */
export const focusVisibleMixin = css`
  &:focus-visible {
    outline: ${theme.a11y.focusRingWidth} solid ${theme.a11y.focusRingColor};
    outline-offset: ${theme.a11y.focusRingOffset};
  }
`;

/**
 * Touch target mixin - ensures minimum 44x44px touch target
 * Use this for buttons, links, and interactive elements on touch devices
 */
export const touchTargetMixin = css`
  min-height: ${theme.a11y.minTouchTarget};
  min-width: ${theme.a11y.minTouchTarget};
`;

/**
 * Screen reader only mixin - visually hides content but keeps it accessible
 * Use this for accessible labels that shouldn't be visible
 */
export const srOnlyMixin = css`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

/**
 * Reduced motion mixin - disables animations for users who prefer reduced motion
 * Wrap animations with this to respect user preferences
 */
export const reducedMotionMixin = css`
  ${theme.a11y.reducedMotion} {
    animation: none !important;
    transition: none !important;
  }
`;

/**
 * Interactive element base mixin - common styles for buttons and links
 * Includes focus ring, touch target, and cursor
 */
export const interactiveElementMixin = css`
  cursor: pointer;
  ${focusVisibleMixin}

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

/**
 * High contrast mixin - adds high contrast mode support
 * Use for elements that need special styling in high contrast mode
 */
export const highContrastMixin = css`
  ${theme.a11y.highContrast} {
    border: 2px solid currentColor;
  }
`;
