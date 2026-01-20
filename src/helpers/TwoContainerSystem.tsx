import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  type UniqueIdentifier
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useState } from 'react';
import arrowDown from '../assets/arrowDown.svg';
import arrowUp from '../assets/arrowUp.svg';
import {
  LandmarkContainers,
  type LandmarkDataStructureKey
} from '../models/types';
import type { LandmarkDataStructure } from '../api/generated/models';
import { MaxItemScore } from '../models/variables';
import Card from './Card';
import EmptyCard from './EmptyCard';
import SortableContainer from './SortableContainer';
import { SortableItem } from './SortableItem';
import React from 'react';

type TwoContainerSystemProps = {
  unplacedLandmarks: LandmarkDataStructure[];
  onDeckLandmark: LandmarkDataStructure;
  placedLandmarks: LandmarkDataStructure[];
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  onComplete?: (finalScore: number) => void;
  isCustomQuiz?: boolean;
};

type AllLandmarks = {
  [K in LandmarkDataStructureKey]: LandmarkDataStructure[];
};

export default function TwoContainerSystem({
  unplacedLandmarks,
  onDeckLandmark,
  placedLandmarks,
  score,
  setScore,
  onComplete,
  isCustomQuiz = false
}: TwoContainerSystemProps) {
  //core structure
  const [allLandmarks, setAllLandmarks] = useState<AllLandmarks>({
    onDeckLandmarkContainer: [onDeckLandmark],
    placedLandmarkContainer: placedLandmarks,
    unplacedLandmarkContainer: unplacedLandmarks
  });

  //means that card is actively being dragged
  const [activeCard, setActiveCard] = useState<LandmarkDataStructure>();

  const [everythingConfirmed, setEverythingConfirmed] = useState(true);

  // Track flash animation state: { id: number, isCorrect: boolean } | null
  const [flashState, setFlashState] = useState<{
    id: number;
    isCorrect: boolean;
  } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  function confirmPlacement(id: number) {
    const itemIndex = allLandmarks.placedLandmarkContainer.findIndex(
      (i) => (i.id ?? 0) == id
    );
    let currScore = MaxItemScore;
    //check if item is placed too far in future, and if so, by how much
    let trackerIndex = itemIndex - 1;
    while (
      trackerIndex > -1 &&
      (allLandmarks.placedLandmarkContainer[trackerIndex].pointOfOccurence ??
        '') >
        (allLandmarks.placedLandmarkContainer[itemIndex].pointOfOccurence ?? '')
    ) {
      currScore--;
      trackerIndex--;
    }
    if (currScore == MaxItemScore) {
      trackerIndex = itemIndex + 1;
      while (
        trackerIndex < allLandmarks.placedLandmarkContainer.length &&
        (allLandmarks.placedLandmarkContainer[trackerIndex].pointOfOccurence ??
          '') <
          (allLandmarks.placedLandmarkContainer[itemIndex].pointOfOccurence ??
            '')
      ) {
        currScore--;
        trackerIndex++;
      }
    }

    // Determine if answer is correct (perfect score)
    const isCorrect = currScore === MaxItemScore;

    // Trigger flash animation
    setFlashState({ id, isCorrect });
    // Clear flash after animation completes
    setTimeout(() => setFlashState(null), 600);

    const newScore = score + Math.max(0, currScore);
    setScore(newScore);
    let tempPlaced = allLandmarks.placedLandmarkContainer;
    const [item] = tempPlaced.splice(itemIndex, 1);
    item.isConfirmed = true;
    if (trackerIndex > itemIndex) {
      //item needs to move up
      tempPlaced.splice(trackerIndex - 1, 0, item);
    } else {
      //item needs to move back
      tempPlaced.splice(trackerIndex + 1, 0, item);
    }
    setAllLandmarks((items) => {
      const updated = {
        ...items,
        [LandmarkContainers.placedLandmarkContainer]: tempPlaced
      };
      
      // Check if quiz is complete: no unplaced items, no on-deck items, all placed items confirmed
      const isComplete =
        updated.unplacedLandmarkContainer.length === 0 &&
        updated.onDeckLandmarkContainer.length === 0 &&
        updated.placedLandmarkContainer.every((item) => item.isConfirmed);
      
      if (isComplete && onComplete) {
        // Use the new score that was just calculated
        onComplete(newScore);
      }
      
      return updated;
    });
    setEverythingConfirmed(true);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col w-full sm:w-11/12 md:w-4/5 max-w-4xl touch-none items-center relative">
        <div className="relative w-full z-10">
          <div className="relative z-10">
            <SortableContainer
              id="onDeckLandmarkContainer"
              itemIDs={allLandmarks.onDeckLandmarkContainer.map(
                (od) => od.id ?? 0
              )}
              disabled={activeCard != undefined}
            >
              {allLandmarks.onDeckLandmarkContainer.map((l) => (
                <SortableItem
                  key={l.id ?? 0}
                  id={l.id ?? 0}
                  disabled={!everythingConfirmed}
                >
                  <Card landmark={l} />
                </SortableItem>
              ))}
            </SortableContainer>
          </div>
          {allLandmarks.unplacedLandmarkContainer.length > 0 && (
            <div
              className={`${activeCard != undefined ? 'relative' : 'absolute'} w-full bottom-0 -mb-6 z-0`}
            >
              <EmptyCard
                numberLeft={allLandmarks.unplacedLandmarkContainer.length}
              />
            </div>
          )}
        </div>
        <div className="relative w-full">
          {/* Connecting timeline line - positioned between markers */}
          <div className="timeline-line timeline-line-start"></div>

          <div className="timeline-marker my-4 sm:my-6 md:my-8 lg:my-10 z-10">
            <img src={arrowUp} className="arrowIcon" alt="Timeline start"></img>
            <h3 className="timeline-label">The Big Bang</h3>
            <img src={arrowUp} className="arrowIcon" alt="Timeline start"></img>
          </div>

          <div className="w-full relative z-10">
            <SortableContainer
              id="placedLandmarkContainer"
              itemIDs={allLandmarks.placedLandmarkContainer.map(
                (pl) => pl.id ?? 0
              )}
            >
              {allLandmarks.placedLandmarkContainer.map((l) => (
                <SortableItem
                  key={l.id ?? 0}
                  id={l.id ?? 0}
                  disabled={l.isConfirmed ?? false}
                >
                  <Card
                    landmark={l}
                    confirmPlacement={confirmPlacement}
                    flashState={
                      flashState?.id === (l.id ?? 0)
                        ? flashState.isCorrect
                        : undefined
                    }
                    hideDate={isCustomQuiz}
                  />
                </SortableItem>
              ))}
            </SortableContainer>
            <DragOverlay>
              {activeCard ? (
                <SortableItem id={activeCard?.id ?? 0} disabled={false}>
                  <Card landmark={activeCard} isOverlay={true} />
                </SortableItem>
              ) : null}
            </DragOverlay>
          </div>

          <div className="timeline-marker mt-4 sm:mt-6 md:mt-8 lg:mt-10 mb-0 z-10">
            <img src={arrowDown} className="arrowIcon" alt="Timeline end"></img>
            <h3 className="timeline-label">The End of All Times</h3>
            <img src={arrowDown} className="arrowIcon" alt="Timeline end"></img>
          </div>
        </div>
      </div>
    </DndContext>
  );

  function findContainer(
    id: UniqueIdentifier
  ): LandmarkDataStructureKey | undefined {
    if (id in allLandmarks) {
      return id as LandmarkDataStructureKey;
    }
    return Object.entries(allLandmarks).find(([_, list]) =>
      list.some((c) => (c.id ?? 0) === id)
    )?.[0] as LandmarkDataStructureKey;
  }

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const { id } = active;

    setActiveCard(
      Object.values(allLandmarks)
        .flat()
        .find((c) => (c.id ?? 0) === id)
    );
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    const { id } = active;

    if (!over) {
      return;
    }

    const { id: overID } = over;

    // Avoid repeating drag-over on same item
    const activeContainer = findContainer(id);
    const overContainer = findContainer(overID);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    setAllLandmarks((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];

      const activeIndex = activeItems.findIndex(
        (item) => (item.id ?? 0) === id
      );
      const overIndex = overItems.findIndex(
        (item) => (item.id ?? 0) === overID
      );

      if (activeIndex === -1) return prev;

      // Compute new index
      let newIndex: number;

      if (overID in prev) {
        // Dropped on container itself, not a specific item
        newIndex = overItems.length;
      } else {
        const activeRect = active.rect?.current?.translated;
        const overRect = over.rect;

        const isBelowLastItem =
          overIndex === overItems.length - 1 &&
          activeRect &&
          overRect &&
          activeRect.top > overRect.top + overRect.height;

        const modifier = isBelowLastItem ? 1 : 0;
        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length;
      }

      // Remove from old container and add to new
      const movedItem = activeItems[activeIndex];
      const updatedActiveItems = activeItems.filter(
        (item) => (item.id ?? 0) !== id
      );

      const updatedOverItems = [...overItems];
      updatedOverItems.splice(newIndex, 0, movedItem);

      const next = {
        ...prev,
        [activeContainer]: updatedActiveItems,
        [overContainer]: updatedOverItems
      };

      return next;
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    const { id } = active;

    if (
      !over ||
      (over.data.current?.sortable.containerId != 'placedLandmarkContainer' &&
        over.id != 'placedLandmarkContainer')
    ) {
      setActiveCard(undefined);
      setEverythingConfirmed(true);
      return;
    }

    const { id: overID } = over;

    const activeContainer = findContainer(id);
    const overContainer = findContainer(overID);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer !== overContainer
    ) {
      setActiveCard(undefined);
      setEverythingConfirmed(false);
      return;
    }

    // If dropped in onDeckLandmarkContainer (invalid area), just reset and return
    if (overContainer === LandmarkContainers.onDeckLandmarkContainer) {
      setActiveCard(undefined);
      setEverythingConfirmed(false);
      return;
    }

    const activeIndex = allLandmarks[activeContainer].findIndex(
      (landmark) => (landmark.id ?? 0) == id
    );
    const overIndex = allLandmarks[overContainer].findIndex(
      (landmark) => (landmark.id ?? 0) == overID
    );

    //we are setting event
    //we are dragging unconfirmed event from inside placed events
    if (
      allLandmarks.onDeckLandmarkContainer.length == 1 &&
      allLandmarks.placedLandmarkContainer.find((c) => (c.id ?? 0) == id)
    ) {
      setAllLandmarks((items) => ({
        ...items,
        [overContainer]: arrayMove(
          items[overContainer].map((item) => ({
            ...item,
            isMoved: true
          })),
          activeIndex,
          overIndex
        )
      }));
      setActiveCard(undefined);
    } else if (allLandmarks.onDeckLandmarkContainer.length == 0) {
      //intial move from unplaced to placed
      const tempArray = [...allLandmarks.unplacedLandmarkContainer];
      const newLandmarkOnDeck = tempArray.pop();
      if (newLandmarkOnDeck) {
        setAllLandmarks((items) => ({
          ...items,
          [overContainer]: arrayMove(
            items[overContainer].map((item) => ({
              ...item,
              isMoved: true
            })),
            activeIndex,
            overIndex
          ),
          [LandmarkContainers.onDeckLandmarkContainer]: [newLandmarkOnDeck],
          [LandmarkContainers.unplacedLandmarkContainer]: tempArray
        }));
        setActiveCard(undefined);
        //continue on in game
      } else {
        //go to end of game
        setAllLandmarks((items) => {
          const updated = {
            ...items,
            [overContainer]: arrayMove(
              items[overContainer].map((item) => ({
                ...item,
                isMoved: true
              })),
              activeIndex,
              overIndex
            )
          };
          
          // Check if quiz is complete after this move
          // Note: This is when the last item is moved from unplaced to placed
          // It will still need to be confirmed, so completion will be detected in confirmPlacement
          
          return updated;
        });
        setActiveCard(undefined);
      }
    } else {
      // If none of the conditions are met, still reset activeCard
      setActiveCard(undefined);
    }
    setEverythingConfirmed(false);
  }
}
