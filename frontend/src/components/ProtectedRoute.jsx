import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../app/features/user/userSlice";

const ProtectedRoute = ({ roles }) => {
  const dispatch = useDispatch();
  const user = Cookies.get("user");

  if (user) {
    dispatch(setUser(JSON.parse(user)));
  }

  const isAuthenticated = user ? true : false;
  const { role } = useSelector((state) => state.user);

  if (!isAuthenticated || !roles.includes(role)) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
