import type { Meta, StoryObj } from '@storybook/react';
import { Header } from './Header';

const meta: Meta<typeof Header> = {
  title: 'Layout/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Header principale del sito con navigazione, ricerca, carrello e menu utente',
      },
    },
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Header>;

export const LoggedOut: Story = {
  args: {},
};

export const WithSidebarToggle: Story = {
  args: {
    setSidebarIsOpen: () => console.log('Toggle sidebar'),
  },
};

export const MobileView: Story = {
  args: {
    setSidebarIsOpen: () => console.log('Toggle sidebar'),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const TabletView: Story = {
  args: {
    setSidebarIsOpen: () => console.log('Toggle sidebar'),
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

export const DesktopView: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
  },
};
