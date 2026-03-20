import type { Meta, StoryObj } from '@storybook/react';
import { MessageBox } from './MessageBox';

const meta: Meta<typeof MessageBox> = {
  title: 'UI/MessageBox',
  component: MessageBox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Componente MessageBox con styled-components. Supporta 5 varianti e opzioni di centratura.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'success', 'warning', 'danger', 'alert'],
      description: 'Stile visuale del messaggio',
    },
    centered: {
      control: 'boolean',
      description: 'Centra il testo e il box nel contenitore',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Espande il box a larghezza completa',
    },
    children: {
      control: 'text',
      description: 'Contenuto del messaggio',
    },
  },
};

export default meta;
type Story = StoryObj<typeof MessageBox>;

// Basic variants
export const Info: Story = {
  args: {
    variant: 'info',
    children: 'Questo e un messaggio informativo.',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Operazione completata con successo!',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Attenzione: verifica i dati inseriti.',
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Errore: impossibile completare l\'operazione.',
  },
};

export const Alert: Story = {
  args: {
    variant: 'alert',
    children: 'Avviso importante da leggere.',
  },
};

// Centered (default)
export const Centered: Story = {
  args: {
    variant: 'info',
    centered: true,
    children: 'Messaggio centrato nel contenitore',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px', border: '1px dashed #ccc', padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],
};

// Not centered
export const NotCentered: Story = {
  args: {
    variant: 'info',
    centered: false,
    children: 'Messaggio allineato a sinistra',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px', border: '1px dashed #ccc', padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],
};

// Full width
export const FullWidth: Story = {
  args: {
    variant: 'success',
    fullWidth: true,
    children: 'Messaggio a larghezza completa',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '500px' }}>
        <Story />
      </div>
    ),
  ],
};

// Compact (fit content - default)
export const Compact: Story = {
  args: {
    variant: 'info',
    fullWidth: false,
    children: 'Testo compatto',
  },
};

// All variants showcase
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
      <MessageBox variant="info">Info: Messaggio informativo</MessageBox>
      <MessageBox variant="success">Success: Operazione riuscita</MessageBox>
      <MessageBox variant="warning">Warning: Attenzione</MessageBox>
      <MessageBox variant="danger">Danger: Errore critico</MessageBox>
      <MessageBox variant="alert">Alert: Avviso importante</MessageBox>
    </div>
  ),
};

// Comparison: fit-content vs full-width
export const WidthComparison: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '400px' }}>
      <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>Fit content (default):</p>
      <MessageBox variant="info">Testo corto</MessageBox>

      <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>Full width:</p>
      <MessageBox variant="info" fullWidth>Testo corto</MessageBox>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// With longer content
export const LongContent: Story = {
  args: {
    variant: 'warning',
    children: 'Questo messaggio contiene un testo piu lungo per mostrare come il componente gestisce il contenuto esteso mantenendo la centratura.',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '500px' }}>
        <Story />
      </div>
    ),
  ],
};
