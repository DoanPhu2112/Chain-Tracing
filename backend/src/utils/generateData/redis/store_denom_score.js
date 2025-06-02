const fs = require('fs');
const Redis = require('ioredis');
const { parser } = require('stream-json');
const { streamValues } = require('stream-json/streamers/StreamValues');
const path = require('path');

// Path to your JSON file
const FILE_PATH = path.join(__dirname, 'multi_denom_score.json');

// Initialize Redis client
const redis = new Redis();

let counter = 0;
let promises = [];

const pipeline = fs.createReadStream(FILE_PATH).pipe(parser()).pipe(streamValues());

pipeline.on('data', ({ value }) => {
  for (const [address, score] of Object.entries(value)) {
    if (!address || !score) continue;

    // Store promises to wait later
    const p = redis
      .hset('multi_denom_score', address, score)
      .then(() => {
        counter++;
        if (counter % 100 === 0) {
          console.log(`✅ Stored ${counter} entries...`);
        }
      })
      .catch((err) => {
        console.error(`❌ Failed for ${address}:`, err);
      });

    promises.push(p);
  }
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
