'use client';

import {
  PostHeaderContainer,
  PostHeaderContent,
  PostHeaderLink,
} from './PostHeader.styles';

export function PostHeader() {
  return (
    <PostHeaderContainer>
      <PostHeaderContent>
        Iscriviti qui:{' '}
        <PostHeaderLink
          href="https://valazco.it"
          target="_blank"
          rel="noopener noreferrer"
        >
          valazco.it
        </PostHeaderLink>{' '}
        per avere i VAL contributo di emancipazione giornaliero da utilizzare subito
      </PostHeaderContent>
    </PostHeaderContainer>
  );
}

export default PostHeader;
