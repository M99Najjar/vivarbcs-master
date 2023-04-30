const TextInput = ({ label, placeholder, type, onChange, value, name }) => {
  return (
    <>
      <label htmlFor={name} className="text-gray-600">
        {label}
      </label>
      <input
        id={name}
        type={type ? type : "text"}
        required
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </>
  );
};

export default TextInput;
