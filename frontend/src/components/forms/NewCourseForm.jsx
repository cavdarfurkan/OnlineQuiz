import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { useCreateCourseMutation } from "../../app/api/course";
import { useNavigate } from "react-router-dom";

const newCourseSchema = Yup.object().shape({
  courseName: Yup.string().required("Required").trim(),
  courseShortName: Yup.string().required("Required").trim(),
  courseDescription: Yup.string().required("Required").trim(),
  courseStartDate: Yup.date().required("Required"),
});

const NewCourseForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    courseName: "",
    courseShortName: "",
    courseDescription: "",
    courseStartDate: "",
  });

  const [createCourse, { isError, isLoading, error }] =
    useCreateCourseMutation();

  const handleSubmit = async (values) => {
    setFormData(values);

    try {
      const { id: courseId } = await createCourse({
        short_name: values.courseShortName,
        name: values.courseName,
        description: values.courseDescription,
        start_date: values.courseStartDate,
      }).unwrap();

      console.log(courseId);
      // navigate to course details page
      // return navigate("/courses");
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = () => {
    setFormData({
      courseName: "",
      courseShortName: "",
      courseDescription: "",
      courseStartDate: "",
      courseStartTime: "",
    });

    return navigate("/courses");
  };

  return (
    <>
      <Formik
        initialValues={{ ...formData }}
        validationSchema={newCourseSchema}
        onSubmit={(values) => {
          handleSubmit(values);
        }}
      >
        <Form className="vstack gap-3">
          <div className="form-floating">
            <Field
              type="text"
              id="courseName"
              name="courseName"
              placeholder="Course Name"
              className="form-control"
            />
            <label htmlFor="courseName">Course Name</label>
            <ErrorMessage
              name="courseName"
              component="div"
              className="ms-1 text-danger text-start form-text"
            />
          </div>

          <div className="form-floating">
            <Field
              type="text"
              id="courseShortName"
              name="courseShortName"
              placeholder="Course Short Name"
              className="form-control"
            />
            <label htmlFor="courseShortName">Course Short Name</label>
            <ErrorMessage
              name="courseShortName"
              component="div"
              className="ms-1 text-danger text-start form-text"
            />
          </div>

          <div className="form-floating">
            <Field
              as="textarea"
              id="courseDescription"
              name="courseDescription"
              placeholder="Course Description"
              className="form-control"
            />
            <label htmlFor="courseDescription">Course Description</label>
            <ErrorMessage
              name="courseDescription"
              component="div"
              className="ms-1 text-danger text-start form-text"
            />
          </div>

          {/* <div className="input-group gap-2"> */}
          <div className="form-floating">
            <Field
              type="date"
              id="courseStartDate"
              name="courseStartDate"
              placeholder="Course Start Date"
              className="form-control"
            />
            <label htmlFor="courseStartDate">Course Start Date</label>
            <ErrorMessage
              name="courseStartDate"
              component="div"
              className="ms-1 text-danger text-start form-text"
            />
          </div>

          {/* <div className="form-floating">
              <Field
                type="time"
                id="courseStartTime"
                name="courseStartTime"
                placeholder="Course Start Time"
                className="form-control"
              />
              <label htmlFor="courseStartTime">Course Start Time</label>
              <ErrorMessage
                name="courseStartTime"
                component="div"
                className="ms-1 text-danger text-start form-text"
              />
            </div> */}
          {/* </div> */}

          <div className="mt-2">
            {isError && (
              <div className="alert alert-danger" role="alert">
                {error?.data?.message ??
                  (Array.isArray(error?.data.errors) &&
                    error?.data.errors.join(", "))}
              </div>
            )}
            <div className="d-flex justify-content-end gap-1">
              <button
                className="btn btn-danger"
                type="reset"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                type="submit"
                disabled={isLoading}
              >
                Create Course
              </button>
            </div>
          </div>
        </Form>
      </Formik>
    </>
  );
};

export default NewCourseForm;
