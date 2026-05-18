'use client';

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function BlogPagination({ currentPage, totalPages }: BlogPaginationProps) {
  return (
    <div className="flex items-center justify-center gap-4 mt-12">
      <button
        onClick={() => {
          const newPage = Math.max(0, currentPage - 1);
          window.location.href = newPage === 0 ? '/blog' : `/blog?page=${newPage}`;
        }}
        disabled={currentPage === 0}
        className="px-6 py-3 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F8F9FA] transition-all text-[#1A1A1A]"
      >
        Previous
      </button>
      <span className="text-[#6C757D]">
        Page {currentPage + 1} of {totalPages}
      </span>
      <button
        onClick={() => {
          const newPage = currentPage + 1;
          window.location.href = `/blog?page=${newPage}`;
        }}
        disabled={currentPage >= totalPages - 1}
        className="px-6 py-3 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F8F9FA] transition-all text-[#1A1A1A]"
      >
        Next
      </button>
    </div>
  );
}
