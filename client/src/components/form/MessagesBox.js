const MessagesBox = ({ messages }) => {
  return messages ? (
    <>
      <div className="w-full p-4 rounded-md bg-green-200">
        <p className="text-green-900">{messages}</p>
      </div>
    </>
  ) : null;
};

export default MessagesBox;
