type EmptyCardProps = {
  numberLeft: number;
};

function EmptyCard({ numberLeft }: EmptyCardProps) {
  return (
    <div className="card card-empty w-full">
      <span className="font-semibold block">+ {numberLeft} Remaining</span>
    </div>
  );
}

export default EmptyCard;
