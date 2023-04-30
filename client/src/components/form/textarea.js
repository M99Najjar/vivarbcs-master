const TextArea = ({ label, placeholder, onChange, value, name }) => {
  return (
    <>
      <label htmlFor={name} className="text-gray-600">
        {label}
      </label>
      <textarea
        rows="4"
        cols="50"
        id={name}
        required
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </>
  );
};

export default TextArea;
