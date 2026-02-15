"use client"
import { useState, useMemo, useEffect } from 'react';
import fuelData from '../data/fuel_consumption_data_2026.json';
import VehicleCard from './VehicleCard';

export default function FuelSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [makeFilter, setMakeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Filtering logic
  const filteredData = useMemo(() => {
    return fuelData.filter((item) => {
      const matchesSearch = 
        item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.make.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMake = makeFilter === '' || item.make === makeFilter;
      return matchesSearch && matchesMake;
    });
  }, [searchTerm, makeFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to first page when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, makeFilter]);

  // Get unique makes for the dropdown
  const uniqueMakes = Array.from(new Set(fuelData.map(d => d.make))).sort();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">2026 Fuel Consumption Search</h1>
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by model or make..."
          className="border p-2 rounded w-full"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
          className="border p-2 rounded"
          onChange={(e) => setMakeFilter(e.target.value)}
        >
          <option value="">All Makes</option>
          {uniqueMakes.map(make => (
            <option key={make} value={make}>{make}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedData.map((car, idx) => (
          <VehicleCard key={idx} vehicle={car} />
        ))}
      </div>
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            className="px-3 py-1 rounded border disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="mx-2">Page {currentPage} of {totalPages}</span>
          <button
            className="px-3 py-1 rounded border disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}