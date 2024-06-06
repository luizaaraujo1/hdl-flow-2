import * as Dialog from '@radix-ui/react-dialog';
import {Cross1Icon} from '@radix-ui/react-icons';

interface SettingsDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  description: string;
  children: React.ReactNode;
  disclaimers?: string[];
  onClose?: () => void;
}

function SettingsDialog({
  open,
  setOpen,
  title,
  description,
  disclaimers,
  onClose,
  children,
}: SettingsDialogProps) {
  const closeDialog = () => {
    onClose && onClose();
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} defaultOpen={false}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-10 cursor-pointer bg-black/50"
          onClick={closeDialog}
        />
        <Dialog.Content className="center-fixed z-20 flex h-4/5 w-4/5 max-w-[1400px] flex-col rounded-md bg-white p-8 shadow-lg transition-all duration-150 ease-in focus:outline-none">
          <Dialog.Close
            onClick={closeDialog}
            className="btn-canvas fixed right-8 top-8 h-8 w-8 rounded-full">
            <Cross1Icon />
          </Dialog.Close>
          <Dialog.Title className="mb-2 text-lg font-semibold">
            {title}
          </Dialog.Title>
          <Dialog.Description className="text-md mb-4 font-light">
            {description}
          </Dialog.Description>
          {disclaimers &&
            disclaimers.map((disclaimer, index) => (
              <Dialog.Description
                key={`${disclaimer.split(' ')[0]}_${index}`}
                className={`${index === disclaimers.length - 1 ? 'mb-4' : 'mb-2'} text-sm font-light text-slate-800`}>
                {disclaimer}
              </Dialog.Description>
            ))}
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default SettingsDialog;
