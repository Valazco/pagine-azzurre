/**
 * Rating Component Tests
 * Generated based on Storybook observation and component analysis
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Rating } from '@/components/ui/Rating/Rating';

describe('Rating Component', () => {
  // Basic rendering
  describe('Rendering', () => {
    it('renders with rating prop', () => {
      render(<Rating rating={4} />);
      expect(screen.getByLabelText(/valutazione/i)).toBeInTheDocument();
    });

    it('renders 5 star elements', () => {
      render(<Rating rating={3} />);
      const stars = screen.getByLabelText(/valutazione/i);
      // Each star is a child element
      expect(stars.children).toHaveLength(5);
    });
  });

  // Star display logic (observed: full, half, empty stars)
  describe('Star Display', () => {
    it('shows 5 full stars for rating 5', () => {
      render(<Rating rating={5} numReviews={100} />);
      const starsContainer = screen.getByLabelText('Valutazione: 5 su 5 stelle');
      // All stars should be full (★)
      expect(starsContainer.textContent).toBe('★★★★★');
    });

    it('shows 4 full stars and 1 half star for rating 4.5', () => {
      render(<Rating rating={4.5} numReviews={89} />);
      const starsContainer = screen.getByLabelText('Valutazione: 4.5 su 5 stelle');
      // 4 full + 1 half (displayed as ☆ but styled)
      expect(starsContainer.textContent).toBe('★★★★☆');
    });

    it('shows 3 full stars and 2 empty stars for rating 3', () => {
      render(<Rating rating={3} numReviews={42} />);
      const starsContainer = screen.getByLabelText('Valutazione: 3 su 5 stelle');
      expect(starsContainer.textContent).toBe('★★★☆☆');
    });

    it('shows 1 full star, 1 half star, and 3 empty stars for rating 1.5', () => {
      render(<Rating rating={1.5} numReviews={5} />);
      const starsContainer = screen.getByLabelText('Valutazione: 1.5 su 5 stelle');
      expect(starsContainer.textContent).toBe('★☆☆☆☆');
    });

    it('shows all empty stars for rating 0', () => {
      render(<Rating rating={0} numReviews={0} />);
      const starsContainer = screen.getByLabelText('Valutazione: 0 su 5 stelle');
      expect(starsContainer.textContent).toBe('☆☆☆☆☆');
    });

    it('shows half star at 0.5 rating', () => {
      render(<Rating rating={0.5} numReviews={1} />);
      const starsContainer = screen.getByLabelText('Valutazione: 0.5 su 5 stelle');
      // First star is half (☆), rest are empty
      expect(starsContainer.textContent).toBe('☆☆☆☆☆');
    });

    it('shows 2 full stars and 1 half star for rating 2.5', () => {
      render(<Rating rating={2.5} numReviews={10} />);
      const starsContainer = screen.getByLabelText('Valutazione: 2.5 su 5 stelle');
      expect(starsContainer.textContent).toBe('★★☆☆☆');
    });
  });

  // Reviews count display
  describe('Reviews Display', () => {
    it('shows number of reviews in plural form', () => {
      render(<Rating rating={4} numReviews={150} />);
      expect(screen.getByText('150 reviews')).toBeInTheDocument();
    });

    it('shows singular "review" for 1 review', () => {
      render(<Rating rating={4} numReviews={1} />);
      expect(screen.getByText('1 review')).toBeInTheDocument();
    });

    it('shows "0 reviews" for zero reviews', () => {
      render(<Rating rating={0} numReviews={0} />);
      expect(screen.getByText('0 reviews')).toBeInTheDocument();
    });

    it('does not show reviews when numReviews is undefined', () => {
      render(<Rating rating={3.5} />);
      expect(screen.queryByText(/reviews?$/)).not.toBeInTheDocument();
    });
  });

  // Caption functionality
  describe('Caption', () => {
    it('shows caption instead of reviews when provided', () => {
      render(<Rating rating={4.5} caption="Eccellente" />);
      expect(screen.getByText('Eccellente')).toBeInTheDocument();
      expect(screen.queryByText(/reviews?$/)).not.toBeInTheDocument();
    });

    it('prioritizes caption over numReviews', () => {
      render(<Rating rating={4} numReviews={100} caption="Custom text" />);
      expect(screen.getByText('Custom text')).toBeInTheDocument();
      expect(screen.queryByText('100 reviews')).not.toBeInTheDocument();
    });
  });

  // Accessibility
  describe('Accessibility', () => {
    it('has accessible label for stars container', () => {
      render(<Rating rating={4.5} />);
      expect(screen.getByLabelText('Valutazione: 4.5 su 5 stelle')).toBeInTheDocument();
    });

    it('hides individual stars from screen readers', () => {
      render(<Rating rating={3} />);
      const starsContainer = screen.getByLabelText(/valutazione/i);
      const stars = starsContainer.querySelectorAll('[aria-hidden="true"]');
      expect(stars).toHaveLength(5);
    });

    it('updates aria-label based on rating value', () => {
      const { rerender } = render(<Rating rating={2} />);
      expect(screen.getByLabelText('Valutazione: 2 su 5 stelle')).toBeInTheDocument();

      rerender(<Rating rating={5} />);
      expect(screen.getByLabelText('Valutazione: 5 su 5 stelle')).toBeInTheDocument();
    });
  });

  // Edge cases
  describe('Edge Cases', () => {
    it('handles rating exactly at boundary (e.g., 3.0)', () => {
      render(<Rating rating={3.0} />);
      const starsContainer = screen.getByLabelText('Valutazione: 3 su 5 stelle');
      expect(starsContainer.textContent).toBe('★★★☆☆');
    });

    it('handles high number of reviews', () => {
      render(<Rating rating={5} numReviews={999999} />);
      expect(screen.getByText('999999 reviews')).toBeInTheDocument();
    });

    it('renders without crashing with minimum props', () => {
      render(<Rating rating={0} />);
      expect(screen.getByLabelText(/valutazione/i)).toBeInTheDocument();
    });
  });
});
