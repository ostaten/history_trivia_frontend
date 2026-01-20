import { useSortable } from '@dnd-kit/sortable';
import type { LandmarkDataStructure } from '../api/generated/models';

type CardProps = {
  landmark: LandmarkDataStructure;
  isOverlay?: boolean;
  confirmPlacement?: (id: number) => void;
  flashState?: boolean; // true = correct (green), false = wrong (red), undefined = no flash
  hideDate?: boolean;
};

function Card({
  landmark,
  isOverlay = false,
  confirmPlacement,
  flashState,
  hideDate = false
}: CardProps) {
  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if ((e.target as HTMLElement).closest('[data-no-dnd="true"]')) {
      e.stopPropagation(); // Prevent drag start
    }
  };
  const { isDragging } = useSortable({ id: landmark.id ?? 0 });

  // Determine flash class
  const flashClass =
    flashState === true
      ? 'flash-correct'
      : flashState === false
        ? 'flash-wrong'
        : '';

  return (
    <div
      className={`card ${landmark.isConfirmed ? 'card-static' : ''} ${flashClass}`}
    >
      {!landmark.isConfirmed &&
        landmark.isMoved &&
        !isDragging &&
        confirmPlacement &&
        !isOverlay && (
          <button
            className="confirmButton"
            data-no-dnd="true"
            onPointerDown={handlePointerDown}
            onClick={() => confirmPlacement(landmark.id ?? 0)}
          >
            Tap to Confirm Placement
          </button>
        )}
      {landmark.isConfirmed && (
        <div>
          {!hideDate && (
            <p className="font-semibold">{landmark.pointOfOccurence ?? ''}</p>
          )}
          <p className="line-clamp-1">{landmark.hintDescription ?? ''}</p>
        </div>
      )}
      {!landmark.isConfirmed && <p>{landmark.fullDescription ?? ''}</p>}
    </div>
  );
}

export default Card;
