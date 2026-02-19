import FuelSearchFilters from './FuelSearchFilters';
import FuelSearchPagination from './FuelSearchPagination';
import type { FuelSearchProps } from './types';
import VehicleCard from './VehicleCard';

// Server-rendered results list with client-rendered controls.
export default function FuelSearch({
  fuelData,
  currentPage,
  totalPages,
  searchTerm,
  makeFilter,
  yearFilter,
  sortBy,
  sortOrder,
  uniqueMakes,
  uniqueYears,
}: FuelSearchProps) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Fuel Consumption Search</h1>
      {/*
        Remount filter controls when URL-backed filter/sort values change.
        This keeps local input state in sync with server-provided props.
      */}
      <FuelSearchFilters
        key={`${searchTerm}|${makeFilter}|${yearFilter}|${sortBy}|${sortOrder}`}
        searchTerm={searchTerm}
        makeFilter={makeFilter}
        yearFilter={yearFilter}
        sortBy={sortBy}
        sortOrder={sortOrder}
        uniqueMakes={uniqueMakes}
        uniqueYears={uniqueYears}
      />
      {/* Vehicle results are server-fetched and rendered as responsive cards. */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fuelData.map((car, idx) => (
          <VehicleCard key={car.id ?? idx} vehicle={car} />
        ))}
      </div>
      {/* Pagination preserves current filters and sort selection through URL params. */}
      <FuelSearchPagination
        currentPage={currentPage}
        totalPages={totalPages}
        searchTerm={searchTerm}
        makeFilter={makeFilter}
        yearFilter={yearFilter}
        sortBy={sortBy}
        sortOrder={sortOrder}
      />
    </div>
  );
}