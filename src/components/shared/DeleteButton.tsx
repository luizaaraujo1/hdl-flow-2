import {ReactNode} from 'react';

interface CanvasButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick: () => void;
  label: string;
  icon: ReactNode;
  displayMode?: 'left' | 'right';
}

const CanvasButton = ({
  onClick,
  className,
  icon,
  label,
  displayMode,
  ...rest
}: CanvasButtonProps) => {
  const displayStyle = displayMode
    ? displayMode === 'left'
      ? 'rounded-r-none border-r-[1px]'
      : 'rounded-l-none border-l-[1px]'
    : '';
  return (
    <button
      onClick={() => onClick()}
      className={`nodrag nopan btn-canvas flex gap-1 rounded-md border-2 border-black p-2 text-lg font-bold ${displayStyle} ${className}`}
      {...rest}>
      <>
        {icon}
        {label}
      </>
    </button>
  );
};

export default CanvasButton;
