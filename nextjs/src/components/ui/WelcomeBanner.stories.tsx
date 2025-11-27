import type { Meta, StoryObj } from '@storybook/react';
import WelcomeBanner from './WelcomeBanner';

const meta: Meta<typeof WelcomeBanner> = {
  title: 'UI/WelcomeBanner',
  component: WelcomeBanner,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Banner di benvenuto con logo e messaggio di presentazione di Pagine Azzurre',
      },
    },
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <div className="p-4 bg-gray-100 min-h-screen">
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
