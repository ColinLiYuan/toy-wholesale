'use client';

interface PaginationClientProps {
  currentPage: number;
  totalPages: number;
  category?: string;
}

export default function PaginationClient({ currentPage, totalPages, category }: PaginationClientProps) {
  const getPageUrl = (pageNum: number) => {
    const basePath = '/products';
    if (!category || category === 'all') {
      return pageNum === 0 ? basePath : `${basePath}?page=${pageNum}`;
    }
    return pageNum === 0 
      ? `${basePath}?category=${category}` 
      : `${basePath}?category=${category}&page=${pageNum}`;
  };

  const handlePrev = () => {
    const newPage = Math.max(0, currentPage - 1);
    if (newPage !== currentPage) {
      window.location.href = getPageUrl(newPage);
    }
  };

  const handleNext = () => {
    const newPage = Math.min(totalPages - 1, currentPage + 1);
    if (newPage !== currentPage) {
      window.location.href = getPageUrl(newPage);
    }
  };

  const handlePage = (page: number) => {
    if (page !== currentPage) {
      window.location.href = getPageUrl(page);
    }
  };

  const pagesToShow = [];
  for (let i = Math.max(0, currentPage - 2); i <= Math.min(totalPages - 1, currentPage + 2); i++) {
    pagesToShow.push(i);
  }

  return (
    <div className="mt-16 flex items-center justify-center space-x-4">
      <button
        onClick={handlePrev}
        disabled={currentPage === 0}
        className="px-6 py-3 rounded-lg border border-gray-300 text-text-primary hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Previous
      </button>

      <div className="flex items-center space-x-2">
        {pagesToShow.map((page) => (
          <button
            key={page}
            onClick={() => handlePage(page)}
            className={`w-10 h-10 rounded-lg font-medium transition-colors ${
              page === currentPage
                ? 'bg-brand text-white'
                : 'border border-gray-300 text-text-primary hover:bg-surface'
            }`}
          >
            {page + 1}
          </button>
        ))}
      </div>

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages - 1}
        className="px-6 py-3 rounded-lg border border-gray-300 text-text-primary hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Next
      </button>
    </div>
  );
}