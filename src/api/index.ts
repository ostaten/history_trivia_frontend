/**
 * API client wrapper - provides clean exports of generated API functions
 */
import { getChronokwiz as getChronokwizModule } from './generated/chronokwiz/chronokwiz';
import type {
  ChronokwizDataStructure,
  GetChronokwizParams
} from './generated/models';

// Extract functions from the generated module
const chronokwizApi = getChronokwizModule();

/**
 * Get today's chronokwiz. If none exists, generates a new one. Includes seen status.
 */
export const getChronokwiz = (
  params?: GetChronokwizParams
): Promise<ChronokwizDataStructure> => {
  return chronokwizApi.getChronokwiz(params);
};

/**
 * Mark a chronokwiz as seen with optional score
 */
export const markChronokwizSeen = (
  chronokwizId: number,
  score?: number
): Promise<void> => {
  return chronokwizApi.postChronokwizSeen({ chronokwizId, score });
};

/**
 * Get list of available chronokwiz dates
 */
export const getChronokwizDates = (): Promise<{
  dates?: Array<{ date?: string; isSeen?: boolean; score?: number }>;
}> => {
  return chronokwizApi.getChronokwizDates();
};

/**
 * Get chronokwiz by specific date
 */
export const getChronokwizByDate = (
  date: string
): Promise<ChronokwizDataStructure> => {
  return chronokwizApi.getChronokwizDate(date);
};

/**
 * Normalize a user prompt
 */
export const normalizePrompt = (
  prompt: string
): Promise<{
  normalizedPrompt?: string;
  originalPrompt?: string;
}> => {
  return chronokwizApi.postChronokwizNormalizePrompt({ prompt });
};

/**
 * Generate a custom chronokwiz from a user prompt
 */
export const createCustomChronokwiz = (
  prompt: string,
  attemptNumber?: number
): Promise<{
  events?: Array<any>;
  prompt?: string;
  attemptNumber?: number;
}> => {
  return chronokwizApi.postChronokwizCustom({ prompt, attemptNumber });
};

// Re-export types for convenience
export type {
  ChronokwizDataStructure,
  GetChronokwizParams
} from './generated/models';
