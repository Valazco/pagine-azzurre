import type { Meta, StoryObj } from '@storybook/react';
import LoadingBox from './LoadingBox';

const meta: Meta<typeof LoadingBox> = {
  title: 'UI/LoadingBox',
  component: LoadingBox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Spinner di caricamento animato con messaggio "Caricando..."',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof LoadingBox>;

export const Default: Story = {};

export const InContainer: Story = {
  decorators: [
    (Story) => (
      <div className="w-96 h-64 border border-gray-200 rounded-lg flex items-center justify-center">
        <Story />
      </div>
    ),
  ],
};

export const FullPage: Story = {
  decorators: [
    (Story) => (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-50">
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
};
