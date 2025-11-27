import type { Meta, StoryObj } from '@storybook/react';
import Rating from './Rating';

const meta: Meta<typeof Rating> = {
  title: 'UI/Rating',
  component: Rating,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Componente per visualizzare valutazioni con stelle (supporta mezze stelle)',
      },
    },
  },
  argTypes: {
    rating: {
      control: { type: 'range', min: 0, max: 5, step: 0.5 },
      description: 'Valore della valutazione (0-5)',
    },
    numReviews: {
      control: 'number',
      description: 'Numero di recensioni',
    },
    caption: {
      control: 'text',
      description: 'Testo personalizzato (sostituisce numReviews)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Rating>;

export const FiveStars: Story = {
  args: {
    rating: 5,
    numReviews: 150,
  },
};

export const FourAndHalf: Story = {
  args: {
    rating: 4.5,
    numReviews: 89,
  },
};

export const ThreeStars: Story = {
  args: {
    rating: 3,
    numReviews: 42,
  },
};

export const OneAndHalf: Story = {
  args: {
    rating: 1.5,
    numReviews: 5,
  },
};

export const ZeroStars: Story = {
  args: {
    rating: 0,
    numReviews: 0,
  },
};

export const SingleReview: Story = {
  args: {
    rating: 4,
    numReviews: 1,
  },
};

export const WithCaption: Story = {
  args: {
    rating: 4.5,
    caption: 'Eccellente',
  },
};

export const NoReviewsShown: Story = {
  args: {
    rating: 3.5,
  },
};

export const AllRatings: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="w-8 text-sm text-gray-600">5.0</span>
        <Rating rating={5} numReviews={100} />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-8 text-sm text-gray-600">4.5</span>
        <Rating rating={4.5} numReviews={75} />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-8 text-sm text-gray-600">4.0</span>
        <Rating rating={4} numReviews={50} />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-8 text-sm text-gray-600">3.5</span>
        <Rating rating={3.5} numReviews={30} />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-8 text-sm text-gray-600">3.0</span>
        <Rating rating={3} numReviews={20} />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-8 text-sm text-gray-600">2.5</span>
        <Rating rating={2.5} numReviews={10} />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-8 text-sm text-gray-600">2.0</span>
        <Rating rating={2} numReviews={5} />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-8 text-sm text-gray-600">1.5</span>
        <Rating rating={1.5} numReviews={3} />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-8 text-sm text-gray-600">1.0</span>
        <Rating rating={1} numReviews={2} />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-8 text-sm text-gray-600">0.5</span>
        <Rating rating={0.5} numReviews={1} />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-8 text-sm text-gray-600">0.0</span>
        <Rating rating={0} numReviews={0} />
      </div>
    </div>
  ),
};
