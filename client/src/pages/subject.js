import { useEffect, useRef, useState } from "react";
import Table from "../components/Table";

import { FaPlus } from "react-icons/fa";
import AddSubject from "../components/popups/AddSubject";
import PopUp from "../components/popups/PopUp";
import EditSubject from "../components/popups/EditSubject";
import ErrorsBox from "../components/form/ErrorsBox";
import { api } from "../components/api";
import { useAuthContext } from "../hooks/useAuthContext";

const SubjectPage = () => {
  const { user } = useAuthContext();
  const [errors, setErrors] = useState("");
  const [popup, setPopup] = useState(false);
  const openPopup = () => {
    setPopup(true);
  };
  const closePopup = () => {
    setPopup(false);
    setSelectedSubject("");
  };
  const [subjectsRows, setSubjectRows] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");

  useEffect(() => {
    api
      .get("/api/subjects", {
        headers: {
          Authorization: `Basic ${user.token}`,
        },
      })
      .then((res) => setSubjectRows(res.data));
  }, []);

  function handlRowClick(selectedRow) {
    setSelectedSubject(selectedRow);
  }

  return (
    <>
      <PopUp popUp={popup}>
        <AddSubject closePopup={closePopup}></AddSubject>
      </PopUp>
      <PopUp popUp={selectedSubject}>
        <EditSubject closePopup={closePopup} subject={selectedSubject} />
      </PopUp>
      <div className="supjectpage w-full px-6 py-4 h-screen">
        {/*----- TITLE -----*/}
        <h1 className="text-5xl text-center ml-auto px-6 py-4 mb-6 noselect">
          مواد الفريق
        </h1>
        <ErrorsBox errors={errors} />
        {/*----- container -----*/}
        <div className="container mt-2 flex gap-2">
          <Table
            Headers={HeadersList}
            infos={subjectsRows}
            onRowClick={handlRowClick}
          />
          <div>
            {/*-----  -----*/}
            <div
              className=" w-56 h-56 bg-white rounded-lg flex items-center justify-center cursor-pointer"
              onClick={openPopup}
            >
              <FaPlus className="text-gray-400 text-7xl" />
            </div>
            <div className=" w-56 h-56 bg-white mt-2 rounded-lg cursor-pointer"></div>
            <div className=" w-56 h-36 bg-white mt-2 rounded-lg"></div>
          </div>
        </div>
      </div>
    </>
  );
};

const HeadersList = [
  { displayName: "المادة", dbName: "subject_name" },
  { displayName: "الفصل", dbName: "season" },
  { displayName: "السنة", dbName: "year" },
  { displayName: "الكلية", dbName: "faculty_name" },
  { displayName: "الجامعة", dbName: "university_name" },
];

export default SubjectPage;
