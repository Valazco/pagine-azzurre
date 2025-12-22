import type { Meta, StoryObj } from '@storybook/react';
import { Heart, Share2, ShoppingCart } from 'lucide-react';
import { Card } from './Card';
import { Button } from '../Button';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Componente Card flessibile con styled-components. Supporta varianti, sub-componenti e stati interattivi.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'outlined'],
      description: 'Stile visivo della card',
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
      description: 'Padding interno',
    },
    hoverable: {
      control: 'boolean',
      description: 'Abilita effetto hover',
    },
    clickable: {
      control: 'boolean',
      description: 'Rende la card cliccabile',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

// Basic cards
export const Default: Story = {
  args: {
    padding: 'md',
    children: 'Contenuto della card',
  },
};

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    padding: 'md',
    children: 'Card con ombra elevata',
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    padding: 'md',
    children: 'Card con bordo',
  },
};

// Interactive
export const Hoverable: Story = {
  args: {
    padding: 'md',
    hoverable: true,
    children: 'Passa il mouse sopra per vedere l\'effetto',
  },
};

export const Clickable: Story = {
  args: {
    padding: 'md',
    clickable: true,
    hoverable: true,
    onClick: () => alert('Card cliccata!'),
    children: 'Clicca su questa card',
  },
};

// With sub-components
export const WithHeaderAndContent: Story = {
  render: () => (
    <Card style={{ width: '320px' }}>
      <Card.Header>
        <Card.Title>Titolo della Card</Card.Title>
        <Card.Subtitle>Sottotitolo descrittivo</Card.Subtitle>
      </Card.Header>
      <Card.Content>
        <p style={{ margin: 0, color: '#6b7280' }}>
          Questo e il contenuto principale della card. Può contenere testo,
          immagini o altri componenti.
        </p>
      </Card.Content>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Card style={{ width: '320px' }}>
      <Card.Header>
        <Card.Title>Prodotto</Card.Title>
      </Card.Header>
      <Card.Content>
        <p style={{ margin: 0, color: '#6b7280' }}>
          Descrizione del prodotto con tutte le informazioni necessarie.
        </p>
      </Card.Content>
      <Card.Footer>
        <Button size="sm" variant="primary">
          Acquista
        </Button>
        <Button size="sm" variant="ghost">
          Dettagli
        </Button>
      </Card.Footer>
    </Card>
  ),
};

export const ProductCard: Story = {
  render: () => (
    <Card hoverable style={{ width: '280px' }}>
      <Card.Image>
        <div
          style={{
            width: '100%',
            height: '180px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '14px',
          }}
        >
          Immagine Prodotto
        </div>
      </Card.Image>
      <Card.Content>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h4 style={{ margin: '0 0 4px 0', fontWeight: 600 }}>Olio Extra Vergine</h4>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>Mario Shop</p>
          </div>
          <span style={{ fontWeight: 700, color: '#2563eb' }}>25 VAL</span>
        </div>
      </Card.Content>
      <Card.Footer>
        <Button size="sm" leftIcon={<ShoppingCart size={14} />} fullWidth>
          Aggiungi
        </Button>
        <Button size="sm" variant="ghost">
          <Heart size={14} />
        </Button>
        <Button size="sm" variant="ghost">
          <Share2 size={14} />
        </Button>
      </Card.Footer>
    </Card>
  ),
};

// Grid showcase
export const CardGrid: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', maxWidth: '900px' }}>
      {[1, 2, 3].map((i) => (
        <Card key={i} hoverable variant="elevated">
          <Card.Image>
            <div
              style={{
                width: '100%',
                height: '120px',
                background: `hsl(${i * 40 + 200}, 70%, 60%)`,
              }}
            />
          </Card.Image>
          <Card.Content>
            <h4 style={{ margin: '0 0 4px 0', fontWeight: 600 }}>Prodotto {i}</h4>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
              Descrizione breve del prodotto numero {i}.
            </p>
          </Card.Content>
        </Card>
      ))}
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// All variants showcase
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Card variant="default" padding="md" style={{ width: '200px' }}>
        <strong>Default</strong>
        <p style={{ margin: '8px 0 0', fontSize: '14px', color: '#6b7280' }}>
          Con bordo sottile
        </p>
      </Card>
      <Card variant="elevated" padding="md" style={{ width: '200px' }}>
        <strong>Elevated</strong>
        <p style={{ margin: '8px 0 0', fontSize: '14px', color: '#6b7280' }}>
          Con ombra
        </p>
      </Card>
      <Card variant="outlined" padding="md" style={{ width: '200px' }}>
        <strong>Outlined</strong>
        <p style={{ margin: '8px 0 0', fontSize: '14px', color: '#6b7280' }}>
          Con bordo spesso
        </p>
      </Card>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};
