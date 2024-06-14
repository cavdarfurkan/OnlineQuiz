import { useDispatch } from "react-redux";
import { clearUser } from "../../app/features/user/userSlice";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const user = Cookies.get("user");
    if (user) {
      Cookies.remove("user");
      dispatch(clearUser());
      return navigate("/login");
    }
  }, [dispatch, navigate]);
};

export default Logout;
