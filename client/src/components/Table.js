const Table = ({ Headers, infos, onRowClick }) => {
  return (
    <div className="table w-full select-none">
      <div className="w-full bg-white rounded-xl px-3 py-3 border-2">
        {/*----- Headers -----*/}
        <div className=" flex flex-row justify-between px-6 py-2">
          {Headers.map((e, i) => (
            <span className="flex-1 text-center" key={i}>
              {e["displayName"]}
            </span>
          ))}
        </div>
        <div className="overflow-y-scroll h-[34rem] ">
          {/*----- info -----*/}

          {infos.map((e, i) => (
            <div
              className={` rounded-xl px-5 py-1 cursor-pointer mb-1 flex justify-between  ${
                i % 2 === 0 ? "bg-slate-100" : "bg-white"
              }`}
              key={i}
              onClick={() => {
                onRowClick(e);
              }}
            >
              {Headers.map((ee, i) => (
                <span className="flex-1 text-center truncate " key={i}>
                  {e[ee["dbName"]]}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Table;
