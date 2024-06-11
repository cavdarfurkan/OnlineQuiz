import { useParams } from "react-router-dom";
import { useGetExamsByCourseIdQuery } from "../app/api/exam";
import Card from "../components/card/Card";
import Loading from "../components/Loading";
import { CardItemOne } from "../components/card/CardItems";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { changeMenuItemVisibility } from "../app/features/sidebar/sidebarSlice";

const CourseExams = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { data: exams, isLoading, isError } = useGetExamsByCourseIdQuery(id);

  useEffect(() => {
    dispatch(
      changeMenuItemVisibility({
        index: 4,
        show: true,
      })
    );
  }, [dispatch]);

  return (
    <div>
      {isLoading ? (
        <Loading />
      ) : isError ? (
        <div>Error</div>
      ) : (
        <Card title={"Exams"}>
          {exams.map((exam, index) => (
            <CardItemOne
              key={index}
              title={exam.title}
              description={"Duration: " + exam.duration_min + " minutes"}
              text={exam.date}
              buttonLink={`/courses/${id}/exams/${exam.id}`}
            />
          ))}
          {exams.length === 0 && (
            <div className="text-center">No exams available</div>
          )}
        </Card>
      )}
    </div>
  );
};

export default CourseExams;
