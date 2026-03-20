'use client';

import {
  PreHeaderContainer,
  MarqueeWrapper,
  MarqueeText,
  BrandHighlight,
  HeartIcon,
  TeamHighlight,
} from './PreHeader.styles';

export function PreHeader() {
  return (
    <PreHeaderContainer>
      <MarqueeWrapper>
        <MarqueeText>
          <BrandHighlight>PAGINE AZZURRE</BrandHighlight>
          {' '}&bull;{' '}
          Un progetto fatto con{' '}
          <HeartIcon role="img" aria-label="heart">
            ❤️
          </HeartIcon>{' '}
          dal team{' '}
          <TeamHighlight>VALAZCO</TeamHighlight>
          {' '}&bull;{' '}
          VALorizzatore del AZione COncordata
          {' '}&bull;{' '}
          <BrandHighlight>PAGINE AZZURRE</BrandHighlight>
          {' '}&bull;{' '}
          Un progetto fatto con{' '}
          <HeartIcon role="img" aria-label="heart">
            ❤️
          </HeartIcon>{' '}
          dal team{' '}
          <TeamHighlight>VALAZCO</TeamHighlight>
          {' '}&bull;{' '}
          VALorizzatore del AZione COncordata
        </MarqueeText>
      </MarqueeWrapper>
    </PreHeaderContainer>
  );
}

export default PreHeader;
