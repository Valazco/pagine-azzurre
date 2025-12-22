import type { Meta, StoryObj } from '@storybook/react';
import { PostHeader } from './PostHeader';

const meta: Meta<typeof PostHeader> = {
  title: 'Layout/PostHeader',
  component: PostHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Barra sotto l\'header con invito all\'iscrizione a valazco.it',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PostHeader>;

export const Default: Story = {};

export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
