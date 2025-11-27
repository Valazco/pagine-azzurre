import type { Meta, StoryObj } from '@storybook/react';
import MessageBox from './MessageBox';

const meta: Meta<typeof MessageBox> = {
  title: 'UI/MessageBox',
  component: MessageBox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Box per messaggi con diverse varianti di stile (info, success, warning, danger, alert)',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'success', 'warning', 'danger', 'alert'],
      description: 'Stile visuale del messaggio',
    },
    children: {
      control: 'text',
      description: 'Contenuto del messaggio',
    },
  },
};

export default meta;
type Story = StoryObj<typeof MessageBox>;

export const Info: Story = {
  args: {
    variant: 'info',
    children: 'Questo è un messaggio informativo.',
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

export const WithLongContent: Story = {
  args: {
    variant: 'info',
    children: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
  },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
};

export const WithHTML: Story = {
  args: {
    variant: 'warning',
    children: (
      <div>
        <strong>Attenzione!</strong>
        <ul className="mt-2 list-disc list-inside">
          <li>Punto uno da verificare</li>
          <li>Punto due importante</li>
          <li>Punto tre critico</li>
        </ul>
      </div>
    ),
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4 w-96">
      <MessageBox variant="info">Info: Messaggio informativo</MessageBox>
      <MessageBox variant="success">Success: Operazione riuscita</MessageBox>
      <MessageBox variant="warning">Warning: Attenzione</MessageBox>
      <MessageBox variant="danger">Danger: Errore critico</MessageBox>
      <MessageBox variant="alert">Alert: Avviso importante</MessageBox>
    </div>
  ),
};
