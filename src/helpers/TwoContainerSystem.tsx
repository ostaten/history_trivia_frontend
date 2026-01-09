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
  type LandmarkDataStructure,
  type LandmarkDataStructureKey
} from '../models/types';
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
};

type AllLandmarks = {
  [K in LandmarkDataStructureKey]: LandmarkDataStructure[];
};

export default function TwoContainerSystem({
  unplacedLandmarks,
  onDeckLandmark,
  placedLandmarks,
  score,
  setScore
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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  // function findItem(id: number) {
  //   for (const map of Object.values(allLandmarks)) {
  //     const item = map.find((v) => v.id == id);
  //     if (item) return item;
  //   }
  //   return undefined;
  // }

  function confirmPlacement(id: number) {
    const itemIndex = allLandmarks.placedLandmarkContainer.findIndex(
      (i) => i.id == id
    );
    let currScore = MaxItemScore;
    //check if item is placed too far in future, and if so, by how much
    let trackerIndex = itemIndex - 1;
    while (
      trackerIndex > -1 &&
      allLandmarks.placedLandmarkContainer[trackerIndex].pointOfOccurence >
        allLandmarks.placedLandmarkContainer[itemIndex].pointOfOccurence
    ) {
      currScore--;
      trackerIndex--;
    }
    if (currScore == MaxItemScore) {
      trackerIndex = itemIndex + 1;
      while (
        trackerIndex < allLandmarks.placedLandmarkContainer.length &&
        allLandmarks.placedLandmarkContainer[trackerIndex].pointOfOccurence <
          allLandmarks.placedLandmarkContainer[itemIndex].pointOfOccurence
      ) {
        currScore--;
        trackerIndex++;
      }
    }
    setScore(score + Math.max(0, currScore));
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
    setAllLandmarks((items) => ({
      ...items,
      [LandmarkContainers.placedLandmarkContainer]: tempPlaced
    }));
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
      <div className="flex flex-col w-4/5 touch-none items-center">
        <div className="relative w-full">
          <div className="relative z-10">
            <SortableContainer
              id="onDeckLandmarkContainer"
              itemIDs={allLandmarks.onDeckLandmarkContainer.map((od) => od.id)}
              disabled={activeCard != undefined}
            >
              {allLandmarks.onDeckLandmarkContainer.map((l) => (
                <SortableItem
                  key={l.id}
                  id={l.id}
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
                isDragging={activeCard != undefined}
              />
            </div>
          )}
        </div>
        <div className="flex w-full justify-center mb-5 mt-10">
          <img src={arrowUp} className="arrowIcon"></img>
          <h3 className="self-center mr-4 ml-4">The Big Bang</h3>
          <img src={arrowUp} className="arrowIcon"></img>
        </div>
        <div className="w-full">
          <SortableContainer
            id="placedLandmarkContainer"
            itemIDs={allLandmarks.placedLandmarkContainer.map((pl) => pl.id)}
          >
            {allLandmarks.placedLandmarkContainer.map((l) => (
              <SortableItem key={l.id} id={l.id} disabled={l.isConfirmed}>
                <Card landmark={l} confirmPlacement={confirmPlacement} />
              </SortableItem>
            ))}
          </SortableContainer>
          <DragOverlay>
            {activeCard ? (
              <SortableItem id={activeCard?.id} disabled={false}>
                <Card landmark={activeCard} isOverlay={true} />
              </SortableItem>
            ) : null}
          </DragOverlay>
        </div>
        <div className="flex w-full justify-center mt-5">
          <img src={arrowDown} className="arrowIcon"></img>
          <h3 className="self-center mr-4 ml-4">The End of All Times</h3>
          <img src={arrowDown} className="arrowIcon"></img>
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
      list.some((c) => c.id === id)
    )?.[0] as LandmarkDataStructureKey;
  }

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const { id } = active;

    setActiveCard(
      Object.values(allLandmarks)
        .flat()
        .find((c) => c.id === id)
    );
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    const { id } = active;

    if (!over) {
      console.log('could not find over');
      return;
    }

    const { id: overID } = over;

    // Avoid repeating drag-over on same item
    console.log(id, overID);

    const activeContainer = findContainer(id);
    const overContainer = findContainer(overID);
    console.log(activeContainer, overContainer);

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

      const activeIndex = activeItems.findIndex((item) => item.id === id);
      const overIndex = overItems.findIndex((item) => item.id === overID);

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
      const updatedActiveItems = activeItems.filter((item) => item.id !== id);

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
    if (!over) {
      console.log('could not find over');
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
      console.log('could not find one or more containers');
      return;
    }

    const activeIndex = allLandmarks[activeContainer].findIndex(
      (landmark) => landmark.id == id
    );
    const overIndex = allLandmarks[overContainer].findIndex(
      (landmark) => landmark.id == overID
    );

    //we are setting event
    console.log(activeIndex, overIndex);
    console.log(allLandmarks);
    //we are dragging unconfirmed event from inside placed events
    if (
      allLandmarks.onDeckLandmarkContainer.length == 1 &&
      allLandmarks.placedLandmarkContainer.find((c) => c.id == id)
    ) {
      console.log('dragging unconfirmed event');
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
    } else if (allLandmarks.onDeckLandmarkContainer.length == 0) {
      //intial move from unplaced to placed
      console.log('popping!', activeIndex, overIndex);
      const tempArray = [...allLandmarks.unplacedLandmarkContainer];
      const newLandmarkOnDeck = tempArray.pop();
      console.log(newLandmarkOnDeck);
      if (newLandmarkOnDeck) {
        console.log(activeIndex, overIndex);
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
        //continue on in game
      } else {
        console.log('hit end of game');
        //go to end of game
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
      }
    }
    setActiveCard(undefined);
    setEverythingConfirmed(false);
  }
}
