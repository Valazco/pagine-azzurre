'use client';

import {
  PaginationNav,
  PageNumbersContainer,
  NavButton,
  PageLink,
  Ellipsis,
} from './Pagination.styles';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  basePath = '/pageNumber',
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <PaginationNav aria-label="Pagination">
      {/* Previous Button */}
      {currentPage > 1 && (
        <NavButton
          href={`${basePath}/${currentPage - 1}`}
          aria-label="Previous page"
        >
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </NavButton>
      )}

      {/* Page Numbers */}
      <PageNumbersContainer>
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
            return <Ellipsis key={pageNum}>...</Ellipsis>;
          }

          if (!showPage) return null;

          return (
            <PageLink
              key={pageNum}
              href={`${basePath}/${pageNum}`}
              $isActive={pageNum === currentPage}
              aria-label={`Page ${pageNum}`}
              aria-current={pageNum === currentPage ? 'page' : undefined}
            >
              {pageNum}
            </PageLink>
          );
        })}
      </PageNumbersContainer>

      {/* Next Button */}
      {currentPage < totalPages && (
        <NavButton
          href={`${basePath}/${currentPage + 1}`}
          aria-label="Next page"
        >
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </NavButton>
      )}
    </PaginationNav>
  );
}

export default Pagination;
