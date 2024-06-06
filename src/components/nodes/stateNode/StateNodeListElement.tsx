interface StateNodeListElementProps {
  name: string;
  value: string;
  hideBottomBorder?: boolean;
  className?: string;
}

function StateNodeListElement({
  name,
  value,
  hideBottomBorder,
  className,
}: StateNodeListElementProps) {
  const bottomBorderStyle = hideBottomBorder ? '' : 'border-b-2';
  return (
    <div
      className={`flex h-full max-w-[500px] items-center border-black ${bottomBorderStyle} ${className}`}>
      <div className="w-full p-2">
        <h3>{name}</h3>
      </div>
      <div className="w-full border-l-2 border-black p-2">
        <h3>{value}</h3>
      </div>
    </div>
  );
}

export default StateNodeListElement;
