import { useEffect } from "react";
import Card from "../../components/card/Card";
import { CardItemOne, CardItemTwo } from "../../components/card/CardItems";
import { useDispatch, useSelector } from "react-redux";
import { getStudentDashboardData } from "../../app/features/student/studentSlice";
import Loading from "../../components/Loading";

const StudentDashboard = () => {
  const dispatch = useDispatch();

  const { scheduledExams, grades, loading, error } = useSelector(
    (state) => state.studentDashboardSlice
  );

  useEffect(() => {
    dispatch(getStudentDashboardData());
  }, [dispatch]);

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  return (
    <>
      <div>
        <h4>Dashboard</h4>
        <hr />
      </div>
      <div className="row justify-content-between gy-3">
        <div className="col-md-7 col-12">
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
        <div className="col-md-5 col-12">
          <Card title="Grades">
            {loading ? (
              <Loading />
            ) : (
              grades.map((grade, index) => (
                <CardItemTwo
                  key={index}
                  title={grade.course_short_name}
                  description={grade.exam_title}
                  text={grade.grade.toString()}
                />
              ))
            )}
          </Card>
        </div>
      </div>
    </>
  );
};

export default StudentDashboard;
