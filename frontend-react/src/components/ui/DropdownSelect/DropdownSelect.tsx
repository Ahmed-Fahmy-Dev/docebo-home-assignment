type SelectOption = {
  value: string | number;
  label: string;
};

type DropdownSelectProps = {
  label: string;
  id: string;
  value: string | number;
  options: readonly SelectOption[];
  onChange: (value: string) => void;
};

const DropdownSelect = ({ label, id, value, options, onChange }: DropdownSelectProps): React.JSX.Element => {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={(event) => onChange(event.currentTarget.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownSelect;
