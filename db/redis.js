const Redis = require("ioredis");

function extractRedisUrl(rawValue = "") {
  const trimmed = rawValue.trim();
  if (!trimmed) return "";

  const match = trimmed.match(/rediss?:\/\/[^\s"']+/i);
  if (!match) return "";

  return match[0];
}

const rawRedisConfig = process.env.REDIS_URL || "";
const redisUrl = extractRedisUrl(rawRedisConfig);
const shouldUseTls = rawRedisConfig.includes("--tls") || redisUrl.includes("upstash.io") || redisUrl.startsWith("rediss://");

const redis = redisUrl
  ? new Redis(redisUrl, shouldUseTls ? { tls: {} } : undefined)
  : new Redis({
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: Number(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
    });

redis.on("connect", () => console.log("Redis connected"));
redis.on("error", (err) => console.error("Redis error:", err));

module.exports = redis;
