const fs = require('fs');
const Redis = require('ioredis');
const path = require('path');
const csv = require('csv-parser');

// Path to your CSV file
const FILE_PATH = path.join(__dirname, '../scam_addresses.csv');

// Initialize Redis client
const redis = new Redis();

let counter = 0;
let promises = [];

const pipeline = fs.createReadStream(FILE_PATH).pipe(csv());

pipeline.on('data', ({ address, class: classLabel }) => {
  if (!address || !classLabel) return;

  counter++;
  const promise = redis.hset('label', address, classLabel);
  promises.push(promise);
});

pipeline.on('end', async () => {
  console.log(`⌛ Waiting for all Redis writes to finish...`);
  await Promise.allSettled(promises); // wait for all pending writes
  console.log(`🎉 All done. Stored ${counter} addresses to Redis.`);
  redis.quit();
});

pipeline.on('error', (err) => {
  console.error('💥 Stream error:', err);
  redis.quit();
});
