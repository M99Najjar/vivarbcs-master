const UploadBtn = ({ onChange, file, fileType }) => {
  return (
    <>
      <input
        id="mkmk"
        hidden
        type="file"
        accept={
          fileType === "pdf"
            ? `application/pdf`
            : fileType === "image"
            ? `image/png,`
            : ""
        }
        onChange={onChange}
      />
      <label
        htmlFor="mkmk"
        className={`p-2.5 bg-white border shadow-sm  rounded-md hover:cursor-pointer ${
          file
            ? "bg-green-100 text-green-900 border-green-300"
            : "bg-gray-100 text-gray-900 border-gray-300"
        }`}
      >
        اختر ملف
      </label>
    </>
  );
};

export default UploadBtn;
