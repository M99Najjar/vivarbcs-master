import { useEffect, useState } from "react";
import { api, get } from "../api";
import ErrorsBox from "../form/ErrorsBox";
import MessagesBox from "../form/MessagesBox";
import TextInput from "../form/TextInput";
import { useAuthContext } from "../../hooks/useAuthContext";
import Spinner from "../Spinner";
import UploadBtn from "../form/UploadBtn";
import TextArea from "../form/textarea";

const AddDoctor = ({ closePopup, product }) => {
  const { user } = useAuthContext();

  const defaultProductName = product.product_name;
  const defaultDescription = product.description;

  const [messages, setmessages] = useState();
  const [errors, setErrors] = useState();

  const [productName, setProductName] = useState(defaultProductName);
  const [description, setDescription] = useState(defaultDescription);

  const [file, setFile] = useState("");
  const [img, setImage] = useState();
  const [isLoading, setLoading] = useState(true);

  const handelFileBtn = async (e) => {
    setFile(e.target.files[0]);
  };

  const onsubmit = async (e) => {
    e.preventDefault();
    setErrors("");
    setmessages("");
    const formData = new FormData();
    formData.append("product_name", productName);
    formData.append("description", description);
    formData.append("file", file);

    try {
      const res = await api.patch(
        `/api/products/${product.product_id}`,
        formData,
        {
          headers: {
            Authorization: `Basic ${user.token}`,
          },
        }
      );
      setmessages(res.data["message"]);
      window.location.reload(false);
    } catch (error) {
      setErrors("المنتج موجودة بالفعل");
    }
  };

  async function handelDel(e) {
    e.preventDefault();
    setErrors("");
    setmessages("");

    try {
      const res = await api.delete(`/api/products/${product.product_id}`, {
        headers: {
          Authorization: `Basic ${user.token}`,
        },
      });
      setmessages(res.data["message"]);
      window.location.reload(false);
    } catch (error) {
      setErrors("المحاضرة موجودة بالفعل");
    }
  }

  const handelClose = () => {
    closePopup();
  };

  useEffect(() => {
    api
      .get(`/api/products/icon/${product.product_id}`, {
        responseType: "blob",
        headers: {
          Authorization: `Basic ${user.token}`,
        },
      })
      .then((res) => {
        const imageObjectURL = URL.createObjectURL(res.data);
        setImage(imageObjectURL);
        setLoading(false);
      });
  }, [product.product_id, user.token]);

  return (
    <Spinner isLoading={isLoading}>
      <div className="bg-white w-[50rem] rounded-lg py-4 px-8 shadow-xl">
        {/*----- Title ----- */}
        <h1 className="text-center text-5xl mx-6 my-5">إضافة منتج</h1>
        {/*----- form ----- */}
        <form onSubmit={onsubmit} className="flex gap-3">
          <div className={"w-full"}>
            <div className="flex gap-3">
              <div className="flex-1">
                <TextInput
                  label="اسم المنتج"
                  placeholder="مثلا: مرجع الوطني للنسائية"
                  value={productName}
                  onChange={(e) => {
                    setProductName(e.target.value);
                  }}
                />
              </div>
            </div>
            <TextArea
              label="الشرح"
              placeholder="مثلا: مرجع وطني راصور لطلاب الطب بطباعة ملونة"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />

            <MessagesBox messages={messages} />
            <ErrorsBox errors={errors} />

            {/*----- buttons ----- */}
            <div className="flex justify-between gap-8 mx-6 my-3">
              <div className="flex gap-4">
                <input
                  type="submit"
                  value="حفظ التعديلات"
                  className="px-4 py-2 bg-green-600 rounded-lg text-white cursor-pointer"
                />

                <div
                  className="px-4 py-2 bg-red-600 rounded-lg text-white cursor-pointer"
                  onClick={handelDel}
                >
                  حذف المنتج
                </div>
              </div>

              <div
                className="px-4 py-2 bg-red-600 rounded-lg text-white cursor-pointer"
                onClick={handelClose}
              >
                إلغاء
              </div>
            </div>
          </div>
          <div>
            <div className="relative mt-5">
              <div className="">
                <svg
                  className=" h-36"
                  fill="none"
                  height="163"
                  viewBox="0 0 131 163"
                  width="131"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    fill="#fff"
                    height="159"
                    rx="13"
                    stroke="#f04c4d"
                    strokeWidth="4"
                    width="127"
                    x="2"
                    y="2"
                  />
                  <path
                    d="m0 123h131v25c0 8.284-6.716 15-15 15h-101c-8.28427 0-15-6.716-15-15z"
                    fill="#f04c4d"
                  />
                </svg>
              </div>
              <div className="absolute top-14 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20">
                {!isLoading && <img className="" src={img} />}
              </div>
              <p className=" absolute bottom-1 left-1/2 transform -translate-x-1/2 text-lg text-white">
                {product.product_name}
              </p>
            </div>
            <div className="w-full pt-1.5 flex justify-center">
              <UploadBtn
                onChange={handelFileBtn}
                file={file}
                fileType={"image"}
              />
            </div>
          </div>
        </form>
      </div>
    </Spinner>
  );
};

export default AddDoctor;
