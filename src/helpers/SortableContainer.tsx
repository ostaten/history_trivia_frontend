import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import type React from 'react';

type SortableContainerProps = {
  id: string;
  children: React.ReactNode;
  itemIDs: number[];
  disabled?: boolean;
};

function SortableContainer({
  id,
  children,
  itemIDs,
  disabled
}: SortableContainerProps) {
  const { setNodeRef } = useDroppable({
    id,
    disabled
  });

  return (
    <SortableContext
      id={id}
      items={itemIDs}
      strategy={verticalListSortingStrategy}
    >
      <div ref={setNodeRef}>{children}</div>
    </SortableContext>
  );
}

export default SortableContainer;
