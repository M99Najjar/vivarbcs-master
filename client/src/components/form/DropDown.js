const DropDown = ({ label, placeholder, options, onChange, name, value }) => {
  const object_id = name + "_id";
  const object_name = name + "_name";

  return (
    <>
      <label className="text-gray-600 block" htmlFor={name}>
        {label}
      </label>
      <select
        id={name}
        value={value}
        name={object_id}
        required
        className="text-end px-4"
        onChange={onChange}
      >
        <option value="" disabled hidden>
          إختر {label}
        </option>
        {options &&
          options.map((e, i) => (
            <option value={e[object_id]} key={i}>
              {e[object_name]}
            </option>
          ))}

        {options.length === 0 && <option disabled> لا يوجد </option>}
      </select>
    </>
  );
};

export default DropDown;
