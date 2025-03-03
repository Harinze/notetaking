import { Redis } from "@upstash/redis";

if (!global.redis) {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    console.error("❌ Redis configuration is missing. Check your environment variables.");
    throw new Error("Redis environment variables are not set.");
  }

  global.redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  global.redis
    .ping()
    .then(() => console.log("✅ Connected to Upstash Redis successfully."))
    .catch((error) => console.error("❌ Redis connection failed:", error.message));
}

const redis = global.redis;
export default redis;
