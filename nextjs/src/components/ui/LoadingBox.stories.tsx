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
      <div style={{ width: '24rem', height: '16rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Story />
      </div>
    ),
  ],
};

export const FullPage: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
};
