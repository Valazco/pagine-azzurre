import type { Meta, StoryObj } from '@storybook/react';
import SearchBox from './SearchBox';

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
      <div className="w-96 p-4">
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
      <div className="bg-white p-4 shadow-sm w-full max-w-xl">
        <Story />
      </div>
    ),
  ],
};

export const MobileWidth: Story = {
  decorators: [
    (Story) => (
      <div className="w-72 p-4">
        <Story />
      </div>
    ),
  ],
};

export const FullWidth: Story = {
  decorators: [
    (Story) => (
      <div className="w-full p-4 bg-gray-100">
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
};
