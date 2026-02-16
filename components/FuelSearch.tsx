"use client";

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import type { FuelSearchProps } from './types';
import VehicleCard from './VehicleCard';

// Client-side controls that update URL params and let the server render filtered data.
export default function FuelSearch({
  fuelData,
  currentPage,
  totalPages,
  searchTerm,
  makeFilter,
  yearFilter,
  uniqueMakes,
  uniqueYears,
}: FuelSearchProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [qInput, setQInput] = useState(searchTerm);
  const [makeInput, setMakeInput] = useState(makeFilter);
  const [yearInput, setYearInput] = useState(yearFilter);

  // Build canonical URLs for the current filters/page (used by apply + pagination).
  const buildHref = (overrides: { page?: number; q?: string; make?: string; year?: string }) => {
    const params = new URLSearchParams();

    const nextQ = overrides.q ?? qInput;
    const nextMake = overrides.make ?? makeInput;
    const nextYear = overrides.year ?? yearInput;
    const nextPage = overrides.page ?? currentPage;

    if (nextQ) params.set('q', nextQ);
    if (nextMake) params.set('make', nextMake);
    if (nextYear) params.set('year', nextYear);
    if (nextPage > 1) params.set('page', String(nextPage));

    const query = params.toString();
    return query ? `/?${query}` : '/';
  };

  // Use a transition so route updates feel smooth and keep scroll position.
  const navigate = (href: string) => {
    startTransition(() => {
      router.replace(href, { scroll: false });
    });
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Fuel Consumption Search</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          // Applying text search always resets to the first page.
          navigate(buildHref({ page: 1 }));
        }}
        className="flex gap-4 mb-6"
      >
        <input
          type="text"
          placeholder="Search by model or make..."
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
            // Filter changes reset pagination to page 1.
            navigate(buildHref({ make: nextMake, page: 1 }));
          }}
        >
          <option value="">All Makes</option>
          {uniqueMakes.map(make => (
            <option key={make} value={make}>{make}</option>
          ))}
        </select>
        <select
          className="border p-2 rounded"
          value={yearInput}
          onChange={(e) => {
            const nextYear = e.target.value;
            setYearInput(nextYear);
            // Filter changes reset pagination to page 1.
            navigate(buildHref({ year: nextYear, page: 1 }));
          }}
        >
          <option value="">All Years</option>
          {uniqueYears.map(year => (
            <option key={year} value={year}>{year}</option>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fuelData.map((car, idx) => (
          <VehicleCard key={car.id ?? idx} vehicle={car} />
        ))}
      </div>
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          {currentPage === 1 ? (
            <span className="px-3 py-1 rounded border opacity-50">Previous</span>
          ) : (
            <button
              type="button"
              className="px-3 py-1 rounded border"
              onClick={() => navigate(buildHref({ page: currentPage - 1 }))}
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
              onClick={() => navigate(buildHref({ page: currentPage + 1 }))}
              disabled={isPending}
            >
              Next
            </button>
          )}
        </div>
      )}
    </div>
  );
}