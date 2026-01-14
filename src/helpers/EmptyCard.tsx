type EmptyCardProps = {
  numberLeft: number;
  isDragging: boolean;
};

function EmptyCard({ numberLeft, isDragging }: EmptyCardProps) {
  console.log(isDragging);
  return (
    <div className="card card-empty w-full">
      <span className="font-semibold block">+ {numberLeft} Remaining</span>
    </div>
  );
}

export default EmptyCard;
