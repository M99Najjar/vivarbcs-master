import { useEffect, useState } from "react";
import { api } from "../components/api";
import AddLecture from "../components/popups/AddLecture";
import { FaPlus } from "react-icons/fa";
import Table from "../components/Table";
import EditLecture from "../components/popups/EditLecture";
import PopUp from "../components/popups/PopUp";
import { useAuthContext } from "../hooks/useAuthContext";
import ErrorBox from "../components/form/ErrorsBox";

const HeadersList = [
  { displayName: "المحاضرة", dbName: "lecture_name" },
  { displayName: "الدكتور", dbName: "doctor_name" },
  { displayName: "المادة", dbName: "subject_name" },
  { displayName: "الفصل", dbName: "season" },
  { displayName: "السنة", dbName: "year" },
  { displayName: "الكلية", dbName: "faculty_name" },
  //  { displayName: "الجامعة", dbName: "university_name" },
];

const LecturesPage = () => {
  const { user } = useAuthContext();

  //states
  const [lectures, setLectures] = useState([]);
  const [popup, setPopup] = useState(false);
  const [editPopup, setEditPopup] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState("");
  const [errors, setErrors] = useState("");

  //functions
  let getData = async () => {
    try {
      const response = await api.get("/api/lectures", {
        headers: {
          Authorization: `Basic ${user.token}`,
        },
      });
      setLectures(response.data);
    } catch (error) {
      setErrors(error.response.data.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  function closePopup() {
    setEditPopup(false);
    setPopup(false);
    setSelectedLecture("");
  }
  function openPopup() {
    setPopup(true);
  }
  function handleRowClick(clikedRow) {
    setSelectedLecture(clikedRow);
    setEditPopup(true);
  }

  return (
    <>
      <PopUp popUp={editPopup}>
        <EditLecture closePopup={closePopup} lecture={selectedLecture} />
      </PopUp>
      <PopUp popUp={popup}>
        <AddLecture closePopup={closePopup}></AddLecture>
      </PopUp>
      <div className="lecturepage w-full px-6 py-4 h-screen">
        {/*----- TITLE -----*/}
        <h1 className="text-5xl text-center ml-auto px-6 py-4 mb-6 noselect">
          محاضرات الفريق
        </h1>
        <ErrorBox errors={errors} />
        {/*----- container -----*/}
        <div className="container flex gap-2 mt-2">
          <Table
            Headers={HeadersList}
            infos={lectures}
            onRowClick={handleRowClick}
          />
          <div>
            <div
              className=" w-56 h-56 bg-white rounded-lg flex items-center justify-center cursor-pointer"
              onClick={openPopup}
            >
              <FaPlus className="text-gray-400 text-7xl" />
            </div>
            <div className=" w-56 h-56 bg-white mt-2 rounded-lg"></div>
            <div className=" w-56 h-36 bg-white mt-2 rounded-lg"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LecturesPage;
