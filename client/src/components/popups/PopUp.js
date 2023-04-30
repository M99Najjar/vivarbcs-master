const PopUp = ({ popUp, children, title }) => {
  return popUp ? (
    <>
      <div className="w-screen h-screen fixed bg-black bg-opacity-50 rounded-md flex justify-center items-center">
        <h1 className="text-center text-5xl mx-6 my-5">{title}</h1>
        {children}
      </div>
    </>
  ) : (
    <></>
  );
};

export default PopUp;
