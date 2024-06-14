import { useDispatch, useSelector } from "react-redux";
import { useGetCoursesByUserQuery } from "../../app/api/course";
import { useEffect } from "react";
import { getExamsByCourse } from "../../app/features/teacher/teacherExamsSlice";
import Card from "../../components/card/Card";
import Loading from "../../components/Loading";
import { CardItemOne, CardItemThree } from "../../components/card/CardItems";

const TeacherCourses = () => {
  const dispatch = useDispatch();
  const {
    data: courses,
    isError,
    isLoading,
    error,
  } = useGetCoursesByUserQuery();
  const {
    exams,
    loading: examsLoading,
    error: examsError,
  } = useSelector((state) => state.teacherExamsSlice);

  useEffect(() => {
    if (!courses) return;

    dispatch(getExamsByCourse(courses)).unwrap();
  }, [courses, dispatch]);

  if (isError || examsError) {
    console.log(error);
    return <div>error fetching data: {error.message}</div>;
  }

  return (
    <>
      <div>
        <h1>Courses</h1>
        <hr />
      </div>
      <div className="row justify-content-between gy-3">
        <div className="col-md-7 col-12">
          <Card title="Courses" headerButtonText="New Course" headerButtonLink="/courses/new">
            {isLoading ? (
              <Loading />
            ) : (
              courses.map((course, index) => (
                <CardItemThree
                  key={index}
                  text={`${course.short_name} - ${course.name}`}
                  buttonLink={`/courses/${course.id}`}
                />
              ))
            )}
          </Card>
        </div>
        <div className="col-md-5 col-12">
          <Card title="Exams">
            {examsLoading ? (
              <Loading />
            ) : (
              exams.map((exam, index) => (
                <CardItemOne
                  key={index}
                  title={exam.course_short_name}
                  description={exam.examTitle}
                  text={exam.examDate}
                  buttonLink={`/exams/${exam.examId}`}
                />
              ))
            )}
          </Card>
        </div>
      </div>
    </>
  );
};

export default TeacherCourses;
