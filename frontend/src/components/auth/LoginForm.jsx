import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../app/api/auth";
import Loading from "../Loading";
import { useDispatch } from "react-redux";
import { setUser } from "../../app/features/user/userSlice";
import Cookies from "js-cookie";

const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .min(5, "Password must be at least 5 characters")
    .required("Required"),
});

const LoginForm = ({ role, userEmail, roleChangeCallback }) => {
  const [email, setEmail] = useState(userEmail || "");
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const [login, { isError, isLoading, error }] = useLoginMutation();

  const handleSubmit = async (values) => {
    setEmail(values.email);
    try {
      const payload = await login({
        body: values,
        queryParams: { role: role },
      }).unwrap();

      Cookies.set("user", JSON.stringify(payload.user), { sameSite: "strict" });

      dispatch(
        setUser({
          id: payload.user.id,
          email: payload.user.email,
          firstname: payload.user.firstname,
          lastname: payload.user.lastname,
          role: payload.user.role,
        })
      );

      return navigate("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Formik
            initialValues={{ email: email, password: "" }}
            validationSchema={loginSchema}
            onSubmit={(values) => {
              handleSubmit(values);
            }}
          >
            <Form className="vstack gap-3">
              <div className="form-floating">
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="form-control"
                />
                <label htmlFor="email">Email</label>
                <ErrorMessage
                  name="email"
                  component="div"
                  className="ms-1 text-danger text-start form-text"
                />
              </div>

              <div className="form-floating">
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="form-control"
                />
                <label htmlFor="password">Password</label>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="ms-1 text-danger text-start form-text"
                />
              </div>

              <div className="mt-2">
                {isError && (
                  <div className="alert alert-danger" role="alert">
                    {error?.data?.message}
                  </div>
                )}
                <button
                  type="submit"
                  className="btn btn-primary w-100 p-2"
                  disabled={isLoading}
                >
                  Login
                </button>
              </div>
            </Form>
          </Formik>
        </>
      )}
      {role !== "admin" && (
        <div className="m-0 p-0 vstack gap-2 align-items-center">
          <Link
            to="/signup"
            className="link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
          >
            Sign Up
          </Link>
          <Link
            className="link-dark link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
            onClick={() => roleChangeCallback("")}
          >
            Back
          </Link>
        </div>
      )}
    </>
  );
};

export default LoginForm;
