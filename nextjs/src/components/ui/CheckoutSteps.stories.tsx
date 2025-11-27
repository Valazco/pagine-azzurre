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
      <div className="w-full max-w-3xl p-4">
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
    <div className="space-y-8">
      <div>
        <p className="text-sm text-gray-500 mb-2">Inizio checkout:</p>
        <CheckoutSteps step1={false} />
      </div>
      <div>
        <p className="text-sm text-gray-500 mb-2">Dopo login:</p>
        <CheckoutSteps step1={true} />
      </div>
      <div>
        <p className="text-sm text-gray-500 mb-2">Indirizzo inserito:</p>
        <CheckoutSteps step1={true} step2={true} />
      </div>
      <div>
        <p className="text-sm text-gray-500 mb-2">Pagamento selezionato:</p>
        <CheckoutSteps step1={true} step2={true} step3={true} />
      </div>
      <div>
        <p className="text-sm text-gray-500 mb-2">Ordine confermato:</p>
        <CheckoutSteps step1={true} step2={true} step3={true} step4={true} />
      </div>
    </div>
  ),
  decorators: [],
  parameters: {
    layout: 'padded',
  },
};
