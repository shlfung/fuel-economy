import type { VehicleCardProps } from './types';

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <div className="border p-4 rounded shadow-sm hover:shadow-md transition">
      <h2 className="font-bold text-lg">{vehicle.make} {vehicle.model} <span className="text-sm text-gray-400 font-normal">({vehicle.model_year})</span></h2>
      <p className="text-sm text-gray-400">{vehicle.vehicle_class}</p>
      <div className="mt-2 text-sm">
        <p>City: <strong>{vehicle.city_l_per_100km} L/100 km</strong></p>
        <p>Highway: <strong>{vehicle.highway_l_per_100km} L/100 km</strong></p>
        <p>Combined: <strong>{vehicle.combined_l_per_100km} L/100 km</strong></p>
        <p>CO₂ Emissions: <strong>{vehicle.co2_emissions_g_per_km} g/km</strong></p>
        <p>CO₂ Rating: <strong>{vehicle.co2_rating}/10</strong></p>
      </div>
    </div>
  );
}
