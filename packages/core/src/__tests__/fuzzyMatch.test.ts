import { describe, it, expect } from "vitest";
import { fuzzyMatch } from "../fuzzyMatch";

describe("fuzzyMatch", () => {
  it("matches exact string", () => {
    const result = fuzzyMatch("test", "test");
    expect(result.matches).toBe(true);
    expect(result.matchedIndices).toEqual([0, 1, 2, 3]);
  });

  it("matches prefix", () => {
    const result = fuzzyMatch("tes", "testUtils.ts");
    expect(result.matches).toBe(true);
    expect(result.matchedIndices).toEqual([0, 1, 2]);
  });

  it("matches fuzzy (non-contiguous)", () => {
    const result = fuzzyMatch("tut", "testUtils.ts");
    expect(result.matches).toBe(true);
    // t(0) e s t U(4) t(5) i l s . t s -> t(0), u(4), t(5)
    expect(result.matchedIndices).toEqual([0, 4, 5]);
  });

  it("is case insensitive", () => {
    const result = fuzzyMatch("TUT", "testUtils.ts");
    expect(result.matches).toBe(true);
  });

  it("returns false for non-matching", () => {
    const result = fuzzyMatch("xyz", "testUtils.ts");
    expect(result.matches).toBe(false);
    expect(result.matchedIndices).toEqual([]);
  });

  it("returns false when query is longer than target", () => {
    const result = fuzzyMatch("toolongquery", "short");
    expect(result.matches).toBe(false);
  });

  it("handles empty query", () => {
    const result = fuzzyMatch("", "anything");
    expect(result.matches).toBe(true);
    expect(result.matchedIndices).toEqual([]);
  });

  it("handles empty target", () => {
    const result = fuzzyMatch("a", "");
    expect(result.matches).toBe(false);
  });

  it("matches characters in order only", () => {
    const result = fuzzyMatch("ba", "abc");
    expect(result.matches).toBe(false);
  });

  it("matches single character", () => {
    const result = fuzzyMatch("u", "utils");
    expect(result.matches).toBe(true);
    expect(result.matchedIndices).toEqual([0]);
  });
});
