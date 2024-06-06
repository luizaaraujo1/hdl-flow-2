import {PlusCircledIcon} from '@radix-ui/react-icons';

import SelectInput from '../../../shared/SelectInput';

interface TransitionConditionAdderProps {
  selectLabel: string;
  selectedId: string;
  addLabel: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
  options: {id: string; value: string}[];
  alignRight?: boolean;
}

function TransitionConditionAdder({
  selectLabel,
  selectedId,
  addLabel,
  onSelect,
  onAdd,
  options,
  alignRight,
}: TransitionConditionAdderProps) {
  const alignStyle = alignRight ? 'right-14' : 'left-10';
  const hasOptions = options.length > 0;

  const defaultOption = !hasOptions
    ? {id: 'null', value: 'None available'}
    : undefined;

  const disabledStyle = !hasOptions ? 'bg-gray-200 hover:shadow-md' : '';

  const inputOptionsStyle = !hasOptions ? 'bg-red-300/20 text-red-500' : '';
  return (
    <div className={`fixed bottom-10 ${alignStyle} flex rounded-3xl shadow-md`}>
      <div className="flex flex-col rounded-l-3xl bg-white p-2 pl-4">
        <SelectInput
          id="select_port"
          label={selectLabel}
          className={`w-full ${inputOptionsStyle}`}
          onTextChange={id => onSelect(id)}
          value={selectedId ?? ''}
          options={options}
          defaultOption={defaultOption}
        />
      </div>
      <button
        className={`btn-canvas flex rounded-l-none p-2 ${disabledStyle}`}
        onClick={() => onAdd()}
        disabled={!hasOptions}>
        <PlusCircledIcon />
        <h2 className="text-md ml-2 font-semibold">{addLabel}</h2>
      </button>
    </div>
  );
}

export default TransitionConditionAdder;
