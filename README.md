# 1. Data Source

Vehicle fuel consumption CSV data was downloaded from:

[open.canada.ca - Fuel Consumption Ratings](https://open.canada.ca/data/en/dataset/98f1a129-f628-4ce4-b24d-6f16bf24dd64)

This dataset is maintained by Natural Resources Canada.

# 2. Database Table Schema

Create the following table in Supabase to allow CSV data import:

```sql
CREATE TABLE vehicles (
   id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
   model_year INTEGER,
   make TEXT,
   model TEXT,
   vehicle_class TEXT,
   engine_size_l NUMERIC(4,1),
   cylinders INTEGER,
   transmission TEXT,
   fuel_type TEXT,
   city_l_per_100km NUMERIC(4,1),
   highway_l_per_100km NUMERIC(4,1),
   combined_l_per_100km NUMERIC(4,1),
   combined_mpg NUMERIC(4,1),
   co2_emissions_g_per_km NUMERIC(4,1),
   co2_rating NUMERIC(4,1),
   smog_rating NUMERIC(4,1)
);
```

# 3. Data Import (CSV Merge)

To prepare your data for import, merge all CSV files in `data/csv/` into a single standardized CSV:

```bash
node scripts/merge-csv-to-table-schema.js
```

This creates `data/fuel_consumption_vehicles_table.csv` for bulk import into the database.

# 4. Data Retrieval (Supabase REST API)

Once your table is populated, you can retrieve data using Supabase's REST API:

```bash
curl -X GET "<project_ref>.supabase.co/rest/v1/vehicles?select=*" -H "apikey: <your_publishable_key>"
```

Replace `<project_ref>` and `<your_publishable_key>` with your Supabase project reference and publishable key.

# 5. Environment Setup

This project requires a `.env.local` file in the root directory with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-key
```

See `.env.example` for the required variables.

# 6. Running the App

To run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

