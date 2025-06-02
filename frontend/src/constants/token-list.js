const fs = require('fs');
const path = require('path');

// Path to the txt file
const filePath = path.join(__dirname, 'token-list.txt');

// Read the file as a string
const raw = fs.readFileSync(filePath, 'utf-8');

// Split lines, trim, add column, and join back
const output = raw
  .split('\n')
  .map(line => line.trim())
  .filter(Boolean)
  .map(symbol => `"${symbol}",`) // Add your column here
  .join('\n');

// Write to new file (optional)
const outPath = path.join(__dirname, 'tokens-with-column.csv');
fs.writeFileSync(outPath, output, 'utf-8');

console.log('✅ Done! Check tokens-with-column.csv');
