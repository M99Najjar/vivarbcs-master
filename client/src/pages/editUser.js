import { useState } from "react";
import DropDown from "../components/form/DropDown";
import TextInput from "../components/form/TextInput";
import { useAuthContext } from "../hooks/useAuthContext";
import { api } from "../components/api";
import MessagesBox from "../components/form/MessagesBox";
import ErrorsBox from "../components/form/ErrorsBox";
import { Link, useNavigate } from "react-router-dom";

const yearsList = [
  { year_id: 2, year_name: 2 },
  { year_id: 3, year_name: 3 },
  { year_id: 4, year_name: 4 },
  { year_id: 5, year_name: 5 },
];

const facultiesList = [
  { faculty_id: 1, faculty_name: "الطب البشري" },
  { faculty_id: 4, faculty_name: "الصيدلة" },
];

const EditUserPage = () => {
  const navigate = useNavigate();
  const { user, dispach } = useAuthContext();

  const [userName, setUserName] = useState(user.user.user_name || "");
  const [userYear, setUserYear] = useState(user.user.user_year || "");
  const [userFaculty, setUserFaculty] = useState(
    user.user.user_faculty_id || ""
  );
  const [errors, setErrors] = useState("");
  const [messages, setMessages] = useState("");

  async function handlSubmit(e) {
    e.preventDefault();
    setErrors("");
    setMessages("");
    const formData = new FormData();
    formData.append("user_name", userName);
    formData.append("user_year", userYear);
    formData.append("user_faculty_id", userFaculty);

    try {
      const res = await api.patch(`/api/users/${user.user.user_id}`, formData, {
        headers: {
          Authorization: `Basic ${user.token}`,
        },
      });
      setMessages(res.data["message"]);

      user.user.user_name = userName;
      user.user.user_year = userYear;
      user.user.user_faculty_id = userFaculty;
      localStorage.setItem("user", JSON.stringify(user));
      dispach({ type: "LOGIN", payload: user });
      setTimeout(() => {
        navigate("/");
      }, 1500);

      //window.location.reload(false);
    } catch (error) {
      setErrors(error.response.data.message);
    }
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="bg-white  py-8 px-12 rounded-2xl border-2 border-gray-400">
        <h1 className="text-2xl text-center mb-4">استكمال تسجيل الدخول</h1>
        <form onSubmit={handlSubmit}>
          <TextInput
            label="اسم المستخدم"
            name="user"
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
            }}
          />
          <DropDown
            label={"السنة"}
            value={userYear}
            options={yearsList}
            name="year"
            onChange={(e) => {
              setUserYear(e.target.value);
            }}
          />
          <DropDown
            label={"الكلية"}
            value={userFaculty}
            options={facultiesList}
            name="faculty"
            onChange={(e) => {
              setUserFaculty(e.target.value);
            }}
          />
          <MessagesBox messages={messages} />
          <ErrorsBox errors={errors} />
          <div className="flex justify-center gap-8 mx-6 mt-6">
            <input
              type="submit"
              value="حفظ"
              className="px-4 py-2 bg-green-600 rounded-lg text-white cursor-pointer"
            />

            <Link to="/">
              <div
                className="px-4 py-2 bg-red-600 rounded-lg text-white cursor-pointer"
                onClick={null}
              >
                إلغاء
              </div>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserPage;
