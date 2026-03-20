import type { Meta, StoryObj } from '@storybook/react';
import CartItem from './CartItem';
import type { CartItem as CartItemType } from '@/types';

const meta: Meta<typeof CartItem> = {
  title: 'UI/CartItem',
  component: CartItem,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Elemento del carrello con immagine, prezzi, selettore quantità e pulsante elimina',
      },
    },
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <ul style={{ width: '100%', maxWidth: '42rem', listStyle: 'none', padding: 0, margin: 0 }}>
        <Story />
      </ul>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CartItem>;

const baseItem: CartItemType = {
  product: 'prod-123',
  name: 'Prodotto di esempio nel carrello',
  image: '/img-not-found.png',
  price: 29.99,
  priceVal: 60,
  countInStock: 10,
  qty: 2,
  seller: 'seller-1',
};

export const Default: Story = {
  args: {
    item: baseItem,
  },
};

export const SingleQuantity: Story = {
  args: {
    item: {
      ...baseItem,
      qty: 1,
    },
  },
};

export const LowStock: Story = {
  args: {
    item: {
      ...baseItem,
      countInStock: 3,
      qty: 2,
    },
  },
};

export const LongProductName: Story = {
  args: {
    item: {
      ...baseItem,
      name: 'Questo è un nome di prodotto molto lungo che dovrebbe essere troncato o andare a capo per mantenere il layout',
    },
  },
};

export const HighPriceItem: Story = {
  args: {
    item: {
      ...baseItem,
      name: 'MacBook Pro 16" M3 Max',
      price: 3499.99,
      priceVal: 7000,
      qty: 1,
    },
  },
};

export const MultipleItems: Story = {
  render: () => (
    <ul style={{ width: '100%', maxWidth: '42rem', display: 'flex', flexDirection: 'column', gap: '1rem', listStyle: 'none', padding: 0, margin: 0 }}>
      <CartItem
        item={{
          ...baseItem,
          product: 'prod-1',
          name: 'Primo prodotto',
          price: 19.99,
          priceVal: 40,
          qty: 1,
        }}
      />
      <CartItem
        item={{
          ...baseItem,
          product: 'prod-2',
          name: 'Secondo prodotto con nome lungo',
          price: 49.99,
          priceVal: 100,
          qty: 3,
        }}
      />
      <CartItem
        item={{
          ...baseItem,
          product: 'prod-3',
          name: 'Terzo prodotto',
          price: 9.99,
          priceVal: 20,
          qty: 2,
          countInStock: 5,
        }}
      />
    </ul>
  ),
  decorators: [],
};

export const MobileView: Story = {
  args: {
    item: baseItem,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
