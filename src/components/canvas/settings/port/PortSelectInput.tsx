import {TextInputProps} from '../../../shared/TextInput';

type SelectInputProps = Omit<
  TextInputProps,
  'expand' | 'maxLength' | 'placeholder'
> & {
  options: string[];
};

function PortSelectInput({
  id,
  label,
  onTextChange,
  value,
  options,
  className,
  labelClassName,
  required,
  disabled,
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
        {options.map(value => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
    </>
  );
}

export default PortSelectInput;
