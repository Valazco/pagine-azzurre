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
    <div className="flex items-center justify-center gap-2 mt-8">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
        <Link
          key={pageNum}
          href={`${basePath}/${pageNum}`}
          className={`
            px-4 py-2 rounded-lg font-medium transition-colors
            ${
              pageNum === currentPage
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-300'
            }
          `}
        >
          {pageNum}
        </Link>
      ))}
    </div>
  );
}
