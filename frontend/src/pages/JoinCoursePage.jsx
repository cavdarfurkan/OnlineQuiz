import * as Yup from "yup";
import Loading from "../components/Loading";
import {
  useGetUpcomingCoursesQuery,
  useJoinCourseMutation,
} from "../app/api/course";
import Card from "../components/card/Card";
import { CardItemOne } from "../components/card/CardItems";
import { Field, Formik, Form, ErrorMessage } from "formik";
import { FaEnvelope } from "react-icons/fa6";

const joinCourseSchema = Yup.object().shape({
  courseInvitation: Yup.string().required("Required").trim(),
});

const JoinCoursePage = () => {
  const [joinCourse, { error }] = useJoinCourseMutation();
  const {
    data: upcomingCourses,
    isError,
    isLoading,
  } = useGetUpcomingCoursesQuery();

  const handleJoinCourse = async (values) => {
    try {
      const { courseInvitation } = values;
      await joinCourse({
        invitationQueryParam: courseInvitation.trim(),
      }).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div>
        <h4>Join Course</h4>
        <hr />
      </div>
      <div className="col-12">
        <div className="mb-3">
          <Formik
            initialValues={{ courseInvitation: "" }}
            validationSchema={joinCourseSchema}
            onSubmit={async (values) => await handleJoinCourse(values)}
          >
            <Form>
              <div className="w100 d-flex gap-2">
                <Field
                  type="text"
                  id="courseInvitation"
                  name="courseInvitation"
                  placeholder="Invitation Code"
                  className="form-control"
                />
                <button
                  className="btn btn-primary d-flex align-items-center"
                  type="submit"
                >
                  <FaEnvelope />
                </button>
              </div>
              <ErrorMessage
                name="courseInvitation"
                component="div"
                className="ms-1 text-danger text-start form-text"
              />
              {error && (
                <div className="ms-1 text-danger text-start form-text">
                  {error.data.message}
                </div>
              )}
            </Form>
          </Formik>
        </div>
        <div>
          {isLoading ? (
            <Loading />
          ) : isError ? (
            <div>Error</div>
          ) : (
            <Card>
              {upcomingCourses.map((course, index) => (
                <CardItemOne
                  key={index}
                  title={course.short_name}
                  description={course.name}
                  text={course.start_date}
                  buttonLink={`/courses/${course.id}`}
                />
              ))}
              {upcomingCourses.length === 0 && (
                <div className="text-center">No courses available</div>
              )}
            </Card>
          )}
        </div>
      </div>
    </>
  );
};
export default JoinCoursePage;
