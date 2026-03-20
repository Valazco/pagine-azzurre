import type { Meta, StoryObj } from '@storybook/react';
import { WelcomeBanner } from './WelcomeBanner';

const meta: Meta<typeof WelcomeBanner> = {
  title: 'UI/WelcomeBanner',
  component: WelcomeBanner,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Banner di benvenuto con styled-components. Presenta Pagine Azzurre con logo e messaggio mission.',
      },
    },
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '1rem', backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof WelcomeBanner>;

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

export const DesktopWide: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
  },
};
