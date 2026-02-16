export type Vehicle = {
  id?: number;
  model_year: number;
  make: string;
  model: string;
  vehicle_class: string;
  engine_size_l: number;
  cylinders: number;
  transmission: string;
  fuel_type: string;
  city_l_per_100km: number;
  highway_l_per_100km: number;
  combined_l_per_100km: number;
  combined_mpg: number;
  co2_emissions_g_per_km: number;
  co2_rating: number;
  smog_rating: number;
};

export interface FuelSearchProps {
  fuelData: Vehicle[];
  currentPage: number;
  totalPages: number;
  searchTerm: string;
  makeFilter: string;
  yearFilter: string;
  uniqueMakes: string[];
  uniqueYears: number[];
}

export interface VehicleCardProps {
  vehicle: Vehicle;
}