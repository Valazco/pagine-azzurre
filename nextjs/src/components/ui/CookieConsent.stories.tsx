import type { Meta, StoryObj } from '@storybook/react';
import CookieConsent from './CookieConsent';

const meta: Meta<typeof CookieConsent> = {
  title: 'UI/CookieConsent',
  component: CookieConsent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Banner per il consenso dei cookie, visibile in basso nella pagina',
      },
    },
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => {
      // Clear localStorage to show the banner
      if (typeof window !== 'undefined') {
        localStorage.removeItem('pagineazzurre-cookies');
      }
      return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '2rem' }}>
          <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Pagina di esempio</h1>
            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
              Questo è un contenuto di esempio per mostrare come il banner dei cookie
              appare nella parte inferiore della pagina.
            </p>
            <p style={{ color: '#6b7280' }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
          <Story />
        </div>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof CookieConsent>;

export const Default: Story = {};

export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const TabletView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};
