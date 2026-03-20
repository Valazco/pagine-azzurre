import type { Meta, StoryObj } from '@storybook/react';
import { ShoppingCart, ArrowRight, Heart, Trash2, Mail } from 'lucide-react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Componente Button con styled-components. Supporta varianti, dimensioni, icone e stato di caricamento.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
      description: 'Stile visivo del bottone',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Dimensione del bottone',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Rende il bottone largo quanto il contenitore',
    },
    isLoading: {
      control: 'boolean',
      description: 'Mostra spinner di caricamento',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabilita il bottone',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// Base stories
export const Primary: Story = {
  args: {
    children: 'Bottone Primario',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Bottone Secondario',
    variant: 'secondary',
  },
};

export const Outline: Story = {
  args: {
    children: 'Bottone Outline',
    variant: 'outline',
  },
};

export const Ghost: Story = {
  args: {
    children: 'Bottone Ghost',
    variant: 'ghost',
  },
};

export const Danger: Story = {
  args: {
    children: 'Elimina',
    variant: 'danger',
  },
};

// Sizes
export const Small: Story = {
  args: {
    children: 'Piccolo',
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    children: 'Medio',
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    children: 'Grande',
    size: 'lg',
  },
};

// States
export const Loading: Story = {
  args: {
    children: 'Caricamento...',
    isLoading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabilitato',
    disabled: true,
  },
};

// With icons
export const WithLeftIcon: Story = {
  args: {
    children: 'Aggiungi al Carrello',
    leftIcon: <ShoppingCart size={16} />,
  },
};

export const WithRightIcon: Story = {
  args: {
    children: 'Continua',
    rightIcon: <ArrowRight size={16} />,
  },
};

export const WithBothIcons: Story = {
  args: {
    children: 'Mi Piace',
    leftIcon: <Heart size={16} />,
    rightIcon: <span>42</span>,
    variant: 'outline',
  },
};

export const IconOnlySmall: Story = {
  args: {
    children: <Trash2 size={14} />,
    variant: 'danger',
    size: 'sm',
    'aria-label': 'Elimina',
  },
};

// Full width
export const FullWidth: Story = {
  args: {
    children: 'Bottone Full Width',
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
};

// Showcase all variants
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
      </div>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </div>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Button leftIcon={<Mail size={16} />}>Con Icona</Button>
        <Button isLoading>Loading</Button>
        <Button disabled>Disabled</Button>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};
