'use client';

import { RatingContainer, StarsContainer, Star, Caption } from './Rating.styles';

interface RatingProps {
  rating: number;
  numReviews?: number;
  caption?: string;
}

export function Rating({ rating, numReviews, caption }: RatingProps) {
  const getStarType = (position: number): 'full' | 'half' | 'empty' => {
    if (rating >= position) {
      return 'full';
    } else if (rating >= position - 0.5) {
      return 'half';
    } else {
      return 'empty';
    }
  };

  return (
    <RatingContainer>
      <StarsContainer aria-label={`Valutazione: ${rating} su 5 stelle`}>
        {[1, 2, 3, 4, 5].map((position) => {
          const type = getStarType(position);
          return (
            <Star key={position} $type={type} aria-hidden="true">
              {type === 'half' ? '☆' : type === 'full' ? '★' : '☆'}
            </Star>
          );
        })}
      </StarsContainer>
      {caption ? (
        <Caption>{caption}</Caption>
      ) : (
        numReviews !== undefined && (
          <Caption>
            {numReviews} {numReviews === 1 ? 'review' : 'reviews'}
          </Caption>
        )
      )}
    </RatingContainer>
  );
}

export default Rating;
