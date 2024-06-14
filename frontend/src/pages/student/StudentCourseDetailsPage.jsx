import { useParams } from "react-router-dom";
import {
  useGetCourseByIdQuery,
  useGetStudensByCourseIdQuery,
  useJoinCourseMutation,
} from "../../app/api/course";
import Card from "../../components/card/Card";
import Loading from "../../components/Loading";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { FaEnvelope } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import {
  changeMenuItemVisibility,
  updateMenuItemPath,
} from "../../app/features/sidebar/sidebarSlice";

const StudentCourseDetailsPage = () => {
  const [isStudentJoined, setIsStudentJoined] = useState(false);

  const { id } = useParams();
  const dispatch = useDispatch();
  const { data, error, isError, isLoading } = useGetCourseByIdQuery(id);
  const {
    data: students,
    error: studentsError,
    isError: studentsIsError,
    isLoading: studentsIsLoading,
  } = useGetStudensByCourseIdQuery(id);

  useEffect(() => {
    const user = JSON.parse(Cookies.get("user"));
    const isStudentJoined = students?.some((student) => student.id === user.id);
    setIsStudentJoined(isStudentJoined);
  }, [students]);

  useEffect(() => {
    if (isStudentJoined) {
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
    }
  }, [dispatch, id, isStudentJoined]);

  const [joinCourse, { error: joinError }] = useJoinCourseMutation();
  const handleJoinCourse = async () => {
    try {
      const courseInvitation = data.invitation_code;
      await joinCourse({
        invitationQueryParam: courseInvitation.trim(),
      }).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

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
              {joinError
                ? joinError.data.message
                : !isStudentJoined && (
                    <button
                      className="btn btn-primary d-flex align-items-center justify-content-center py-2"
                      onClick={handleJoinCourse}
                    >
                      <FaEnvelope />
                    </button>
                  )}
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

export default StudentCourseDetailsPage;
