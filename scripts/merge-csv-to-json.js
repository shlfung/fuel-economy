// Script to merge CSV files in /data/csv and output a single JSON file matching fuel_consumption_data_2026.json format
// Usage: node scripts/merge-csv-to-json.js

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const csvDir = path.join(__dirname, '../data/csv');
const outputJson = path.join(__dirname, '../data/fuel_consumption_data_merged.json');

function readCsv(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

async function mergeCsvFiles() {
  const files = fs.readdirSync(csvDir).filter(f => f.endsWith('.csv'));
  let allRows = [];
  for (const file of files) {
    const rows = await readCsv(path.join(csvDir, file));
    allRows = allRows.concat(rows);
  }
  // Optionally, transform each row to match the JSON format
  // For now, assume CSV headers match JSON keys
  fs.writeFileSync(outputJson, JSON.stringify(allRows, null, 2));
  console.log(`Merged ${files.length} CSV files into ${outputJson}`);
}

mergeCsvFiles().catch(err => {
  console.error('Error merging CSV files:', err);
  process.exit(1);
});
