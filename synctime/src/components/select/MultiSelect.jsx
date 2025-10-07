import Select from 'react-select';

const MultiSelect = ({ label, options, value, onChange, ...props }) => {
  return (
    <div className="mb-3">
      {label && <label className="form-label">{label}</label>}
      <Select
        options={options}
        value={value}
        onChange={onChange}
        isMulti
        {...props}
      />
    </div>
  );
};




export default MultiSelect;