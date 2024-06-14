import { Formik, Form, Field, ErrorMessage } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import {
  useEditCourseMutation,
  useGetCourseByIdQuery,
} from "../../app/api/course";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import {
  changeMenuItemVisibility,
  updateMenuItemPath,
} from "../../app/features/sidebar/sidebarSlice";

const editCourseSchema = Yup.object().shape({
  courseName: Yup.string()
    .required("Name is required")
    .min(5, "Name is too short")
    .trim(),
  courseShortName: Yup.string()
    .required("Short name is required")
    .min(3, "Short name must be minimum 3 characters")
    .trim(),
  courseDescription: Yup.string()
    .required("Description is required")
    .min(5, "Description is too short")
    .trim(),
  courseStartDate: Yup.date("Invalid date").required("Start date is required"),
  isArchived: Yup.boolean().required("Is archived is required"),
});

const EditCourseForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [editCourse, { isError, isLoading, error }] = useEditCourseMutation();
  const { data: course, isSuccess: courseIsSuccess } =
    useGetCourseByIdQuery(id);

  const [formData, setFormData] = useState({
    courseName: "",
    courseShortName: "",
    courseDescription: "",
    courseStartDate: "",
    isArchived: false,
  });

  useEffect(() => {
    dispatch(
      updateMenuItemPath({
        index: 6,
        path: `/courses/${id}/edit`,
      })
    );
    dispatch(
      changeMenuItemVisibility({
        index: 4,
        show: true,
      })
    );
    dispatch(
      changeMenuItemVisibility({
        index: 6,
        show: true,
      })
    );
    dispatch(
      changeMenuItemVisibility({
        index: 7,
        show: true,
      })
    );
  }, [dispatch, id]);

  useEffect(() => {
    if (courseIsSuccess) {
      setFormData({
        courseName: course.name ?? "",
        courseShortName: course.short_name ?? "",
        courseDescription: course.description ?? "",
        courseStartDate:
          new Date(course.start_date).toISOString().split("T")[0] ?? "",
        isArchived: Boolean(course.is_archived) ?? false,
      });
    }
  }, [courseIsSuccess]);

  const handleSubmit = async (values) => {
    setFormData(values);

    await toast.promise(
      editCourse({
        courseId: id,
        course: {
          short_name: values.courseShortName,
          name: values.courseName,
          description: values.courseDescription,
          start_date: values.courseStartDate,
          is_archived: Number(values.isArchived).toString(),
        },
      }),
      {
        pending: "Updating course...",
        success: {
          render({ data }) {
            return data.data.message;
          },
        },
        error: "Error updating course",
      }
    );

    return navigate(`/courses/${id}`);
  };

  const handleCancel = () => {
    setFormData({
      courseName: "",
      courseShortName: "",
      courseDescription: "",
      courseStartDate: "",
    });

    // return navigate("/courses");
  };

  return (
    <>
      <Formik
        initialValues={formData}
        validationSchema={editCourseSchema}
        onSubmit={(values) => {
          handleSubmit(values);
        }}
        enableReinitialize={true}
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

          <div className="d-flex gap-2">
            <Field
              type="checkbox"
              id="isArchived"
              name="isArchived"
              className="form-check-input"
            />
            <label htmlFor="isArchived">Is archived?</label>
            <ErrorMessage
              name="isArchived"
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
                Save
              </button>
            </div>
          </div>
        </Form>
      </Formik>
    </>
  );
};

export default EditCourseForm;
