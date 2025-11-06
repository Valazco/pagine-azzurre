import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath = '/pageNumber',
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav className="flex justify-center items-center gap-2 my-12" aria-label="Pagination">
      {/* Previous Button */}
      {currentPage > 1 && (
        <Link
          href={`${basePath}/${currentPage - 1}`}
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-600 transition-all"
          aria-label="Previous page"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
      )}

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
          // Show first, last, current, and adjacent pages
          const showPage =
            pageNum === 1 ||
            pageNum === totalPages ||
            (pageNum >= currentPage - 1 && pageNum <= currentPage + 1);

          // Show ellipsis
          const showEllipsis =
            (pageNum === currentPage - 2 && currentPage > 3) ||
            (pageNum === currentPage + 2 && currentPage < totalPages - 2);

          if (showEllipsis) {
            return (
              <span
                key={pageNum}
                className="flex items-center justify-center w-10 h-10 text-gray-400"
              >
                ...
              </span>
            );
          }

          if (!showPage) return null;

          return (
            <Link
              key={pageNum}
              href={`${basePath}/${pageNum}`}
              className={`
                flex items-center justify-center w-10 h-10 rounded-lg font-medium transition-all
                ${
                  pageNum === currentPage
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-500 hover:text-blue-600'
                }
              `}
              aria-label={`Page ${pageNum}`}
              aria-current={pageNum === currentPage ? 'page' : undefined}
            >
              {pageNum}
            </Link>
          );
        })}
      </div>

      {/* Next Button */}
      {currentPage < totalPages && (
        <Link
          href={`${basePath}/${currentPage + 1}`}
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-600 transition-all"
          aria-label="Next page"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </nav>
  );
}
