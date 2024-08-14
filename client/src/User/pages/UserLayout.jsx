import { Outlet } from "react-router";
import Header from "../components/Header";

function UserLayout() {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
}

export default UserLayout;
