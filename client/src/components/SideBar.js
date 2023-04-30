import { useState } from "react";
import { Link } from "react-router-dom";
import { FaChalkboardTeacher, FaBook, FaStore, FaEdit } from "react-icons/fa";
import { IoIosPaper } from "react-icons/io";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";
import { ReactComponent as ProfileSVG } from "../assets/Profile.svg";
const items = [
  {
    id: 1,
    name: "المحاضرات",
    icon: <IoIosPaper className="mt-1" />,
    link: "lectures",
  },
  {
    id: 2,
    name: "الدكاترة",
    icon: <FaChalkboardTeacher className="mt-1" />,
    link: "doctors",
  },
  {
    id: 3,
    name: "المواد",
    icon: <FaBook className="mt-1" />,
    link: "subjects",
  },
  {
    id: 4,
    name: "المكتبة",
    icon: <FaStore className="mt-1" />,
    link: "products",
  },
];

const urlToId = {
  "/": 1,
  "/lectures": 1,
  "/doctors": 2,
  "/subjects": 3,
  "/products": 4,
};

const SideBar = () => {
  const { user } = useAuthContext();
  const { logout } = useLogout();

  const handlLogout = () => {
    logout();
  };

  const url = window.location.pathname;
  const urlId = urlToId[url.toLowerCase()];
  const [selected, setSelected] = useState(urlId);
  return (
    <div className="bg-white w-56 h-screen flex flex-col justify-around noselect">
      {/*top section*/}

      {user && (
        <div className="mt-10 mr-auto ml-auto cursor-pointer">
          <Link to="/user/edit">
            <div className="w-40 h-40  overflow-hidden">
              <ProfileSVG className="w-40 h-40" />
            </div>

            <h1 className="text-center mt-4 text-xl font-bold flex ">
              <FaEdit className="m-1" />
              {user.user.user_name}
            </h1>
            <div
              className="hover:cursor-pointer text-gray-400 text-sm text-center"
              onClick={handlLogout}
            >
              تسجيل الخروج
            </div>
          </Link>
        </div>
      )}
      {/*middle section*/}
      <div className=" w-full h-96 overflow-y-scroll">
        <ul className="w-56">
          {items.map((e) => (
            <SideBarItem
              item={e}
              selected={selected}
              key={e.id}
              setSelected={setSelected}
            />
          ))}
        </ul>
      </div>
      {/*last section*/}

      <div
        className="h-5 w-56 bg-black absolute bottom-0 right-0 flex justify-center items-center hover:cursor-pointer"
        onClick={() => {
          window.open("https://cortex-group.net/");
        }}
      >
        <p className="text-white text-xs">
          created and maintainend by cortex-group
        </p>
      </div>
    </div>
  );
};

const SideBarItem = (props) => {
  const { item, selected, setSelected } = props;
  const isSleceted = selected === item.id;

  const onclick = () => {
    setSelected(item.id);
  };

  return (
    <li>
      <Link to={item.link} onClick={onclick}>
        <div
          className={`w-52 px-6 py-4 flex align-middle gap-3 text-xl rounded-l-full  cursor-pointer relative ${
            isSleceted ? "bg-red-500 text-white" : "hover:bg-slate-200"
          }`}
        >
          <div
            className={`w-1.5 bg-red-900 absolute top-0 bottom-0 right-0 ${
              isSleceted ? "visible" : "hidden"
            }`}
          />
          {item.icon}
          <span className="">{item.name}</span>
        </div>
      </Link>
    </li>
  );
};

export default SideBar;
