import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";

const HomePage = () => {
  return (
    <>
      <SideBar />
      <Outlet />
    </>
  );
};

export default HomePage;
