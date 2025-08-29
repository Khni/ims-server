// config.ts
import { z } from "zod";

// Define schema for required environment variables
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  PORT: z.string().regex(/^\d+$/).transform(Number),
  JWT_SECRET: z.string().min(20, "JWT_SECRET must be at least 20 chars"),
  ACCSESS_TOKEN_EXPIRES_IN_MINUTES: z.string().regex(/^\d+$/).transform(Number),
  // Database
  DATABASE_URL: z.string().url(),
});

export function loadConfig() {
  const env = envSchema.safeParse(process.env);

  if (!env.success) {
    console.error("❌ Invalid environment variables:", env.error.format());
    process.exit(1);
  }

  return env.data;
}

// Example usage:
export const config = loadConfig;
