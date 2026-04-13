export interface FuzzyMatchResult {
  matches: boolean;
  /** Indices of matched characters in the target string */
  matchedIndices: number[];
}

/**
 * Performs fuzzy matching where characters can be non-contiguous
 * but must appear in order.
 */
export function fuzzyMatch(query: string, target: string): FuzzyMatchResult {
  const queryLower = query.toLowerCase();
  const targetLower = target.toLowerCase();
  const matchedIndices: number[] = [];

  let qi = 0;
  for (let ti = 0; ti < targetLower.length && qi < queryLower.length; ti++) {
    if (targetLower[ti] === queryLower[qi]) {
      matchedIndices.push(ti);
      qi++;
    }
  }

  return {
    matches: qi === queryLower.length,
    matchedIndices,
  };
}
