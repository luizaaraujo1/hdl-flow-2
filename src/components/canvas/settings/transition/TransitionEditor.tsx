import {useDialog} from '../../../../contexts/DialogContext';

function TransitionEditor() {
  const {selectedTransitionId} = useDialog();
  return <>{selectedTransitionId}</>;
}

export default TransitionEditor;
