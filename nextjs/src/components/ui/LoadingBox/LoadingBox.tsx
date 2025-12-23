'use client';

import { LoadingContainer, LoadingContent, Spinner, LoadingText } from './LoadingBox.styles';

export interface LoadingBoxProps {
  /** Loading message for screen readers */
  message?: string;
}

export function LoadingBox({ message = 'Caricando...' }: LoadingBoxProps) {
  return (
    <LoadingContainer
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <LoadingContent>
        <Spinner aria-hidden="true" />
        <LoadingText>{message}</LoadingText>
      </LoadingContent>
    </LoadingContainer>
  );
}

export default LoadingBox;
