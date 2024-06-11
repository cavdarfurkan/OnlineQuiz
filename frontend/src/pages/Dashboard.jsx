import { useEffect } from "react";
import Card from "../components/card/Card";
import { CardItemOne, CardItemTwo } from "../components/card/CardItems";
import { useDispatch, useSelector } from "react-redux";
import { getStudentDashboardData } from "../app/features/student/studentSlice";
import Loading from "../components/Loading";

const Dashboard = () => {
  const dispatch = useDispatch();

  const { scheduledExams, grades, loading, error } = useSelector(
    (state) => state.studentDashboardSlice
  );

  useEffect(() => {
    dispatch(getStudentDashboardData());
  }, [dispatch]);

  if (loading) {
    return <Loading />;
  }

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
            {scheduledExams.map((exam, index) => (
              <CardItemOne
                key={index}
                title={exam.course_short_name}
                description={exam.exam_title}
                text={exam.exam_date}
                buttonLink={`/courses/${exam.exam.course_id}/exams/${exam.exam.id}`}
              />
            ))}
          </Card>
        </div>
        <div className="col-md-5 col-12">
          <Card title="Grades">
            {grades.map((grade, index) => (
              <CardItemTwo
                key={index}
                title={grade.course_short_name}
                description={grade.exam_title}
                text={grade.grade}
              />
            ))}
          </Card>
        </div>
      </div>
    </>
  );
};

export default Dashboard;