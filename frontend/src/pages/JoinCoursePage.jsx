import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { joinCourse } from "../app/features/student/studentSlice";
import Loading from "../components/Loading";
import { useEffect } from "react";
import { useGetUpcomingCoursesQuery } from "../app/api/course";
import Card from "../components/card/Card";
import {
  CardItemOne,
  CardItemThree,
  CardItemTwo,
} from "../components/card/CardItems";

const joinCourseSchema = Yup.object().shape({
  courseCode: Yup.number().required("Required"),
  invitation: Yup.string().required("Required"),
});

const JoinCoursePage = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(
    (state) => state.studentJoinCoursesSlice
  );

  const {
    data: upcomingCourses,
    isError,
    isLoading,
  } = useGetUpcomingCoursesQuery();

  console.log(upcomingCourses);

  const handleJoinCourse = () => {
    // const courseCode = document.getElementById("courseCode").value;
    dispatch(joinCourse({ courseId: 4, invitation: "wiqx47" }));
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  return (
    <div>
      <h4>Join Course</h4>
      <hr />
      <div className="row">
        <div className="col-md-6">
          <div className="form-group mb-3">
            <label htmlFor="courseCode">Course Code</label>
            <input type="text" className="form-control" id="courseCode" />
          </div>
          {isLoading ? (
            <Loading />
          ) : isError ? (
            <div>Error</div>
          ) : (
            <Card>
              {upcomingCourses.map((course, index) => (
                <CardItemTwo
                  key={index}
                  title={course.name}
                  description={course.start_date}
                />
              ))}
            </Card>
          )}
          <button className="btn btn-primary" onClick={handleJoinCourse}>
            Join Course
          </button>
        </div>
      </div>
    </div>
  );
};
export default JoinCoursePage;
