import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import { useSignupMutation } from "../../app/api/auth";
import Loading from "../Loading";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../app/features/user/userSlice";

const signupSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .required("Required"),
  lastName: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .min(5, "Password must be at least 5 characters")
    .required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Required"),
  roleSelect: Yup.string().required("Required"),
});

const SignupForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    roleSelect: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [signup, { isError, isLoading, error }] = useSignupMutation();

  const handleSubmit = async (values) => {
    setFormData(values);
    try {
      await signup(values).unwrap();
      dispatch(
        setUser({
          email: values.email,
          role: values.roleSelect,
        })
      );
      return navigate("/login");
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
            initialValues={{ ...formData }}
            validationSchema={signupSchema}
            onSubmit={(values) => {
              handleSubmit(values);
            }}
          >
            <Form className="vstack gap-3">
              <div className="input-group gap-2">
                <div className="form-floating">
                  <Field
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    className="form-control"
                  />
                  <label htmlFor="firstName">First Name</label>
                  <ErrorMessage
                    name="firstName"
                    component="div"
                    className="ms-1 text-danger text-start form-text"
                  />
                </div>
                <div className="form-floating">
                  <Field
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    className="form-control"
                  />
                  <label htmlFor="lastName">Last Name</label>
                  <ErrorMessage
                    name="lastName"
                    component="div"
                    className="ms-1 text-danger text-start form-text"
                  />
                </div>
              </div>

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
              <div className="input-group gap-2">
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
                <div className="form-floating">
                  <Field
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    className="form-control"
                  />
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="ms-1 text-danger text-start form-text"
                  />
                </div>
              </div>

              <div className="form-floating">
                <Field as="select" name="roleSelect" className="form-select">
                  <option value="" disabled>
                    Select a role
                  </option>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </Field>
                <label htmlFor="roleSelect">Role</label>
                <ErrorMessage
                  name="roleSelect"
                  component="div"
                  className="ms-1 text-danger text-start form-text"
                />
              </div>

              <div className="mt-2">
                {isError && (
                  <div className="alert alert-danger" role="alert">
                    {error?.data?.message ??
                      (Array.isArray(error?.data.errors) &&
                        error?.data.errors.join(", "))}
                  </div>
                )}
                <button
                  type="submit"
                  className="btn btn-primary w-100 p-2"
                  disabled={isLoading}
                >
                  Sign up
                </button>
              </div>
            </Form>
          </Formik>
          <div className="m-0 p-0">
            <Link
              to="/login"
              className="link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
            >
              Login
            </Link>
          </div>
        </>
      )}
    </>
  );
};

export default SignupForm;
