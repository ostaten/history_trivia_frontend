import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type SortableItemProps = {
  id: number;
  disabled: boolean;
  children: React.ReactNode;
};

export function SortableItem({ id, disabled, children }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id,
      disabled,
      transition: {
        duration: 500, // milliseconds
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
      }
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      id={id.toString()}
    >
      {children}
    </div>
  );
}
