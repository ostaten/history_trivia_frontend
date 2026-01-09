import { useSortable } from '@dnd-kit/sortable';
import type { LandmarkDataStructure } from '../models/types';

type CardProps = {
  landmark: LandmarkDataStructure;
  isOverlay?: boolean;
  confirmPlacement?: (id: number) => void;
};

function Card({ landmark, isOverlay = false, confirmPlacement }: CardProps) {
  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if ((e.target as HTMLElement).closest('[data-no-dnd="true"]')) {
      e.stopPropagation(); // Prevent drag start
    }
  };
  const { isDragging } = useSortable({ id: landmark.id });

  return (
    <div className="card">
      {!landmark.isConfirmed &&
        landmark.isMoved &&
        !isDragging &&
        confirmPlacement &&
        !isOverlay && (
          <button
            className="confirmButton"
            data-no-dnd="true"
            onPointerDown={handlePointerDown}
            onClick={() => confirmPlacement(landmark.id)}
          >
            Tap to Confirm Placement
          </button>
        )}
      {landmark.isConfirmed && (
        <div>
          <p className="font-bold">{landmark.pointOfOccurence}</p>
          <p className="line-clamp-1">{landmark.hintDescription}</p>
        </div>
      )}
      {!landmark.isConfirmed && <p>{landmark.fullDescription}</p>}
    </div>
  );
}

export default Card;
