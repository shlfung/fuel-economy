"use client"
import { useState, useMemo } from 'react';
import fuelData from '../data/fuel_consumption_data_2026.json';
import VehicleCard from './VehicleCard';

export default function FuelSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [makeFilter, setMakeFilter] = useState('');

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
        {filteredData.map((car, idx) => (
          <VehicleCard key={idx} vehicle={car} />
        ))}
      </div>
    </div>
  );
}