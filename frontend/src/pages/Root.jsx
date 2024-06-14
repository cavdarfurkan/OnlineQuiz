import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Root = () => {
  return (
    <>
      <Navbar />
      <main className="container my-4" id="main">
        <Outlet />
      </main>

      <ToastContainer position="top-right" autoClose={3000} closeOnClick pauseOnFocusLoss={false} />
    </>
  );
};

export default Root;
