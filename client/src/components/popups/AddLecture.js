import { useEffect, useState } from "react";
import { api, get } from "../api";
import DropDown from "../form/DropDown";
import ErrorsBox from "../form/ErrorsBox";
import MessagesBox from "../form/MessagesBox";
import TextInput from "../form/TextInput";
import UploadBtn from "../form/UploadBtn";
import { useAuthContext } from "../../hooks/useAuthContext";
import TabSelect from "../form/TabSelect";
import Spinner from "../Spinner";

const lectureTypesList = [
  { name: "محاضرة", value: "lecture" },
  { name: "مبوب", value: "workbook" },
  { name: "ملحق", value: "extra" },
];

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

const AddDoctor = ({ closePopup }) => {
  const { user } = useAuthContext();
  const defaultYear = user.user.user_year;
  const defaultSeason = 1;
  const dafaultFaculty = user.user.user_faculty_id;

  const [messages, setmessages] = useState();
  const [errors, setErrors] = useState();
  const [isLoading, setLoading] = useState(true);

  const [lectureName, setLectureName] = useState("");
  const [subjectsList, setSubjectsList] = useState([]);
  const [doctorsList, setDoctorsList] = useState([]);

  const [selectedFaculty, selectFaculty] = useState(dafaultFaculty);
  const [selectedYear, SelectYear] = useState(defaultYear);
  const [selectedSeason, selectSeason] = useState(defaultSeason);
  const [selectedSubject, selectSubject] = useState("");
  const [selectedDoctor, selectDoctor] = useState("");
  const [file, setFile] = useState("");
  const [lectureType, setLectureType] = useState("lecture");

  const handelFileBtn = async (e) => {
    setFile(e.target.files[0]);
    setLectureName(e.target.files[0].name.split(".")[0]);
  };
  const handelFacultyDropdown = async (e) => {
    const thisFaculty = e.target.value;
    selectFaculty(thisFaculty);
    selectSubject("");
    selectDoctor("");
    setDoctorsList("");
    setSubjectsList("");
  };
  const handelYearDropdown = async (e) => {
    SelectYear(e.target.value);
    selectSubject("");
    selectDoctor("");
    setDoctorsList("");
    setSubjectsList("");
  };
  const handelSeasonDropdown = async (e) => {
    selectSeason(e.target.value);
    selectSubject("");
    selectDoctor("");
    setDoctorsList("");
    setSubjectsList("");
  };
  const handelSubjectDropdown = async (e) => {
    const subject = e.target.value;
    selectSubject(subject);
    selectDoctor("");
    setDoctorsList("");
  };
  const handelDoctorDropdown = (e) => {
    const thisDoctor = e.target.value;
    selectDoctor(thisDoctor);
  };
  const handelTypeSelect = (value) => {
    console.log(value);
    setLectureType(value);
  };

  async function updateSubjectList({ faculty, year, season }) {
    if (faculty && year && season) {
      setLoading(true);
      const subjectResponse = await api.get(
        `/api/subjects/by?faculty_id=${faculty}&year=${year}&season=${season}`,
        {
          headers: {
            Authorization: `Basic ${user.token}`,
          },
        }
      );
      setLoading(false);

      setSubjectsList(subjectResponse.data);
    }
  }
  async function updateDoctorList({ subject }) {
    if (subject) {
      setLoading(true);
      const response = await api.get(`/api/doctors/by?subject_id=${subject}`, {
        headers: {
          Authorization: `Basic ${user.token}`,
        },
      });
      setLoading(false);
      setDoctorsList(response.data);
    }
  }

  const onsubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    setErrors("");
    setmessages("");
    const formData = new FormData();
    formData.append("lecture_name", lectureName);
    formData.append("file", file);
    formData.append("doctor_id", selectedDoctor);
    formData.append("lecture_type", lectureType);

    try {
      const res = await api.post("/api/lectures", formData, {
        headers: {
          Authorization: `Basic ${user.token}`,
        },
      });
      setmessages(res.data["message"]);
      setLoading(false);

      setTimeout(() => {
        window.location.reload(false);
      }, 1000);
    } catch (error) {
      setLoading(false);

      setErrors(error.response.data.message);
    }
  };

  const handelClose = () => {
    closePopup();
  };
  useEffect(() => {
    const faculty = selectedFaculty;
    const year = selectedYear;
    const season = selectedSeason;
    updateSubjectList({ faculty, year, season });
  }, [selectedFaculty, selectedSeason, selectedYear]);

  useEffect(() => {
    const subject = selectedSubject;
    updateDoctorList({ subject });
  }, [selectedSubject]);

  return (
    <>
      <Spinner isLoading={isLoading}>
        <div className="bg-white w-96 rounded-lg py-4 px-8 shadow-xl">
          {/*----- Title ----- */}
          <h1 className="text-center text-5xl mx-6 my-5">إضافة محاضرة</h1>
          {/*----- form ----- */}
          <form onSubmit={onsubmit}>
            <div className="flex gap-3">
              <div className="flex-1">
                <TextInput
                  name="lecture"
                  label="عنوان المحاضرة"
                  placeholder="مثلا: المجيئات المعيبة"
                  value={lectureName}
                  onChange={(e) => {
                    setLectureName(e.target.value);
                  }}
                />
              </div>
              <div className="flex-2 mt-8">
                <UploadBtn
                  onChange={handelFileBtn}
                  file={file}
                  fileType="pdf"
                />
              </div>
            </div>

            <TabSelect
              list={lectureTypesList}
              onClick={handelTypeSelect}
              value={lectureType}
            />

            <div className="flex gap-4 pt-4">
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
            <div className="flex gap-4">
              <div className="flex-1">
                <DropDown
                  label={"المادة"}
                  value={selectedSubject}
                  options={subjectsList}
                  name="subject"
                  onChange={handelSubjectDropdown}
                />
              </div>

              <div className="flex-1">
                <DropDown
                  label={"الدكتور"}
                  value={selectedDoctor}
                  options={doctorsList}
                  name="doctor"
                  onChange={handelDoctorDropdown}
                />
              </div>
            </div>
            <MessagesBox messages={messages} />
            <ErrorsBox errors={errors} />

            {/*----- buttons ----- */}
            <div className="flex justify-center gap-8 mx-6 my-3">
              <input
                type="submit"
                value="حفظ"
                className="px-4 py-2 bg-green-600 rounded-lg text-white cursor-pointer"
              />

              <div
                className="px-4 py-2 bg-red-600 rounded-lg text-white cursor-pointer"
                onClick={handelClose}
              >
                إلغاء
              </div>
            </div>
          </form>
        </div>
      </Spinner>
    </>
  );
};

export default AddDoctor;
