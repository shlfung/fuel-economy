# Data Source

Vehicle fuel consumption CSV data was downloaded from:

[open.canada.ca - Fuel Consumption Ratings](https://open.canada.ca/data/en/dataset/98f1a129-f628-4ce4-b24d-6f16bf24dd64)

This dataset is maintained by Natural Resources Canada.
# CSV Table Schema Merge

The script `scripts/merge-csv-to-table-schema.js` merges all CSV files in `data/csv/` into a single CSV file (`data/fuel_consumption_vehicles_table.csv`) formatted for import into a database table. It standardizes headers and combines all rows, mapping source columns to a consistent schema.

To run:

```bash
node scripts/merge-csv-to-table-schema.js
```

This is useful for preparing vehicle fuel economy data for bulk import into a database (e.g., Postgres/Supabase).
# Environment Setup

This project requires a `.env.local` file in the root directory with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-key
```

See `.env.example` for the required variables.

To run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

