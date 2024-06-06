import * as Toolbar from '@radix-ui/react-toolbar';
import {useState} from 'react';

interface CustomButtonProps extends Toolbar.ToolbarButtonProps {
  onClick: () => void;
  children?: React.ReactNode;
  className?: string;
  label?: string;
}

function MenuButton({
  children,
  onClick,
  className,
  label,
  ...rest
}: CustomButtonProps) {
  const [active, setActive] = useState(false);
  return (
    <Toolbar.Button
      className={`btn-canvas h-16 w-16 cursor-pointer ${className}`}
      onClick={onClick}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      {...rest}>
      <>
        {label && active && (
          <h3 className="fixed left-4 ml-20 min-w-28 rounded-md bg-white p-2 font-semibold text-gray-600 shadow-lg">
            {label}
          </h3>
        )}
        {children}
      </>
    </Toolbar.Button>
  );
}

export default MenuButton;
