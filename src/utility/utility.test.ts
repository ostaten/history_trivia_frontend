import { describe, it, expect, beforeEach } from 'vitest';
import {
  processKwizPayload,
  getAttemptCounter,
  incrementAttemptCounter
} from './utility';
import type { LandmarkDataStructure } from '../api/generated/models';

describe('utility functions', () => {
  describe('processKwizPayload', () => {
    it('should sort events by pointOfOccurence', () => {
      const events: LandmarkDataStructure[] = [
        {
          id: 1,
          pointOfOccurence: '2020-01-01',
          fullDescription: 'Event 1',
          hintDescription: 'Hint 1'
        },
        {
          id: 2,
          pointOfOccurence: '2010-01-01',
          fullDescription: 'Event 2',
          hintDescription: 'Hint 2'
        },
        {
          id: 3,
          pointOfOccurence: '2015-01-01',
          fullDescription: 'Event 3',
          hintDescription: 'Hint 3'
        }
      ];

      const result = processKwizPayload({
        events,
        category: 'Test',
        date: '2024-01-01',
        userId: 'test'
      });

      expect(result.ordered).toHaveLength(3);
      expect(result.ordered[0].pointOfOccurence).toBe('2010-01-01');
      expect(result.ordered[1].pointOfOccurence).toBe('2015-01-01');
      expect(result.ordered[2].pointOfOccurence).toBe('2020-01-01');
    });

    it('should randomize events', () => {
      const events: LandmarkDataStructure[] = [
        {
          id: 1,
          pointOfOccurence: '2020-01-01',
          fullDescription: 'Event 1',
          hintDescription: 'Hint 1'
        },
        {
          id: 2,
          pointOfOccurence: '2010-01-01',
          fullDescription: 'Event 2',
          hintDescription: 'Hint 2'
        }
      ];

      const result = processKwizPayload({
        events,
        category: 'Test',
        date: '2024-01-01',
        userId: 'test'
      });

      expect(result.randomized).toHaveLength(2);
      // Randomized order should be different from ordered (most of the time)
      // We can't guarantee it, but we can check that all events are present
      expect(result.randomized.map((e) => e.id).sort()).toEqual([1, 2]);
    });
  });

  describe('getAttemptCounter', () => {
    beforeEach(() => {
      // Clear localStorage before each test
      localStorage.clear();
    });

    it('should return 1 for a new prompt', () => {
      const counter = getAttemptCounter('new prompt');
      expect(counter).toBe(1);
    });

    it('should return stored counter for existing prompt', () => {
      localStorage.setItem('chronokwiz_attempt_test prompt', '5');
      const counter = getAttemptCounter('test prompt');
      expect(counter).toBe(5);
    });
  });

  describe('incrementAttemptCounter', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('should increment counter from 1 to 2', () => {
      const newCounter = incrementAttemptCounter('test prompt');
      expect(newCounter).toBe(2);
      expect(getAttemptCounter('test prompt')).toBe(2);
    });

    it('should increment existing counter', () => {
      localStorage.setItem('chronokwiz_attempt_test prompt', '3');
      const newCounter = incrementAttemptCounter('test prompt');
      expect(newCounter).toBe(4);
      expect(getAttemptCounter('test prompt')).toBe(4);
    });
  });
});
