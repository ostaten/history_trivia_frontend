import { DndContext } from '@dnd-kit/core';
import type { LandmarkDataStructure } from '../api/generated/models';
import arrowDown from '../assets/arrowDown.svg';
import arrowUp from '../assets/arrowUp.svg';
import Card from './Card';
import { SortableItem } from './SortableItem';

type CompletedChronokwizViewProps = {
  orderedLandmarks: LandmarkDataStructure[];
};

export default function CompletedChronokwizView({
  orderedLandmarks
}: CompletedChronokwizViewProps) {
  // Ensure all landmarks are marked as confirmed for display
  const confirmedLandmarks = orderedLandmarks.map((landmark) => ({
    ...landmark,
    isConfirmed: true
  }));

  return (
    <DndContext>
      <div className="flex flex-col w-full sm:w-11/12 md:w-4/5 max-w-4xl items-center relative">
        <div className="relative w-full">
          {/* Connecting timeline line - positioned between markers */}
          <div className="timeline-line timeline-line-start"></div>

          <div className="timeline-marker my-4 sm:my-6 md:my-8 lg:my-10 z-10">
            <img src={arrowUp} className="arrowIcon" alt="Timeline start"></img>
            <h3 className="timeline-label">The Big Bang</h3>
            <img src={arrowUp} className="arrowIcon" alt="Timeline start"></img>
          </div>

          <div className="w-full relative z-10">
            {confirmedLandmarks.map((landmark) => (
              <SortableItem
                key={landmark.id ?? 0}
                id={landmark.id ?? 0}
                disabled={true}
              >
                <Card landmark={landmark} />
              </SortableItem>
            ))}
          </div>

          <div className="timeline-marker mt-4 sm:mt-6 md:mt-8 lg:mt-10 mb-0 z-10">
            <img src={arrowDown} className="arrowIcon" alt="Timeline end"></img>
            <h3 className="timeline-label">End of All Times</h3>
            <img src={arrowDown} className="arrowIcon" alt="Timeline end"></img>
          </div>
        </div>
      </div>
    </DndContext>
  );
}
