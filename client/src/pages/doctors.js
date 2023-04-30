import { useState, useEffect } from "react";
import AddDoctor from "../components/popups/AddDoctor";
import { FaPlus } from "react-icons/fa";
import { api } from "../components/api";
import Table from "../components/Table";
import PopUp from "../components/popups/PopUp";
import EditDoctor from "../components/popups/EditDoctor";
import ErrorBox from "../components/form/ErrorsBox";
import { useAuthContext } from "../hooks/useAuthContext";

const HeadersList = [
  { displayName: "الدكتور", dbName: "doctor_name" },
  { displayName: "المادة", dbName: "subject_name" },
  { displayName: "الفصل", dbName: "season" },
  { displayName: "السنة", dbName: "year" },
  { displayName: "كلية", dbName: "faculty_name" },
  { displayName: "جامعة", dbName: "university_name" },
];

const DoctorsPage = () => {
  const { user } = useAuthContext();
  const [popup, setPopup] = useState(false);
  const [editDoctorPopup, setEditDoctorPopup] = useState(false);
  const [DoctorsRows, setSubjectRows] = useState([]);
  const [selectedDoctor, selectDoctor] = useState("");
  const [errors, setErrors] = useState("");

  const openPopup = () => {
    setPopup(true);
  };
  const closePopup = () => {
    setPopup(false);
    setEditDoctorPopup(false);
  };

  const getData = async () => {
    try {
      const response = await api.get("/api/doctors", {
        headers: {
          Authorization: `Basic ${user.token}`,
        },
      });
      setSubjectRows(response.data);
    } catch (error) {
      setErrors(error.response.data.message);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  function handelRowClick(clickedRow) {
    setEditDoctorPopup(true);
    selectDoctor(clickedRow);
  }

  return (
    <>
      <PopUp popUp={editDoctorPopup}>
        <EditDoctor closePopup={closePopup} doctor={selectedDoctor} />
      </PopUp>
      <PopUp popUp={popup}>
        <AddDoctor closePopup={closePopup} />
      </PopUp>
      <div className="supjectpage w-full px-6 py-4 h-screen">
        {/*----- TITLE -----*/}
        <h1 className="text-5xl text-center ml-auto px-6 py-4 mb-6 noselect">
          الدكاترة
        </h1>
        <ErrorBox errors={errors} />

        {/*----- container -----*/}
        <div className="container flex gap-2 mt-2">
          <Table
            Headers={HeadersList}
            infos={DoctorsRows}
            onRowClick={handelRowClick}
          />
          <div>
            {/*-----  -----*/}
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

export default DoctorsPage;
