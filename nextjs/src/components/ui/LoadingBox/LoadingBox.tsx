'use client';

import { LoadingContainer, LoadingContent, Spinner, LoadingText } from './LoadingBox.styles';

export function LoadingBox() {
  return (
    <LoadingContainer>
      <LoadingContent>
        <Spinner />
        <LoadingText>Caricando...</LoadingText>
      </LoadingContent>
    </LoadingContainer>
  );
}

export default LoadingBox;
