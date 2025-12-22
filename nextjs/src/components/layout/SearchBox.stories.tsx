import type { Meta, StoryObj } from '@storybook/react';
import { SearchBox } from './SearchBox';

const meta: Meta<typeof SearchBox> = {
  title: 'Layout/SearchBox',
  component: SearchBox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Campo di ricerca prodotti con icona e navigazione automatica',
      },
    },
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '24rem', padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SearchBox>;

export const Default: Story = {};

export const InHeader: Story = {
  decorators: [
    (Story) => (
      <div style={{ backgroundColor: 'white', padding: '1rem', boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)', width: '100%', maxWidth: '36rem' }}>
        <Story />
      </div>
    ),
  ],
};

export const MobileWidth: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: '18rem', padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],
};

export const FullWidth: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: '100%', padding: '1rem', backgroundColor: '#f3f4f6' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
};
