import type { Meta, StoryObj } from '@storybook/react';
import Product from './Product';
import type { Product as ProductType } from '@/types';

const meta: Meta<typeof Product> = {
  title: 'UI/Product',
  component: Product,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Card prodotto con immagine, rating, prezzi in Euro e VAL',
      },
    },
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Product>;

const baseProduct: ProductType = {
  _id: '123',
  name: 'Prodotto di esempio',
  image: ['/img-not-found.png'],
  category: 'Elettronica',
  description: 'Descrizione del prodotto',
  priceVal: 50,
  priceEuro: 25.99,
  countInStock: 10,
  rating: 4.5,
  numReviews: 28,
  section: 'offro',
  isService: false,
  pause: false,
  seller: {
    _id: 'seller1',
    seller: {
      name: 'Mario Rossi',
      rating: 4.8,
      numReviews: 150,
    },
  },
};

export const Default: Story = {
  args: {
    product: baseProduct,
  },
};

export const Service: Story = {
  args: {
    product: {
      ...baseProduct,
      _id: '124',
      name: 'Lezioni di Inglese',
      isService: true,
      priceEuro: 15.0,
      priceVal: 30,
      rating: 5,
      numReviews: 42,
    },
  },
};

export const Announcement: Story = {
  args: {
    product: {
      ...baseProduct,
      _id: '125',
      name: 'Cerco appartamento in centro',
      section: 'avviso',
      rating: 0,
      numReviews: 0,
    },
  },
};

export const Proposal: Story = {
  args: {
    product: {
      ...baseProduct,
      _id: '126',
      name: 'Propongo scambio libri usati',
      section: 'propongo',
      rating: 3.5,
      numReviews: 5,
    },
  },
};

export const Gift: Story = {
  args: {
    product: {
      ...baseProduct,
      _id: '127',
      name: 'Regalo vestiti bambino 3-4 anni',
      section: 'dono',
      isGift: true,
      priceEuro: 0,
      priceVal: 0,
      rating: 4,
      numReviews: 12,
    },
  },
};

export const LongTitle: Story = {
  args: {
    product: {
      ...baseProduct,
      _id: '128',
      name: 'Questo è un titolo molto lungo che dovrebbe essere troncato dopo due righe per mantenere il layout uniforme',
    },
  },
};

export const NoReviews: Story = {
  args: {
    product: {
      ...baseProduct,
      _id: '129',
      name: 'Prodotto nuovo senza recensioni',
      rating: 0,
      numReviews: 0,
    },
  },
};

export const HighPrice: Story = {
  args: {
    product: {
      ...baseProduct,
      _id: '130',
      name: 'MacBook Pro 16"',
      priceEuro: 2499.99,
      priceVal: 5000,
      rating: 4.9,
      numReviews: 234,
    },
  },
};

export const ProductGrid: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 max-w-5xl">
      <Product product={baseProduct} />
      <Product
        product={{
          ...baseProduct,
          _id: '131',
          name: 'Servizio di riparazione PC',
          isService: true,
          priceEuro: 40,
          priceVal: 80,
        }}
      />
      <Product
        product={{
          ...baseProduct,
          _id: '132',
          name: 'Bicicletta vintage',
          priceEuro: 150,
          priceVal: 300,
          rating: 5,
        }}
      />
      <Product
        product={{
          ...baseProduct,
          _id: '133',
          name: 'Regalo: libri usati',
          section: 'dono',
        }}
      />
      <Product
        product={{
          ...baseProduct,
          _id: '134',
          name: 'Proposta collaborazione',
          section: 'propongo',
        }}
      />
      <Product
        product={{
          ...baseProduct,
          _id: '135',
          name: 'Avviso: cercasi aiuto',
          section: 'avviso',
        }}
      />
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};
