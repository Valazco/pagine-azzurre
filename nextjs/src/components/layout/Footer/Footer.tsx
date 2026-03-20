'use client';

import {
  FooterContainer,
  FooterContent,
  FooterRow,
  Brand,
  BrandText,
  BrandAccent,
  CenterText,
  HeartIcon,
  TeamLink,
  Copyright,
} from './Footer.styles';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <FooterContent>
        <FooterRow>
          {/* Brand - left */}
          <Brand>
            <BrandText>Pagine</BrandText>
            <BrandAccent> Azzurre</BrandAccent>
          </Brand>

          {/* Center text */}
          <CenterText>
            Un progetto fatto con{' '}
            <HeartIcon role="img" aria-label="heart">
              ❤️
            </HeartIcon>{' '}
            dal team{' '}
            <TeamLink
              href="https://valazco.it"
              target="_blank"
              rel="noopener noreferrer"
            >
              VALAZCO
            </TeamLink>
          </CenterText>

          {/* Copyright - right */}
          <Copyright>
            &copy; {currentYear} Pagine Azzurre
          </Copyright>
        </FooterRow>
      </FooterContent>
    </FooterContainer>
  );
}

export default Footer;
