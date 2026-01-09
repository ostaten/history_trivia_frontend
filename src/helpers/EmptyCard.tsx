type EmptyCardProps = {
  numberLeft: number;
  isDragging: boolean;
};

function EmptyCard({ numberLeft, isDragging }: EmptyCardProps) {
  console.log(isDragging);
  return (
    <div className="card w-full">
      <p>
        <br />
        {!isDragging && <br />}
        <span className="font-extrabold -mb-0.5 block">
          + {numberLeft} Remaining
        </span>
        {isDragging && <br />}
      </p>
    </div>
  );
}

export default EmptyCard;
