export type LandmarkDataStructure = {
  hintDescription: string;
  fullDescription: string;
  isMoved: boolean;
  isConfirmed: boolean;
  pointOfOccurence: string;
  typeOfPointOfOccurence?: TypeOfPointOfOccurence;
  internetLink?: string;
  category: string;
  id: number;
};

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
