import type { Meta, StoryObj } from '@storybook/react';
import { PreHeader } from './PreHeader';

const meta: Meta<typeof PreHeader> = {
  title: 'Layout/PreHeader',
  component: PreHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Barra superiore con testo scorrevole (marquee) di presentazione',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PreHeader>;

export const Default: Story = {};

export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
