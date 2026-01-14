export type TypeOfPointOfOccurence = 'standard' | 'episode';

export type LandmarkDataStructureKey =
  | 'onDeckLandmarkContainer'
  | 'placedLandmarkContainer'
  | 'unplacedLandmarkContainer';

export const LandmarkContainers = {
  onDeckLandmarkContainer: 'onDeckLandmarkContainer',
  placedLandmarkContainer: 'placedLandmarkContainer',
  unplacedLandmarkContainer: 'unplacedLandmarkContainer'
} as const;
