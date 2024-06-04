import {CrossCircledIcon} from '@radix-ui/react-icons';

interface DeleteButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onDelete: () => void;
}

const DeleteButton = ({onDelete, className, ...rest}: DeleteButtonProps) => {
  return (
    <button
      onClick={() => onDelete()}
      className={`nodrag nopan btn-canvas rounded-md border-2 border-black p-2 text-lg font-bold ${className}`}
      {...rest}>
      Delete <CrossCircledIcon className="ml-2" />
    </button>
  );
};

export default DeleteButton;
