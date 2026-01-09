import type { LandmarkDataStructure } from '../models/types';

export type KwizEventsPayload = {
  userId: string;
  category: string;
  date: string;
  events: LandmarkDataStructure[];
};
