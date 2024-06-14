import "./sidebar.css";
import { push as Menu } from "react-burger-menu";
import { FaChevronDown, FaChevronUp, FaHouse, FaSchool } from "react-icons/fa6";
import { useSelector } from "react-redux";
import {
  openSidebar,
  closeSidebar,
  toggleSection,
  resetMenuItems,
} from "./sidebarSlice";
import { useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const menuIcons = [
  {
    name: "house",
    icon: <FaHouse size={25} />,
  },
  {
    name: "school",
    icon: <FaSchool size={25} />,
  },
];

const Sidebar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const menuItems = useSelector((state) => {
    const items = state.sidebar.menuItems;
    const selectedMenuItems = [];

    for (let item of items) {
      if (item.roles.includes(user.role)) {
        if (item.children) {
          const children = item.children.filter((child) =>
            child.roles.includes(user.role)
          );
          if (children.length > 0) {
            selectedMenuItems.push({
              ...item,
              children,
            });
          }
        } else {
          selectedMenuItems.push(item);
        }
      }
    }
    return selectedMenuItems;
  });

  const showSidebar = useSelector((state) => state.sidebar.showSidebar);
  const expandedSections = useSelector(
    (state) => state.sidebar.expandedSections
  );

  const location = useLocation();
  useEffect(() => {
    dispatch(resetMenuItems());
  }, [dispatch, location]);

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
          {menuItems.map(
            (item, index) =>
              item.visible && (
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
                        {menuIcons.find((icon) => icon?.name === item?.icon)
                          ?.icon ?? ""}
                        <span>{item.title}</span>
                        {expandedSections[index] ? (
                          <FaChevronUp className="ms-auto" />
                        ) : (
                          <FaChevronDown className="ms-auto" />
                        )}
                      </div>
                      <div className="collapse" id={"collapse" + index}>
                        {item.children.map(
                          (child, index) =>
                            child.visible && (
                              <Link
                                to={child.path}
                                key={index}
                                onClick={() => dispatch(closeSidebar())}
                                className="btn btn-outline-secondary align-items-center d-flex fs-6 gap-3 ms-3 my-2"
                              >
                                {menuIcons.find(
                                  (icon) => icon?.name === child?.icon
                                )?.icon ?? ""}{" "}
                                <span>{child.title}</span>
                              </Link>
                            )
                        )}
                      </div>
                    </>
                  ) : (
                    <Link
                      to={item.path}
                      onClick={() => dispatch(closeSidebar())}
                      className="btn btn-outline-dark align-items-center d-flex fs-6 gap-3"
                    >
                      {menuIcons.find((icon) => icon?.name === item?.icon)
                        ?.icon ?? ""}
                      <span>{item.title}</span>
                    </Link>
                  )}
                </div>
              )
          )}
        </div>
      </Menu>
    </>
  );
};

export default Sidebar;
