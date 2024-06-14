import { useSelector } from "react-redux";
import StudentCourseDetailsPage from "./student/StudentCourseDetailsPage";
import TeacherCourseDetailsPage from "./teacher/TeacherCourseDetailsPage";

const CourseDetailsPage = () => {
  const user = useSelector((state) => state.user);

  if (user.role === "student") {
    return <StudentCourseDetailsPage />;
  }

  if (user.role === "teacher") {
    return <TeacherCourseDetailsPage />;
  }

  if (user.role === "admin") {
    return (
      <div>
        <h1>Admin All Courses</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>This shouldn't happen</h1>
    </div>
  );
};

export default CourseDetailsPage;
