"use client";

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import type { FuelSearchPaginationProps } from './types';

// Client-only pagination controls that update URL params.
export default function FuelSearchPagination({
  currentPage,
  totalPages,
  searchTerm,
  makeFilter,
  yearFilter,
}: FuelSearchPaginationProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  if (totalPages <= 1) {
    return null;
  }

  const buildHref = (page: number) => {
    const params = new URLSearchParams();

    if (searchTerm) params.set('q', searchTerm);
    if (makeFilter) params.set('make', makeFilter);
    if (yearFilter) params.set('year', yearFilter);
    if (page > 1) params.set('page', String(page));

    const query = params.toString();
    return query ? `/?${query}` : '/';
  };

  const navigate = (href: string) => {
    startTransition(() => {
      router.replace(href, { scroll: false });
    });
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      {currentPage === 1 ? (
        <span className="px-3 py-1 rounded border opacity-50">Previous</span>
      ) : (
        <button
          type="button"
          className="px-3 py-1 rounded border"
          onClick={() => navigate(buildHref(currentPage - 1))}
          disabled={isPending}
        >
          Previous
        </button>
      )}
      <span className="mx-2">Page {currentPage} of {totalPages}</span>
      {currentPage === totalPages ? (
        <span className="px-3 py-1 rounded border opacity-50">Next</span>
      ) : (
        <button
          type="button"
          className="px-3 py-1 rounded border"
          onClick={() => navigate(buildHref(currentPage + 1))}
          disabled={isPending}
        >
          Next
        </button>
      )}
    </div>
  );
}