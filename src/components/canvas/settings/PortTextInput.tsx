interface Props {
  id: string;
  label: string;
  onChange: (value: string) => void;
  value: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  labelClassName?: string;
  expand?: boolean;
  maxLength?: number;
}

const DEFAULT_INPUT_MAX_LENGTH = 20;

function PortTextInput({
  id,
  label,
  onChange,
  value,
  placeholder,
  className,
  labelClassName,
  required,
  disabled,
  expand = false,
  maxLength = DEFAULT_INPUT_MAX_LENGTH,
}: Props) {
  const requirementStyle =
    required && value === '' ? 'bg-red-300/20 placeholder-red-500' : '';
  const disabledStyle = disabled ? 'bg-gray-200' : '';

  return (
    <>
      <label
        htmlFor={id}
        className={`text-sm font-semibold text-gray-600 ${labelClassName}`}>
        {label}
      </label>
      {!expand ? (
        <input
          id={id}
          name={id}
          className={`w-1/2 p-1 rounded-sm text-start ${requirementStyle} ${disabledStyle} ${className}`}
          type={'text'}
          placeholder={placeholder}
          value={value}
          onChange={event => {
            event.preventDefault();
            onChange(event.target.value.slice(0, maxLength - 1));
          }}
          maxLength={maxLength}
          disabled={disabled}
          required={required}
        />
      ) : (
        <textarea
          id={id}
          name={id}
          className={`w-1/2 p-1 rounded-sm resize-none max-h-9 focus:max-h-fit ${requirementStyle} ${disabledStyle} ${className}`}
          cols={20}
          rows={3}
          placeholder={placeholder}
          value={value}
          onChange={event => {
            event.preventDefault();
            onChange(event.target.value.slice(0, maxLength - 1));
          }}
          maxLength={maxLength}
          disabled={disabled}
          required={required}
        />
      )}
    </>
  );
}

export default PortTextInput;
