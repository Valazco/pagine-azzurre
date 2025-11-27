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
        <div className="min-h-screen bg-gray-100 p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Pagina di esempio</h1>
            <p className="text-gray-600 mb-4">
              Questo è un contenuto di esempio per mostrare come il banner dei cookie
              appare nella parte inferiore della pagina.
            </p>
            <p className="text-gray-600">
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
