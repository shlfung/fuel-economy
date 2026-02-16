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
  uniqueMakes,
  uniqueYears,
}: FuelSearchProps) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Fuel Consumption Search</h1>
      <FuelSearchFilters
        key={`${searchTerm}|${makeFilter}|${yearFilter}`}
        searchTerm={searchTerm}
        makeFilter={makeFilter}
        yearFilter={yearFilter}
        uniqueMakes={uniqueMakes}
        uniqueYears={uniqueYears}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fuelData.map((car, idx) => (
          <VehicleCard key={car.id ?? idx} vehicle={car} />
        ))}
      </div>
      <FuelSearchPagination
        currentPage={currentPage}
        totalPages={totalPages}
        searchTerm={searchTerm}
        makeFilter={makeFilter}
        yearFilter={yearFilter}
      />
    </div>
  );
}