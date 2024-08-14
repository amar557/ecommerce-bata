import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";

function LayOut() {
  return (
    <div className="flex ">
      <Sidebar />
      <div className="flex flex-col w-full ms-64">
        <TopBar />
        <Outlet />
      </div>
    </div>
  );
}

export default LayOut;
