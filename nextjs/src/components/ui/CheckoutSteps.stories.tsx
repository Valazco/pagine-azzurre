import type { Meta, StoryObj } from '@storybook/react';
import CheckoutSteps from './CheckoutSteps';

const meta: Meta<typeof CheckoutSteps> = {
  title: 'UI/CheckoutSteps',
  component: CheckoutSteps,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Indicatore di progresso per il flusso di checkout con 4 step: Sign-In, Spedizione, Pagamento, Conferma',
      },
    },
  },
  argTypes: {
    step1: {
      control: 'boolean',
      description: 'Step 1: Sign-In completato',
    },
    step2: {
      control: 'boolean',
      description: 'Step 2: Spedizione completato',
    },
    step3: {
      control: 'boolean',
      description: 'Step 3: Pagamento completato',
    },
    step4: {
      control: 'boolean',
      description: 'Step 4: Conferma completato',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100%', maxWidth: '48rem', padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CheckoutSteps>;

export const NoSteps: Story = {
  args: {
    step1: false,
    step2: false,
    step3: false,
    step4: false,
  },
};

export const Step1Active: Story = {
  args: {
    step1: true,
    step2: false,
    step3: false,
    step4: false,
  },
};

export const Step2Active: Story = {
  args: {
    step1: true,
    step2: true,
    step3: false,
    step4: false,
  },
};

export const Step3Active: Story = {
  args: {
    step1: true,
    step2: true,
    step3: true,
    step4: false,
  },
};

export const AllStepsComplete: Story = {
  args: {
    step1: true,
    step2: true,
    step3: true,
    step4: true,
  },
};

export const MobileView: Story = {
  args: {
    step1: true,
    step2: true,
    step3: false,
    step4: false,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const TabletView: Story = {
  args: {
    step1: true,
    step2: true,
    step3: true,
    step4: false,
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

export const AllStages: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Inizio checkout:</p>
        <CheckoutSteps step1={false} />
      </div>
      <div>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Dopo login:</p>
        <CheckoutSteps step1={true} />
      </div>
      <div>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Indirizzo inserito:</p>
        <CheckoutSteps step1={true} step2={true} />
      </div>
      <div>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Pagamento selezionato:</p>
        <CheckoutSteps step1={true} step2={true} step3={true} />
      </div>
      <div>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Ordine confermato:</p>
        <CheckoutSteps step1={true} step2={true} step3={true} step4={true} />
      </div>
    </div>
  ),
  decorators: [],
  parameters: {
    layout: 'padded',
  },
};
