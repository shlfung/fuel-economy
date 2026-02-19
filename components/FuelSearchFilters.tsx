"use client";

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import type { FuelSearchFiltersProps } from './types';

// Client-only filter controls that update URL params and trigger server re-fetch.
export default function FuelSearchFilters({
  searchTerm,
  makeFilter,
  yearFilter,
  sortBy,
  sortOrder,
  uniqueMakes,
  uniqueYears,
}: FuelSearchFiltersProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Local controlled inputs mirror the current URL state and allow quick edits.
  const [qInput, setQInput] = useState(searchTerm);
  const [makeInput, setMakeInput] = useState(makeFilter);
  const [yearInput, setYearInput] = useState(yearFilter);
  const [sortByInput, setSortByInput] = useState(sortBy);
  const [sortOrderInput, setSortOrderInput] = useState(sortOrder);

  // Build next URL from current inputs plus any overrides, always resetting to page 1.
  const buildHref = (overrides: {
    q?: string;
    make?: string;
    year?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: number;
  }) => {
    const params = new URLSearchParams();
    const nextQ = (overrides.q ?? qInput).trim();
    const nextMake = overrides.make ?? makeInput;
    const nextYear = overrides.year ?? yearInput;
    const nextSortBy = overrides.sortBy ?? sortByInput;
    const nextSortOrder = overrides.sortOrder ?? sortOrderInput;
    const nextPage = overrides.page ?? 1;

    if (nextQ) params.set('q', nextQ);
    if (nextMake) params.set('make', nextMake);
    if (nextYear) params.set('year', nextYear);
    if (nextSortBy) {
      params.set('sortBy', nextSortBy);
      params.set('sortOrder', nextSortOrder);
    }
    if (nextPage > 1) params.set('page', String(nextPage));

    const query = params.toString();
    return query ? `/?${query}` : '/';
  };

  const navigate = (href: string) => {
    // Use a transition so UI stays responsive during route updates.
    startTransition(() => {
      router.replace(href, { scroll: false });
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        navigate(buildHref({ page: 1 }));
      }}
      className="flex gap-4 mb-6"
    >
      <input
        type="text"
        placeholder="Search by model..."
        className="border p-2 rounded w-full"
        value={qInput}
        onChange={(e) => setQInput(e.target.value)}
      />
      <select
        className="border p-2 rounded"
        value={makeInput}
        onChange={(e) => {
          const nextMake = e.target.value;
          setMakeInput(nextMake);
          navigate(buildHref({ make: nextMake, page: 1 }));
        }}
      >
        <option value="">All Makes</option>
        {uniqueMakes.map((make) => (
          <option key={make} value={make}>
            {make}
          </option>
        ))}
      </select>
      <select
        className="border p-2 rounded"
        value={yearInput}
        onChange={(e) => {
          const nextYear = e.target.value;
          setYearInput(nextYear);
          navigate(buildHref({ year: nextYear, page: 1 }));
        }}
      >
        <option value="">All Years</option>
        {uniqueYears.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
      <select
        className="border p-2 rounded"
        value={sortByInput}
        onChange={(e) => {
          const nextSortBy = e.target.value;
          setSortByInput(nextSortBy as FuelSearchFiltersProps['sortBy']);
          navigate(buildHref({ sortBy: nextSortBy, page: 1 }));
        }}
      >
        <option value="">Sort by</option>
        <option value="city">City</option>
        <option value="highway">Highway</option>
        <option value="combined">Combined</option>
      </select>
      <select
        className="border p-2 rounded"
        value={sortOrderInput}
        onChange={(e) => {
          const nextSortOrder = e.target.value;
          setSortOrderInput(nextSortOrder as FuelSearchFiltersProps['sortOrder']);
          navigate(buildHref({ sortOrder: nextSortOrder, page: 1 }));
        }}
        // Sort direction only applies when a sort metric is selected.
        disabled={!sortByInput}
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
      <button
        type="button"
        className="px-3 py-2 rounded border"
        onClick={() => {
          // Reset all local controls and return to the base route.
          setQInput('');
          setMakeInput('');
          setYearInput('');
          setSortByInput('');
          setSortOrderInput('asc');
          navigate('/');
        }}
        disabled={isPending}
      >
        Reset
      </button>
    </form>
  );
}