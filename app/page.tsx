import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { Suspense } from 'react';
import { unstable_cache } from 'next/cache';
import FuelSearch from '../components/FuelSearch';

// Shared error UI for configuration and Supabase query failures.
function VehiclesError({ message }: { message: string }) {
  return (
    <div className="rounded border border-red-300 bg-red-50 p-4 text-red-700">
      <h2 className="font-semibold">Unable to load vehicles</h2>
      <p className="mt-1 text-sm">{message}</p>
      <Link
        href="/"
        className="mt-3 inline-block rounded border border-red-300 bg-white px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-100"
      >
        Retry
      </Link>
    </div>
  );
}

type SearchParams = {
  page?: string;
  q?: string;
  make?: string;
  year?: string;
};

// Load and cache all make/year options so filter dropdowns stay complete.
// This is cached for 24 hours to avoid repeatedly scanning the full table.
const getFilterOptions = unstable_cache(
  async (supabaseUrl: string, supabaseKey: string) => {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const pageSize = 1000;
    let from = 0;
    let hasMore = true;
    const makes = new Set<string>();
    const years = new Set<number>();

    while (hasMore) {
      const { data, error } = await supabase
        .from('vehicles')
        .select('make,model_year')
        .order('id', { ascending: true })
        .range(from, from + pageSize - 1);

      if (error) {
        throw new Error(error.message);
      }

      const rows = data ?? [];
      for (const row of rows) {
        if (row.make) makes.add(String(row.make));
        if (row.model_year !== null && row.model_year !== undefined) {
          years.add(Number(row.model_year));
        }
      }

      hasMore = rows.length === pageSize;
      from += pageSize;
    }

    return {
      uniqueMakes: Array.from(makes).sort(),
      uniqueYears: Array.from(years).sort((a, b) => b - a),
    };
  },
  ['vehicles-filter-options'],
  { revalidate: 86400 }
);

async function VehiclesData({ searchParams }: { searchParams: SearchParams }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return (
      <VehiclesError message="Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY." />
    );
  }

  const currentPage = Math.max(1, Number(searchParams.page) || 1);
  const searchTerm = (searchParams.q ?? '').trim();
  const makeFilter = (searchParams.make ?? '').trim();
  const yearFilter = (searchParams.year ?? '').trim();
  const itemsPerPage = 15;
  const from = (currentPage - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  // Build the filtered query once, then apply range pagination.
  const supabase = createClient(supabaseUrl, supabaseKey);
  let query = supabase
    .from('vehicles')
    .select('*', { count: 'exact' })
    .order('id', { ascending: true });

  if (searchTerm) {
    query = query.ilike('model', `%${searchTerm}%`);
  }
  if (makeFilter) {
    query = query.eq('make', makeFilter);
  }
  if (yearFilter) {
    const parsedYear = Number(yearFilter);
    if (!Number.isNaN(parsedYear)) {
      query = query.eq('model_year', parsedYear);
    }
  }

  const [{ data: vehicles = [], error, count }, options] = await Promise.all([
    query.range(from, to),
    getFilterOptions(supabaseUrl, supabaseKey),
  ]);

  if (error) {
    return <VehiclesError message={error.message} />;
  }

  const totalCount = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));

  return (
    <FuelSearch
      fuelData={vehicles}
      currentPage={Math.min(currentPage, totalPages)}
      totalPages={totalPages}
      searchTerm={searchTerm}
      makeFilter={makeFilter}
      yearFilter={yearFilter}
      uniqueMakes={options.uniqueMakes}
      uniqueYears={options.uniqueYears}
    />
  );
}

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<SearchParams> | SearchParams;
}) {
  // Next.js can provide searchParams as a plain object or a Promise depending on context.
  const resolvedSearchParams = searchParams
    ? await Promise.resolve(searchParams)
    : {};

  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto py-10">
        <Suspense fallback={<div>Loading vehicles...</div>}>
          <VehiclesData searchParams={resolvedSearchParams} />
        </Suspense>
      </div>
    </main>
  );
}