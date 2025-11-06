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
    <div className="flex justify-center my-8">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
        <Link
          key={pageNum}
          href={`${basePath}/${pageNum}`}
          className={
            pageNum === currentPage
              ? 'p-4 mx-2 rounded-lg border border-[#a4a4a4] text-[1.6rem] font-bold'
              : 'p-4 mx-2 rounded-lg border border-[#a4a4a4] text-[1.6rem] hover:text-[#ff8000]'
          }
        >
          {pageNum}
        </Link>
      ))}
    </div>
  );
}
