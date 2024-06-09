import { FaUserCircle } from "react-icons/fa";
import SignupForm from "../components/auth/SignupForm";

const SignupPage = () => {
  return (
    <div className="container-fluid d-flex h-100">
      <div className="text-center shadow border rounded m-auto bg-light-subtle">
        <div className="m-4 row gap-4">
          <div className="vstack align-items-center gap-1">
            <FaUserCircle size={45} />
            <h1>Sign Up</h1>
          </div>
          <SignupForm />
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
