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
      <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '2rem' }}>
        <p style={{ color: '#6b7280' }}>La sidebar è chiusa. Usa i controlli per aprirla.</p>
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
      <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
        <div style={{ padding: '2rem' }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Contenuto della pagina</h1>
          <p style={{ color: '#6b7280' }}>
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
      <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
        <div style={{ padding: '2rem' }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Demo Interattiva</h1>
          <button
            onClick={() => setIsOpen(true)}
            style={{ padding: '0.5rem 1rem', backgroundColor: '#2563eb', color: 'white', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}
          >
            Apri Sidebar
          </button>
          <p style={{ marginTop: '1rem', color: '#6b7280' }}>
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
      <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
        <Story />
      </div>
    ),
  ],
};
