import { useSelector } from "react-redux";
import StudentCourses from "./student/StudentCourses";
import TeacherCourses from "./teacher/TeacherCourses";

const CoursesPage = () => {
  const user = useSelector((state) => state.user);

  if (user.role === "student") {
    return <StudentCourses />;
  }

  if (user.role === "teacher") {
    return <TeacherCourses />;
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

export default CoursesPage;
