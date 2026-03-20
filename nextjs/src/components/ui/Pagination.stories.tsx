import type { Meta, StoryObj } from '@storybook/react';
import Pagination from './Pagination';

const meta: Meta<typeof Pagination> = {
  title: 'UI/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Componente di paginazione con navigazione e ellissi per molte pagine',
      },
    },
    nextjs: {
      appDirectory: true,
    },
  },
  argTypes: {
    currentPage: {
      control: { type: 'number', min: 1 },
      description: 'Pagina corrente',
    },
    totalPages: {
      control: { type: 'number', min: 1 },
      description: 'Numero totale di pagine',
    },
    basePath: {
      control: 'text',
      description: 'Percorso base per i link',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const FewPages: Story = {
  args: {
    currentPage: 2,
    totalPages: 5,
    basePath: '/products/page',
  },
};

export const FirstPage: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    basePath: '/products/page',
  },
};

export const MiddlePage: Story = {
  args: {
    currentPage: 5,
    totalPages: 10,
    basePath: '/products/page',
  },
};

export const LastPage: Story = {
  args: {
    currentPage: 10,
    totalPages: 10,
    basePath: '/products/page',
  },
};

export const ManyPages: Story = {
  args: {
    currentPage: 15,
    totalPages: 50,
    basePath: '/products/page',
  },
};

export const SinglePage: Story = {
  args: {
    currentPage: 1,
    totalPages: 1,
    basePath: '/products/page',
  },
};

export const TwoPages: Story = {
  args: {
    currentPage: 1,
    totalPages: 2,
    basePath: '/products/page',
  },
};

export const NearEnd: Story = {
  args: {
    currentPage: 48,
    totalPages: 50,
    basePath: '/search/results',
  },
};
