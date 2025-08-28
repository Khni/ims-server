import { describe, it, expect, vi } from "vitest";
import { generateRandomNumber } from "./generate-random-integer.js";

describe("generateRandomNumber", () => {
  it("should generate a number within the specified range", () => {
    const min = 1;
    const max = 10;
    const result = generateRandomNumber(min, max);

    expect(result).toBeGreaterThanOrEqual(min);
    expect(result).toBeLessThanOrEqual(max);
    expect(Number.isInteger(result)).toBe(true);
  });

  it("should handle negative numbers correctly", () => {
    const min = -10;
    const max = -1;
    const result = generateRandomNumber(min, max);

    expect(result).toBeGreaterThanOrEqual(min);
    expect(result).toBeLessThanOrEqual(max);
  });

  it("should return the same number when min and max are equal", () => {
    const value = 5;
    const result = generateRandomNumber(value, value);
    expect(result).toBe(value);
  });

  it("should throw an error when min is greater than max", () => {
    expect(() => generateRandomNumber(10, 1)).toThrowError(
      "Min value cannot be greater than max value"
    );
  });

  it("should produce different numbers on subsequent calls", () => {
    // Mock Math.random to return predictable values for this test
    const mockMathRandom = vi
      .spyOn(Math, "random")
      .mockReturnValueOnce(0.1)
      .mockReturnValueOnce(0.5)
      .mockReturnValueOnce(0.9);

    const results = [
      generateRandomNumber(1, 100),
      generateRandomNumber(1, 100),
      generateRandomNumber(1, 100),
    ];

    // Restore the original Math.random
    mockMathRandom.mockRestore();

    // Check that we got different results
    expect(results[0]).not.toBe(results[1]);
    expect(results[1]).not.toBe(results[2]);
    expect(results[0]).not.toBe(results[2]);
  });

  it("should handle floating point inputs by converting them to integers", () => {
    const result = generateRandomNumber(1.5, 10.9);
    expect(result).toBeGreaterThanOrEqual(2); // Math.ceil(1.5) = 2
    expect(result).toBeLessThanOrEqual(10); // Math.floor(10.9) = 10
  });
});
