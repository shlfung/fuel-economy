"use client";

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import type { FuelSearchFiltersProps } from './types';

// Client-only filter controls that update URL params and trigger server re-fetch.
export default function FuelSearchFilters({
  searchTerm,
  makeFilter,
  yearFilter,
  uniqueMakes,
  uniqueYears,
}: FuelSearchFiltersProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [qInput, setQInput] = useState(searchTerm);
  const [makeInput, setMakeInput] = useState(makeFilter);
  const [yearInput, setYearInput] = useState(yearFilter);

  const buildHref = (overrides: { q?: string; make?: string; year?: string; page?: number }) => {
    const params = new URLSearchParams();
    const nextQ = (overrides.q ?? qInput).trim();
    const nextMake = overrides.make ?? makeInput;
    const nextYear = overrides.year ?? yearInput;
    const nextPage = overrides.page ?? 1;

    if (nextQ) params.set('q', nextQ);
    if (nextMake) params.set('make', nextMake);
    if (nextYear) params.set('year', nextYear);
    if (nextPage > 1) params.set('page', String(nextPage));

    const query = params.toString();
    return query ? `/?${query}` : '/';
  };

  const navigate = (href: string) => {
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
      <button
        type="button"
        className="px-3 py-2 rounded border"
        onClick={() => {
          setQInput('');
          setMakeInput('');
          setYearInput('');
          navigate('/');
        }}
        disabled={isPending}
      >
        Reset
      </button>
    </form>
  );
}