type TimeUnit = "ms" | "s" | "m" | "h" | "d";
type ValidTimeString = `${number}${TimeUnit}`;

/**
 * Generates an expired date based on the given time string.
 * @param timeString - A string in the format `${number}${TimeUnit}` (e.g., "10m", "7d", "60s", "1000ms")
 * @returns A Date object representing the expiration time
 */
export function generateExpiredDate(timeString: ValidTimeString): Date {
  // Extract the numeric value and unit from the string
  const match = timeString.match(/^(\d+)([a-z]+)$/i);

  if (!match || !match[1] || !match[2]) {
    throw new Error(
      'Invalid time string format. Use format like "10m", "7d", "60s", or "1000ms"'
    );
  }

  const value = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();

  const now = new Date();

  switch (unit) {
    case "ms":
      return new Date(now.getTime() + value);
    case "s":
      return new Date(now.getTime() + value * 1000);
    case "m":
      return new Date(now.getTime() + value * 60 * 1000);
    case "h":
      return new Date(now.getTime() + value * 60 * 60 * 1000);
    case "d":
      return new Date(now.getTime() + value * 24 * 60 * 60 * 1000);
    default:
      throw new Error(`Unsupported time unit: ${unit}. Use ms, s, m, h, or d`);
  }
}
