import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import LoginForm from "../components/auth/LoginForm";
import RoleChooser from "../components/auth/RoleChooser";
import { useSelector } from "react-redux";

const LoginPage = () => {
  const [role, setRole] = useState("");
  const path = window.location.pathname;

  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (user.role !== "") {
      setRole(user.role);
    }
  }, [user.role]);

  const handleRoleChange = (role) => {
    setRole(role);
  };

  return (
    <div className="container-fluid d-flex h-100">
      <div className="text-center shadow border rounded m-auto bg-light-subtle">
        <div className="m-4 row gap-4">
          <div className="vstack align-items-center gap-1">
            <FaUserCircle size={45} />
            <h1>Login</h1>
          </div>
          {role === "" ? (
            path === "/login/admin" ? (
              <LoginForm role="admin" roleChangeCallback={() => {}} />
            ) : (
              <RoleChooser roleChangeCallback={handleRoleChange} />
            )
          ) : (
            <LoginForm
              role={role}
              userEmail={user.email}
              roleChangeCallback={handleRoleChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
