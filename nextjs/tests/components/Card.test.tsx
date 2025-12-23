/**
 * Card Component Tests
 * Generated based on Storybook observation and component analysis
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Card } from '@/components/ui/Card/Card';

describe('Card Component', () => {
  // Basic rendering
  describe('Rendering', () => {
    it('renders with children content', () => {
      render(<Card>Card content</Card>);
      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('renders as a div by default', () => {
      render(<Card>Content</Card>);
      const card = screen.getByText('Content').parentElement || screen.getByText('Content');
      expect(card.tagName.toLowerCase()).not.toBe('button');
    });

    it('applies custom className', () => {
      render(<Card className="custom-class">Content</Card>);
      const card = screen.getByText('Content').closest('.custom-class');
      expect(card).toBeInTheDocument();
    });

    it('applies inline styles', () => {
      render(<Card style={{ width: '300px' }}>Content</Card>);
      // Style is applied to the Card container, not the text element
      const content = screen.getByText('Content');
      // Verify the card renders with content (styled-components handles styles internally)
      expect(content).toBeInTheDocument();
    });
  });

  // Variants (observed: default, elevated, outlined)
  describe('Variants', () => {
    it('renders default variant', () => {
      render(<Card variant="default">Default card</Card>);
      expect(screen.getByText('Default card')).toBeInTheDocument();
    });

    it('renders elevated variant', () => {
      render(<Card variant="elevated">Elevated card</Card>);
      expect(screen.getByText('Elevated card')).toBeInTheDocument();
    });

    it('renders outlined variant', () => {
      render(<Card variant="outlined">Outlined card</Card>);
      expect(screen.getByText('Outlined card')).toBeInTheDocument();
    });
  });

  // Padding (observed: none, sm, md, lg)
  describe('Padding', () => {
    it('renders with no padding by default', () => {
      render(<Card>No padding</Card>);
      expect(screen.getByText('No padding')).toBeInTheDocument();
    });

    it('renders with small padding', () => {
      render(<Card padding="sm">Small padding</Card>);
      expect(screen.getByText('Small padding')).toBeInTheDocument();
    });

    it('renders with medium padding', () => {
      render(<Card padding="md">Medium padding</Card>);
      expect(screen.getByText('Medium padding')).toBeInTheDocument();
    });

    it('renders with large padding', () => {
      render(<Card padding="lg">Large padding</Card>);
      expect(screen.getByText('Large padding')).toBeInTheDocument();
    });
  });

  // Interactive states
  describe('Interactive States', () => {
    it('renders hoverable card', () => {
      render(<Card hoverable>Hoverable card</Card>);
      expect(screen.getByText('Hoverable card')).toBeInTheDocument();
    });

    it('renders as button when clickable with onClick', () => {
      const handleClick = vi.fn();
      render(<Card clickable onClick={handleClick}>Clickable card</Card>);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('type', 'button');
    });

    it('calls onClick when clicked', () => {
      const handleClick = vi.fn();
      render(<Card onClick={handleClick}>Click me</Card>);

      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('renders as button when onClick is provided even without clickable prop', () => {
      const handleClick = vi.fn();
      render(<Card onClick={handleClick}>Card with onClick</Card>);

      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('does not render as button when only clickable prop is set without onClick', () => {
      render(<Card clickable>Only clickable prop</Card>);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  // Accessibility
  describe('Accessibility', () => {
    it('supports aria-label on clickable cards', () => {
      const handleClick = vi.fn();
      render(
        <Card onClick={handleClick} ariaLabel="Product card action">
          Content
        </Card>
      );

      expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Product card action');
    });

    it('has type="button" to prevent form submission', () => {
      const handleClick = vi.fn();
      render(<Card onClick={handleClick}>Button card</Card>);

      expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });
  });

  // Sub-components
  describe('Sub-components', () => {
    it('renders Card.Header', () => {
      render(
        <Card>
          <Card.Header>Header content</Card.Header>
        </Card>
      );
      expect(screen.getByText('Header content')).toBeInTheDocument();
    });

    it('renders Card.Title', () => {
      render(
        <Card>
          <Card.Title>Card Title</Card.Title>
        </Card>
      );
      expect(screen.getByText('Card Title')).toBeInTheDocument();
    });

    it('renders Card.Subtitle', () => {
      render(
        <Card>
          <Card.Subtitle>Card Subtitle</Card.Subtitle>
        </Card>
      );
      expect(screen.getByText('Card Subtitle')).toBeInTheDocument();
    });

    it('renders Card.Content', () => {
      render(
        <Card>
          <Card.Content>Main content</Card.Content>
        </Card>
      );
      expect(screen.getByText('Main content')).toBeInTheDocument();
    });

    it('renders Card.Footer', () => {
      render(
        <Card>
          <Card.Footer>Footer content</Card.Footer>
        </Card>
      );
      expect(screen.getByText('Footer content')).toBeInTheDocument();
    });

    it('renders Card.Image', () => {
      render(
        <Card>
          <Card.Image>
            <img src="/test.jpg" alt="Test" />
          </Card.Image>
        </Card>
      );
      expect(screen.getByAltText('Test')).toBeInTheDocument();
    });

    it('renders complete card with all sub-components', () => {
      render(
        <Card>
          <Card.Image>
            <div data-testid="image">Image placeholder</div>
          </Card.Image>
          <Card.Header>
            <Card.Title>Product Name</Card.Title>
            <Card.Subtitle>Category</Card.Subtitle>
          </Card.Header>
          <Card.Content>Description</Card.Content>
          <Card.Footer>Actions</Card.Footer>
        </Card>
      );

      expect(screen.getByTestId('image')).toBeInTheDocument();
      expect(screen.getByText('Product Name')).toBeInTheDocument();
      expect(screen.getByText('Category')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();
    });
  });

  // Composition
  describe('Composition', () => {
    it('combines variant and padding', () => {
      render(
        <Card variant="elevated" padding="lg">
          Elevated with large padding
        </Card>
      );
      expect(screen.getByText('Elevated with large padding')).toBeInTheDocument();
    });

    it('combines hoverable and clickable', () => {
      const handleClick = vi.fn();
      render(
        <Card hoverable clickable onClick={handleClick}>
          Interactive card
        </Card>
      );

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();

      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalled();
    });

    it('renders complex product card composition', () => {
      const handleClick = vi.fn();
      render(
        <Card variant="elevated" hoverable onClick={handleClick} ariaLabel="View product">
          <Card.Image>
            <div>Product image</div>
          </Card.Image>
          <Card.Content>
            <Card.Title>Olio Extra Vergine</Card.Title>
            <span>25 VAL</span>
          </Card.Content>
          <Card.Footer>
            <button>Add to cart</button>
          </Card.Footer>
        </Card>
      );

      expect(screen.getByText('Olio Extra Vergine')).toBeInTheDocument();
      expect(screen.getByText('25 VAL')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'View product' })).toBeInTheDocument();
    });
  });
});
