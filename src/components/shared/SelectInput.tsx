import {TextInputProps} from './TextInput';

type SelectInputProps = Omit<
  TextInputProps,
  'expand' | 'maxLength' | 'placeholder'
> & {
  options: {id: string; value: string}[];
  defaultOption?: {id: string; value: string};
};

function SelectInput({
  id,
  label,
  onTextChange,
  value,
  options,
  className,
  labelClassName,
  required,
  disabled,
  defaultOption,
}: SelectInputProps) {
  return (
    <>
      <label
        htmlFor={id}
        className={`text-sm font-semibold text-gray-600 ${labelClassName}`}>
        {label}
      </label>
      <select
        id={id}
        name={id}
        value={value}
        onChange={event => {
          event.preventDefault();
          onTextChange(event.target.value);
        }}
        className={`input-canvas appearance-none hover:cursor-pointer ${className}`}
        required={required}
        disabled={disabled}>
        {defaultOption && (
          <option value={defaultOption.id} disabled={disabled}>
            {defaultOption.value}
          </option>
        )}
        {options.map(option => (
          <option key={option.id} value={option.id}>
            {option.value}
          </option>
        ))}
      </select>
    </>
  );
}

export default SelectInput;
