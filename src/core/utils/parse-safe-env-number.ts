/**
 * getSafeNumberFromEnv
 *
 * Safely parses a number from an environment variable.
 *
 * @param key - The name of the environment variable.
 * @param fallback - The default number to use if the env var is not set or is not a valid number.
 * @returns A valid number from the environment variable or the fallback.
 */
export function getSafeNumberFromEnv(key: string, fallback: number): number {
  const raw = process.env[key];
  const parsed = parseInt(raw ?? "", 10);

  return isNaN(parsed) ? fallback : parsed;
}
