import * as Toolbar from '@radix-ui/react-toolbar';

interface Props {
  addNewNode: () => void;
}

function FlowToolbar({addNewNode}: Props) {
  return (
    <Toolbar.Root className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-lg border-zinc[300] px-8 h-20 w-96 overflow-hidden">
      <Toolbar.Button
        className="w-32 h-32 bg-violet-500 rounded mt-6 hover:-translate-y-2 transition-transform"
        onClick={addNewNode}
      />
    </Toolbar.Root>
  );
}

export default FlowToolbar;
