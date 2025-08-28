/**
 * Generates a random integer between the specified minimum and maximum values (inclusive)
 * @param min - The minimum value of the range (inclusive)
 * @param max - The maximum value of the range (inclusive)
 * @returns A random integer between min and max (inclusive)
 * @throws Will throw an error if min is greater than max
 * @example
 * // Returns a number between 202305 and 959595
 * const randomNum = generateRandomNumber(202305, 959595);
 */
export function generateRandomNumber(min: number, max: number) {
  if (min > max) {
    throw new Error("Min value cannot be greater than max value");
  }

  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
