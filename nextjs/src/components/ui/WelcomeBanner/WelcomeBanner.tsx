'use client';

import Image from 'next/image';
import {
  BannerContainer,
  DecorativeCircle,
  ContentWrapper,
  TitleSection,
  MainTitle,
  BrandName,
  Subtitle,
  MissionSection,
  MissionText,
  CurrencyList,
  PreferredCurrencies,
  LogosContainer,
  LogoWrapper,
  LogoBackground,
  FooterSection,
  FooterText,
  FooterHighlight,
  LearnMoreLink,
} from './WelcomeBanner.styles';

const logos = [
  { src: '/logos/comunitasolidali.png', alt: 'Comunita Solidali', href: 'https://mercato.comunitasolidali.it' },
  { src: '/logos/magic_hands.jpg', alt: 'Magic Hands Logo' },
  { src: '/logos/bannerarancione.jpg', alt: 'Banner Arancione' },
  { src: '/logos/valazco-logo.png', alt: 'Valazco Logo' },
  { src: '/logos/bannerblu.jpg', alt: 'Banner Blu' },
  { src: '/logos/bannergiallo.jpg', alt: 'Banner Giallo' },
];

export function WelcomeBanner() {
  return (
    <BannerContainer>
      <DecorativeCircle $position="top" />
      <DecorativeCircle $position="bottom" />

      <ContentWrapper>
        {/* Welcome Title */}
        <TitleSection>
          <MainTitle>
            Benvenuti in <BrandName>Pagine Azzurre</BrandName>
          </MainTitle>
          <Subtitle>
            Piazza dove barattiamo e scambiamo con meno Euro e piu <span style={{ fontSize: '1.5rem' }}>☯</span> VAL
          </Subtitle>
        </TitleSection>

        {/* Mission Statement */}
        <MissionSection>
          <MissionText>
            Pagine Azzurre favorisce ogni scambio di prodotti, servizi e competenze
            finalizzati alla emancipazione umana, per mezzo delle convenzioni monetarie:
            <CurrencyList> EUR, USD, RUR, CAN, CNY, INR, BRL, XDR, AUD, CRIPTO</CurrencyList>.
            <br />
            <PreferredCurrencies>
              Ma preferiamo: VAL, Crediti, G1, RISO
            </PreferredCurrencies> e ne richiediamo almeno l&apos;utilizzo parziale.
          </MissionText>
        </MissionSection>

        {/* Logos Container */}
        <LogosContainer>
          {logos.map((logo, index) => {
            const logoImage = (
              <LogoWrapper>
                <LogoBackground />
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={80}
                  height={80}
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    padding: '0.5rem',
                    borderRadius: '0.75rem',
                  }}
                />
              </LogoWrapper>
            );

            return logo.href ? (
              <a
                key={index}
                href={logo.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                {logoImage}
              </a>
            ) : (
              <div key={index}>{logoImage}</div>
            );
          })}
        </LogosContainer>

        {/* Footer Info */}
        <FooterSection>
          <FooterText>
            Pagineazzurre e una attivita promossa e gestita dal{' '}
            <FooterHighlight>Banco dei Cittadini Volontari del Val.Az.Co</FooterHighlight>
          </FooterText>
          <LearnMoreLink
            href="http://valazco.org/scopri-pagine-azzurre.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Scopri di piu</span>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </LearnMoreLink>
        </FooterSection>
      </ContentWrapper>
    </BannerContainer>
  );
}

export default WelcomeBanner;
