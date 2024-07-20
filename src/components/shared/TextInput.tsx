import {DEFAULT_INPUT_MAX_LENGTH} from '@constants/input';

export interface TextInputProps extends React.HTMLProps<HTMLInputElement> {
  id: string;
  label: string;
  onTextChange: (value: string) => void;
  value: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  labelClassName?: string;
  expand?: boolean;
  maxLength?: number;
}

function TextInput({
  id,
  label,
  onTextChange,
  value,
  placeholder,
  className,
  labelClassName,
  required,
  disabled,
  expand = false,
  maxLength = DEFAULT_INPUT_MAX_LENGTH,
}: TextInputProps) {
  const requirementStyle =
    required && value === '' ? 'bg-red-300/20 placeholder-red-500' : '';
  const disabledStyle = disabled ? 'bg-gray-200 hover:shadow-md' : '';

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
          className={`input-canvas ${requirementStyle} ${disabledStyle} ${className}`}
          type={'text'}
          placeholder={placeholder}
          value={value}
          onChange={event => {
            event.preventDefault();
            onTextChange(event.target.value.slice(0, maxLength - 1));
          }}
          maxLength={maxLength}
          disabled={disabled}
          required={required}
        />
      ) : (
        <textarea
          id={id}
          name={id}
          className={`input-canvas max-h-9 resize-none transition-[width,height] ease-in-out focus:max-h-fit focus:w-full ${requirementStyle} ${disabledStyle} ${className}`}
          cols={20}
          rows={3}
          placeholder={placeholder}
          value={value}
          onChange={event => {
            event.preventDefault();
            onTextChange(event.target.value.slice(0, maxLength - 1));
          }}
          maxLength={maxLength}
          disabled={disabled}
          required={required}
        />
      )}
    </>
  );
}

export default TextInput;
