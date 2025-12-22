'use client';

import { RatingContainer, StarsContainer, Star, Caption } from './Rating.styles';

interface RatingProps {
  rating: number;
  numReviews?: number;
  caption?: string;
}

export function Rating({ rating, numReviews, caption }: RatingProps) {
  const renderStar = (position: number) => {
    if (rating >= position) {
      return '★'; // Full star
    } else if (rating >= position - 0.5) {
      return '⯨'; // Half star
    } else {
      return '☆'; // Empty star
    }
  };

  return (
    <RatingContainer>
      <StarsContainer>
        {[1, 2, 3, 4, 5].map((position) => (
          <Star key={position}>{renderStar(position)}</Star>
        ))}
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
