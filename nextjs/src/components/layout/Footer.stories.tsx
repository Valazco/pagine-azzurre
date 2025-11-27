import type { Meta, StoryObj } from '@storybook/react';
import Footer from './Footer';

const meta: Meta<typeof Footer> = {
  title: 'Layout/Footer',
  component: Footer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Footer del sito con crediti e link al team Val.Az.Co.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 bg-white p-8">
          <h1 className="text-xl font-bold mb-4">Contenuto della pagina</h1>
          <p className="text-gray-600">Lorem ipsum dolor sit amet...</p>
        </div>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Footer>;

export const Default: Story = {};

export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
