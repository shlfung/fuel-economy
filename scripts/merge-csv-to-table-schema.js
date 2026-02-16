const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { parse } = require('json2csv');

// Directory containing input CSVs
const inputDir = path.join(__dirname, '../data/csv');
// Output CSV file
const outputFile = path.join(__dirname, '../data/fuel_consumption_vehicles_table.csv');

// Target header and mapping from possible CSV headers to table headers
const tableHeaders = [
  'model_year',
  'make',
  'model',
  'vehicle_class',
  'engine_size_l',
  'cylinders',
  'transmission',
  'fuel_type',
  'city_l_per_100km',
  'highway_l_per_100km',
  'combined_l_per_100km',
  'combined_mpg',
  'co2_emissions_g_per_km',
  'co2_rating',
  'smog_rating',
];

// Mapping from CSV headers to table headers
const headerMap = {
  'Model year': 'model_year',
  'Make': 'make',
  'Model': 'model',
  'Vehicle class': 'vehicle_class',
  'Engine size (L)': 'engine_size_l',
  'Cylinders': 'cylinders',
  'Transmission': 'transmission',
  'Fuel type': 'fuel_type',
  'City (L/100 km)': 'city_l_per_100km',
  'Highway (L/100 km)': 'highway_l_per_100km',
  'Combined (L/100 km)': 'combined_l_per_100km',
  'Combined (mpg)': 'combined_mpg',
  'CO2 emissions (g/km)': 'co2_emissions_g_per_km',
  'CO2 rating': 'co2_rating',
  'Smog rating': 'smog_rating',
};

function mapRow(row) {
  const mapped = {};
  for (const [csvKey, tableKey] of Object.entries(headerMap)) {
    let value = row[csvKey];
    if (value === 'n/a') value = '';
    mapped[tableKey] = value || '';
  }
  return mapped;
}

async function mergeCSVs() {
  const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.csv'));
  const allRows = [];

  for (const file of files) {
    await new Promise((resolve, reject) => {
      fs.createReadStream(path.join(inputDir, file))
        .pipe(csv())
        .on('data', (row) => {
          allRows.push(mapRow(row));
        })
        .on('end', resolve)
        .on('error', reject);
    });
  }

  // Write merged CSV
  const csvData = parse(allRows, { fields: tableHeaders });
  fs.writeFileSync(outputFile, csvData);
  console.log(`Merged CSV written to ${outputFile}`);
}

mergeCSVs().catch(err => {
  console.error('Error merging CSVs:', err);
  process.exit(1);
});
