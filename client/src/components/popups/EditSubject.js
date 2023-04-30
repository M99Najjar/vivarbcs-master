import { useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { api } from "../api";
import DropDown from "../form/DropDown";
import ErrorsBox from "../form/ErrorsBox";
import MessagesBox from "../form/MessagesBox";
import TextInput from "../form/TextInput";
import UploadBtn from "../form/UploadBtn";
import Spinner from "../Spinner";

const yearsList = [
  { year_id: 2, year_name: 2 },
  { year_id: 3, year_name: 3 },
  { year_id: 4, year_name: 4 },
  { year_id: 5, year_name: 5 },
];
const seasonList = [
  { season_id: 1, season_name: 1 },
  { season_id: 2, season_name: 2 },
];
const universitiesList = [{ university_id: 1, university_name: "جامعة تشرين" }];
const facultiesList = [
  { faculty_id: 1, faculty_name: "الطب البشري" },
  { faculty_id: 4, faculty_name: "الصيدلة" },
];

const AddDoctor = ({ closePopup, subject }) => {
  const { user } = useAuthContext();
  //console.log(user);
  console.log(subject.subject_id);
  const defaultYear = subject.year;
  const defaultSeason = subject.season;
  const dafaultFaculty = subject.faculty_id;
  const defaultName = subject.subject_name;
  const [messages, setmessages] = useState();
  const [errors, setErrors] = useState();
  const [isLoading, setLoading] = useState(true);

  const [subjectName, setSubjectName] = useState(defaultName);

  const [file, setFile] = useState("");

  const [selectedFaculty, selectFaculty] = useState(dafaultFaculty);
  const [selectedYear, SelectYear] = useState(defaultYear);
  const [selectedSeason, selectSeason] = useState(defaultSeason);

  const [img, setImage] = useState();

  const handelFacultyDropdown = async (e) => {
    const thisFaculty = e.target.value;
    selectFaculty(thisFaculty);
  };
  const handelYearDropdown = async (e) => {
    SelectYear(e.target.value);
  };
  const handelSeasonDropdown = async (e) => {
    selectSeason(e.target.value);
  };
  const handelFileBtn = async (e) => {
    setFile(e.target.files[0]);
    const imageObjectURL = URL.createObjectURL(e.target.files[0]);
    setImage(imageObjectURL);
  };

  const onsubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    setErrors("");
    setmessages("");
    const formData = new FormData();
    formData.append("subject_name", subjectName);
    formData.append("year", selectedYear);
    formData.append("season", selectedSeason);
    formData.append("faculty_id", selectedFaculty);
    formData.append("file", file);

    try {
      const res = await api.patch(
        `/api/subjects/${subject.subject_id}`,
        formData,
        {
          headers: {
            Authorization: `Basic ${user.token}`,
          },
        }
      );
      setmessages(res.data.message);
      setTimeout(() => {
        window.location.reload(false);
      }, 1000);
    } catch (error) {
      setErrors(error.res.data.error);
    }
  };

  const handelClose = () => {
    closePopup();
  };
  async function handelDel(e) {
    e.preventDefault();
    setErrors("");
    setmessages("");

    try {
      const res = await api.delete(`/api/subjects/${subject.subject_id}`, {
        headers: {
          Authorization: `Basic ${user.token}`,
        },
      });
      setmessages(res.data["message"]);
      setTimeout(() => {
        window.location.reload(false);
      }, 1000);
    } catch (error) {
      setErrors(error.response.data.message);
    }
  }
  useEffect(() => {
    api
      .get(`/api/subjects/icon/${subject.subject_id}`, {
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
  }, [subject.subject_id, user.token]);

  return (
    <Spinner isLoading={isLoading}>
      <div className="bg-white w-[50rem] rounded-lg py-4 px-8 shadow-xl">
        {/*----- Title ----- */}
        <h1 className="text-center text-5xl mx-6 my-5">إضافة مادة</h1>
        {/*----- form ----- */}
        <form onSubmit={onsubmit} className={"flex gap-3"}>
          <div className={"w-full"}>
            <div className="flex gap-3">
              <div className="flex-1">
                <TextInput
                  label="اسم المادة"
                  placeholder="مثلا: الفيزيولوجيا 3"
                  value={subjectName}
                  onChange={(e) => {
                    setSubjectName(e.target.value);
                  }}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <DropDown
                  label={"الجامعة"}
                  name="university"
                  options={universitiesList}
                />
              </div>
              <div className="flex-1">
                <DropDown
                  label={"الكلية"}
                  value={selectedFaculty}
                  options={facultiesList}
                  name="faculty"
                  onChange={handelFacultyDropdown}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <DropDown
                  label={"السنة"}
                  value={selectedYear}
                  options={yearsList}
                  name="year"
                  onChange={handelYearDropdown}
                />
              </div>
              <div className="flex-1">
                <DropDown
                  label={"الفصل"}
                  value={selectedSeason}
                  options={seasonList}
                  name="season"
                  onChange={handelSeasonDropdown}
                />
              </div>
            </div>
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
                  حذف المادة
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
                    stroke-width="4"
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
                {subject.subject_name}
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
