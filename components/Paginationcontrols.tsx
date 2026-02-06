import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onGoToPage: (page: number) => void;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPrevPage,
  onNextPage,
  onGoToPage,
}: PaginationControlsProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between gap-4 mt-6 p-4 bg-white rounded-xl border border-slate-200">
      <div className="text-sm text-slate-600">
        Mostrando <span className="font-semibold">{startItem}-{endItem}</span> de{' '}
        <span className="font-semibold">{totalItems}</span> registros
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onPrevPage}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((page) => {
              const distance = Math.abs(page - currentPage);
              return distance <= 2 || page === 1 || page === totalPages;
            })
            .map((page, index, arr) => {
              const prevPage = arr[index - 1];
              const showDots = prevPage && page - prevPage > 1;

              return (
                <React.Fragment key={page}>
                  {showDots && <span className="px-2 text-slate-400">...</span>}
                  <button
                    onClick={() => onGoToPage(page)}
                    className={`w-10 h-10 rounded-lg font-medium transition ${
                      currentPage === page
                        ? 'bg-indigo-600 text-white'
                        : 'border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {page}
                  </button>
                </React.Fragment>
              );
            })}
        </div>

        <button
          onClick={onNextPage}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <span className="text-sm text-slate-600 font-semibold">
        Página {currentPage} de {totalPages}
      </span>
    </div>
  );
}