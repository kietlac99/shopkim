/* eslint-disable require-jsdoc */
const redis = require("redis");

import { 
  //REDIS_URL,
  REDIS_PASSWORD,
  REDIS_HOST,
  REDIS_PORT 
} from "../config";

// const client = redis.createClient({
//   url: REDIS_URL,
// });

const client = redis.createClient({
  password: REDIS_PASSWORD,
  socket: {
      host: REDIS_HOST,
      port: REDIS_PORT
  }
});

client.on("ready", () => {
  console.log("Redis client connection ready");
});

client.on("error", (error) => {
  console.log(`Redis client connection error: ${error}`);
});

export async function redisGet(key) {
  const payload = await client.get(key, (error, reply) => {
    if (error) return reject(error);
    return resolve(reply);
  });
  return payload;
}

export async function setTextByKey(key, time, data) {
  const payload = await client.setEx(key, time, data, (error, reply) => {
    if (error) {
      console.log(`setTextByKey error: ${error}`);
      return reject(error);
    }
    return resolve(reply);
  });
  return payload;
}

export async function redisDel(key) {
  const payload = await client.del(key, (error, reply) => {
    if (error) {
      console.log(`redisDel error: ${error}`);
      return reject(error);
    }
    return resolve(reply);
  });
  return payload;
}

export async function timeRemaining(key) {
  const payload = await client.ttl(key, (error, reply) => {
    if (error) {
      console.log(`timeRemaining error: ${error}`);
      return reject(error);
    }
    return resolve(reply);
  });
  return payload;
}

export async function findKeysContainingString(scanType, searchString) {
  const results = [];
  await scan(scanType, searchString, results);
  return results;
}

export async function scan(scanType, searchString, results) {
  for await (const key of client.scanIterator()) {
    // use the key!
    if (key.includes(scanType) && key.includes(searchString) ) {
      const value = await client.get(key);
      results.push({ key, value: JSON.parse(value) });
    }
  }
}

export default client;
