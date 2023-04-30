import { useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { api } from "../api";
import DropDown from "../form/DropDown";
import ErrorsBox from "../form/ErrorsBox";
import MessagesBox from "../form/MessagesBox";
import TextInput from "../form/TextInput";
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

const EditDoctor = ({ closePopup, doctor }) => {
  const { user } = useAuthContext();

  //default values
  const defaultYear = doctor.year;
  const defaultSeason = doctor.season;
  const dafaultFaculty = doctor.faculty_id;
  const defaultDoctorName = doctor.doctor_name;
  const defaultSubject = doctor.subject_id;

  const [messages, setmessages] = useState();
  const [errors, setErrors] = useState();
  const [isLoading, setLoading] = useState(true);

  const [subjectsList, setSubjectsList] = useState([]);

  const [doctorName, setDoctorName] = useState(defaultDoctorName);
  const [selectedFaculty, selectFaculty] = useState(dafaultFaculty);
  const [selectedYear, selectYear] = useState(defaultYear);
  const [selectedSeason, selectSeason] = useState(defaultSeason);
  const [selectedSubject, selectSubject] = useState(defaultSubject);

  const handelFacultyDropdown = async (e) => {
    const thisFaculty = e.target.value;
    selectFaculty(thisFaculty);
    selectSubject("");
  };
  const handelYearDropdown = async (e) => {
    selectYear(e.target.value);
    selectSubject("");
  };
  const handelSeasonDropdown = async (e) => {
    selectSeason(e.target.value);
    selectSubject("");
  };
  const handelSubjectDropdown = async (e) => {
    const subject = e.target.value;
    selectSubject(subject);
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
      setSubjectsList(subjectResponse.data);
      setLoading(false);
    }
  }

  const onsubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    setErrors("");
    setmessages("");
    const formData = new FormData();
    formData.append("doctor_name", doctorName);
    formData.append("subject_id", selectedSubject);

    try {
      const res = await api.patch(
        `/api/doctors/${doctor.doctor_id}`,
        formData,
        {
          headers: {
            Authorization: `Basic ${user.token}`,
          },
        }
      );
      setmessages(res.data["message"]);
      setLoading(false);
      window.location.reload(false);
    } catch (error) {
      setLoading(false);
      setErrors(error.response.data.message);
    }
  };

  const handelClose = () => {
    selectFaculty(dafaultFaculty);
    selectYear(defaultYear);
    selectSeason(defaultSeason);
    selectSubject("");
    setmessages("");
    setErrors("");
    closePopup();
  };
  useEffect(() => {
    const faculty = selectedFaculty;
    const year = selectedYear;
    const season = selectedSeason;
    updateSubjectList({ faculty, year, season });
  }, [selectedFaculty, selectedSeason, selectedYear]);

  async function handelDel(e) {
    e.preventDefault();
    setErrors("");
    setmessages("");

    try {
      const res = await api.delete(`/api/doctors/${doctor.doctor_id}`, {
        headers: {
          Authorization: `Basic ${user.token}`,
        },
      });
      setmessages(res.data["message"]);
      window.location.reload(false);
    } catch (error) {
      setErrors(error.response.data.message);
    }
  }

  return (
    <>
      <Spinner isLoading={isLoading}>
        <div className="bg-white w-[50rem] rounded-lg py-4 px-8 shadow-xl">
          {/*----- Title ----- */}
          <h1 className="text-center text-5xl mx-6 my-5">تعديل الدكتور</h1>
          {/*----- form ----- */}
          <form onSubmit={onsubmit}>
            <div className="flex gap-3">
              <div className="flex-1">
                <TextInput
                  label="اسم الدكتور"
                  value={doctorName}
                  onChange={(e) => {
                    setDoctorName(e.target.value);
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
              <div className="flex-1"></div>
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
                  حذف الدكتور
                </div>
              </div>

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

export default EditDoctor;
