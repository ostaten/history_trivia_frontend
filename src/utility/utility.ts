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
  console.log(payload);
  const ordered = [...payload.events].sort((a, b) =>
    (a.pointOfOccurence ?? '').localeCompare(b.pointOfOccurence ?? '')
  );

  const randomized = shuffle(payload.events);

  return { ordered, randomized };
}
