interface StateNodeHeaderProps {
  stateNumber: number;
  name: string;
}

function StateNodeHeader({stateNumber, name}: StateNodeHeaderProps) {
  return (
    <div className="flex justify-between border-b-2 border-black">
      <div className="flex-1 border-r-[1px] border-black p-2 text-center font-bold">
        {stateNumber}
      </div>
      <div className="flex-[5] border-l-[1px] border-black p-2">{name}</div>
    </div>
  );
}

export default StateNodeHeader;
