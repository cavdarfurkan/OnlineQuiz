import { Link } from "react-router-dom";

const RoleChooser = ({ roleChangeCallback }) => {
  return (
    <>
      <div className="vstack gap-3">
        <div
          className="btn btn-primary p-2"
          onClick={() => roleChangeCallback("student")}
        >
          Student
        </div>
        <div
          className="btn btn-secondary p-2"
          onClick={() => roleChangeCallback("teacher")}
        >
          Teacher
        </div>
      </div>
      <div className="m-0 p-0">
        <Link
          to="/signup"
          className="link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
        >
          Sign Up
        </Link>
      </div>
    </>
  );
};

export default RoleChooser;
