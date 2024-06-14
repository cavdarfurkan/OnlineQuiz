import Sidebar from "../app/features/sidebar/Sidebar";
import { FaBars, FaCircleUser, FaX } from "react-icons/fa6";
import { toggleSidebar } from "../app/features/sidebar/sidebarSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Navbar = () => {
  const showSidebar = useSelector((state) => state.sidebar.showSidebar);
  const dispatch = useDispatch();

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary" id="navbar">
        <div className="container-fluid">
          <div className="btn" onClick={() => dispatch(toggleSidebar())}>
            {showSidebar ? <FaX size={30} /> : <FaBars size={30} />}
          </div>
          <div className="dropdown">
            <div
              className="btn dropdown-toggle ms-auto"
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <FaCircleUser size={30} />
            </div>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <li>
                <Link to="/logout" className="dropdown-item">
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <Sidebar />
    </>
  );
};

export default Navbar;
