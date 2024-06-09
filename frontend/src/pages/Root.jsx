import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const Root = () => {
  return (
    <>
      <Navbar />
      <main className="container my-4" id="main">
        <Outlet />
      </main>
    </>
  );
};

export default Root;
