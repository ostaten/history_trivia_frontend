import type { LandmarkDataStructure } from './generated/models';

export type KwizEventsPayload = {
  userId: string;
  category: string;
  date: string;
  events: LandmarkDataStructure[];
};
