import "./sidebar.css";
import { push as Menu } from "react-burger-menu";
import { FaChevronDown, FaChevronUp, FaHouse, FaSchool } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { openSidebar, closeSidebar, toggleSection } from "./sidebarSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

const menuItems = [
  {
    title: "Home",
    icon: <FaHouse size={25} />,
    path: "/dashboard",
  },
  {
    title: "Courses",
    icon: <FaSchool size={25} />,
    children: [
      {
        title: "List",
        // icon: <FaSchool size={25} />,
        path: "/courses",
      },
      {
        title: "Join",
        path: "/courses/join",
      },
    ],
  },
];

const Sidebar = () => {
  const dispatch = useDispatch();
  const showSidebar = useSelector((state) => state.sidebar.showSidebar);
  const expandedSections = useSelector(
    (state) => state.sidebar.expandedSections
  );
  const user = JSON.parse(Cookies.get("user"));

  return (
    <>
      <Menu
        noOverlay
        pageWrapId="main"
        outerContainerId="root"
        isOpen={showSidebar}
        disableAutoFocus={true}
        onStateChange={(state) => {
          if (state.isOpen) {
            dispatch(openSidebar());
          } else {
            dispatch(closeSidebar());
          }
        }}
        className="bg-light border-end shadow-sm"
      >
        <div className="d-flex flex-column gap-2">
          <h4 className="mt-0 pt-0">
            Hello, {user.firstname} {user.lastname}
          </h4>
          {menuItems.map((item, index) => (
            <div key={index}>
              {item.children ? (
                <>
                  <div
                    className="btn btn-outline-dark align-items-center d-flex fs-6 gap-3"
                    data-bs-toggle="collapse"
                    data-bs-target={"#collapse" + index}
                    aria-expanded="false"
                    aria-controls={"collapse" + index}
                    onClick={() => dispatch(toggleSection({ index }))}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                    {expandedSections[index] ? (
                      <FaChevronUp className="ms-auto" />
                    ) : (
                      <FaChevronDown className="ms-auto" />
                    )}
                  </div>
                  <div className="collapse" id={"collapse" + index}>
                    {item.children.map((child, index) => (
                      <Link
                        to={child.path}
                        key={index}
                        onClick={() => dispatch(closeSidebar())}
                        className="btn btn-outline-secondary align-items-center d-flex fs-6 gap-3 ms-3 my-2"
                      >
                        {child.icon}
                        <span>{child.title}</span>
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link
                  to={item.path}
                  onClick={() => dispatch(closeSidebar())}
                  className="btn btn-outline-dark align-items-center d-flex fs-6 gap-3"
                >
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              )}
            </div>
          ))}
        </div>
      </Menu>
    </>
  );
};

export default Sidebar;
