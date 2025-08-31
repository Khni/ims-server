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
  // Mail settings
  MAIL_USER: z.email(),
  MAIL_PASS: z.string().min(1, "MAIL_PASS cannot be empty"),
  MAIL_SERVICE: z.string().min(1),
  MAIL_HOST: z.string().min(1),
  EMAIL_TEMPLATES_PATH: z
    .string()
    .regex(/^(\.{1,2}\/)?([a-zA-Z0-9._-]+\/?)*$/, {
      message: "Invalid relative path format for EMAIL_TEMPLATES_PATH",
    }),
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
