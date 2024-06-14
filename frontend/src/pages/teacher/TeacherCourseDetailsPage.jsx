import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  useGetCourseByIdQuery,
  useGetStudensByCourseIdQuery,
} from "../../app/api/course";
import { useEffect, useState } from "react";
import { changeMenuItemVisibility, updateMenuItemPath } from "../../app/features/sidebar/sidebarSlice";
import Loading from "../../components/Loading";
import Card from "../../components/card/Card";

const TeacherCourseDetailsPage = () => {
  const [isOwnCourse, setIsOwnCourse] = useState(false);

  const { id } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const { data, error, isError, isLoading, isSuccess } =
    useGetCourseByIdQuery(id);
  const {
    data: students,
    error: studentsError,
    isError: studentsIsError,
    isLoading: studentsIsLoading,
  } = useGetStudensByCourseIdQuery(id);

  useEffect(() => {
    if (isSuccess) {
      console.log(data);
      if (data.teacher_id === user.id) {
        setIsOwnCourse(true);
      }
    }
  }, [data, isSuccess, user]);

  useEffect(() => {
    if (isOwnCourse) {
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
    }
  }, [dispatch, id, isOwnCourse]);

  return (
    <div className="d-flex flex-column gap-3">
      <div>
        {isLoading ? (
          <Loading />
        ) : isError ? (
          <p>{error.data.message || error.data.errors || "Error"}</p>
        ) : (
          <>
            <div className="hstack justify-content-between mb-4">
              <h1>
                {data.short_name} - {data.name}
              </h1>
            </div>
            <span dangerouslySetInnerHTML={{ __html: data.description }}></span>
          </>
        )}
      </div>
      <Card title="Students">
        {studentsIsLoading ? (
          <Loading />
        ) : studentsIsError ? (
          <p>
            {studentsError.data.message || studentsError.data.errors || "Error"}
          </p>
        ) : (
          students.map((student, index) => (
            <div key={index}>
              <span>
                {student.first_name} {student.last_name}
              </span>
            </div>
          ))
        )}
      </Card>
    </div>
  );
};

export default TeacherCourseDetailsPage;
