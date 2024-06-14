import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  changeMenuItemVisibility,
  updateMenuItemPath,
} from "../../app/features/sidebar/sidebarSlice";
import { useParams } from "react-router-dom";
import {
  useDeleteExamMutation,
  useGetExamsByCourseIdQuery,
} from "../../app/api/exam";
import Loading from "../../components/Loading";
import { CardItemOne } from "../../components/card/CardItems";
import Card from "../../components/card/Card";
import { toast } from "react-toastify";

const TeacherCourseExams = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { data: exams, isLoading } = useGetExamsByCourseIdQuery(id);
  const [deleteExam] = useDeleteExamMutation();

  useEffect(() => {
    dispatch(
      updateMenuItemPath({
        index: 6,
        path: `/courses/${id}/edit`,
      })
    );
    dispatch(
      updateMenuItemPath({
        index: 4,
        path: `/courses/${id}/exams`,
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

  const handleDeleteExam = async (examId) => {
    await toast.promise(deleteExam(examId), {
      success: "Exam deleted successfully",
      error: "Error deleting exam",
    });
  };

  return (
    <>
      <div>
        <h1>Course Exams</h1>
        <hr />
      </div>
      <div className="row justify-content-between gy-3">
        <div className="col-md-7col-12">
          <Card
            title="Exams"
            headerButtonText="New Exam"
            headerButtonLink={`/courses/${id}/exams/new`}
          >
            {isLoading ? (
              <Loading />
            ) : (
              exams.map((exam, index) => (
                <CardItemOne
                  key={index}
                  title={exam.title}
                  text={exam.date}
                  deleteCallback={() => handleDeleteExam(exam.id)}
                />
              ))
            )}
          </Card>
        </div>
      </div>
    </>
  );
};

export default TeacherCourseExams;
