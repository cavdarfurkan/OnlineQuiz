import { useDispatch, useSelector } from "react-redux";
import Card from "../components/card/Card";
import { CardItemOne, CardItemThree } from "../components/card/CardItems";
import { useEffect } from "react";
import { getStudentCourses } from "../app/features/student/studentSlice";
import Loading from "../components/Loading";

const CoursesList = () => {
  const dispatch = useDispatch();
  const { courses, scheduledExams, loading, error } = useSelector(
    (state) => state.studentCoursesSlice
  );

  useEffect(() => {
    dispatch(getStudentCourses());
  }, [dispatch]);

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  return (
    <>
      <div>
        <h4>Courses List</h4>
        <hr />
      </div>
      <div className="row justify-content-between gy-3">
        <div className="col-md-7 col-12">
          <Card title="Courses">
            {loading ? (
              <Loading />
            ) : (
              courses.map((course, index) => (
                <CardItemThree
                  key={index}
                  text={course.name}
                  buttonLink={`/courses/${course.id}`}
                />
              ))
            )}
          </Card>
        </div>
        <div className="col-md-5 col-12">
          <Card title="Scheduled Exams">
            {loading ? (
              <Loading />
            ) : (
              scheduledExams.map((exam, index) => (
                <CardItemOne
                  key={index}
                  title={exam.course_short_name}
                  description={exam.exam_title}
                  text={exam.exam_date}
                  buttonLink={`/exams/${exam.exam.id}`}
                  disabled={exam.exam_date_timestamp < new Date().getTime()}
                />
              ))
            )}
          </Card>
        </div>
      </div>
    </>
  );
};

export default CoursesList;
