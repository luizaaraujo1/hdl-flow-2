interface RoundedScrollContainerProps {
  children: React.ReactNode;
}

function RoundedScrollContainer({children}: RoundedScrollContainerProps) {
  return (
    <div className="flex flex-1 flex-col overflow-y-scroll">
      <div className="flex-1 rounded-md rounded-tl-none bg-gray-50 p-4 pr-2 shadow-inner">
        {children}
      </div>
    </div>
  );
}

export default RoundedScrollContainer;
