interface RatingProps {
  rating: number;
  numReviews?: number;
  caption?: string;
}

export default function Rating({ rating, numReviews, caption }: RatingProps) {
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
    <div className="flex items-center gap-2">
      <div className="flex text-yellow-500 text-xl">
        {[1, 2, 3, 4, 5].map((position) => (
          <span key={position}>{renderStar(position)}</span>
        ))}
      </div>
      {caption ? (
        <span className="text-gray-600">{caption}</span>
      ) : (
        numReviews !== undefined && (
          <span className="text-gray-600 text-sm">
            {numReviews} {numReviews === 1 ? 'review' : 'reviews'}
          </span>
        )
      )}
    </div>
  );
}
