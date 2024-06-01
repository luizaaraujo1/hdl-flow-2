interface StateNodeListElementProps {
  name: string;
  value: string;
  hideBottomBorder?: boolean;
}

function StateNodeListElement({
  name,
  value,
  hideBottomBorder,
}: StateNodeListElementProps) {
  return (
    <div
      className={`flex border-black ${hideBottomBorder ? '' : 'border-b-2'}`}>
      <div className="flex-1 border-r-[1px] border-black p-2">{name}</div>
      <div className="flex-1 border-l-[1px] border-black p-2">{value}</div>
    </div>
  );
}

export default StateNodeListElement;
