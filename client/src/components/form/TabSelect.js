const TabSelect = ({ list, onClick, value }) => {
  return (
    <>
      <div className="TabSelect flex gap-2 w-full h-10 rounded-lg">
        {list.map((e) => {
          return (
            <div
              className={`  flex-1 rounded-md border cursor-pointer flex justify-center items-center ${
                value === e.value
                  ? "bg-green-100 border-green-300 text-green-900 shadow sm"
                  : "bg-gray-100 border-gray-300 "
              }`}
              key={e.value}
              onClick={() => {
                onClick(e.value);
              }}
            >
              <p>{e.name}</p>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default TabSelect;
