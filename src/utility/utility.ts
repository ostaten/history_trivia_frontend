import type { KwizEventsPayload } from '../api/types';
import type { LandmarkDataStructure } from '../api/generated/models';

/**
 * Shuffle an array (Fisher–Yates algorithm)
 */
function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Process a KwizEventsPayload to return ordered and randomized versions
 */
export function processKwizPayload(payload: KwizEventsPayload): {
  ordered: LandmarkDataStructure[];
  randomized: LandmarkDataStructure[];
} {
  const ordered = [...payload.events].sort((a, b) =>
    (a.pointOfOccurence ?? '').localeCompare(b.pointOfOccurence ?? '')
  );

  const randomized = shuffle(payload.events);

  return { ordered, randomized };
}

/**
 * Get the attempt counter for a given prompt from localStorage
 * Returns 2 if no counter exists (first attempt)
 */
export function getAttemptCounter(prompt: string): number {
  const key = `chronokwiz_attempt_${prompt}`;
  const stored = localStorage.getItem(key);
  if (stored === null) {
    return 1; // Start at 1
  }
  return parseInt(stored, 10) || 1;
}

/**
 * Increment and save the attempt counter for a given prompt
 * Returns the new counter value
 */
export function incrementAttemptCounter(prompt: string): number {
  const current = getAttemptCounter(prompt);
  const newCounter = current + 1;
  const key = `chronokwiz_attempt_${prompt}`;
  localStorage.setItem(key, newCounter.toString());
  return newCounter;
}
