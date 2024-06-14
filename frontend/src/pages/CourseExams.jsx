import { useSelector } from "react-redux";
import StudentCourseExams from "./student/StudentCourseExams";
import TeacherCourseExams from "./teacher/TeacherCourseExams";

const CourseExams = () => {
  const user = useSelector((state) => state.user);

  if (user.role === "student") {
    return <StudentCourseExams />;
  }

  if (user.role === "teacher") {
    return <TeacherCourseExams />;
  }

  return (
    <div>
      <h1>This shouldn't happen</h1>
    </div>
  );
};

export default CourseExams;
