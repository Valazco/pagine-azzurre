import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Sidebar from './Sidebar';

const meta: Meta<typeof Sidebar> = {
  title: 'Layout/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Sidebar laterale con elenco delle categorie prodotti, si apre con animazione slide-in',
      },
    },
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Closed: Story = {
  args: {
    isOpen: false,
    onClose: () => console.log('Close sidebar'),
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gray-100 p-8">
        <p className="text-gray-600">La sidebar è chiusa. Usa i controlli per aprirla.</p>
        <Story />
      </div>
    ),
  ],
};

export const Open: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Close sidebar'),
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gray-100">
        <div className="p-8">
          <h1 className="text-xl font-bold mb-4">Contenuto della pagina</h1>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            La sidebar è aperta e mostra le categorie dei prodotti.
          </p>
        </div>
        <Story />
      </div>
    ),
  ],
};

export const Interactive: Story = {
  render: function InteractiveSidebar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="min-h-screen bg-gray-100">
        <div className="p-8">
          <h1 className="text-xl font-bold mb-4">Demo Interattiva</h1>
          <button
            onClick={() => setIsOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Apri Sidebar
          </button>
          <p className="mt-4 text-gray-600">
            Clicca il pulsante sopra per aprire la sidebar.
            Puoi chiuderla cliccando sulla X, sull&apos;overlay o premendo ESC.
          </p>
        </div>
        <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </div>
    );
  },
};

export const MobileView: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Close sidebar'),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gray-100">
        <Story />
      </div>
    ),
  ],
};
