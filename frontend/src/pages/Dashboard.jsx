import { useSelector } from "react-redux";
import StudentDashboard from "./student/StudentDashboard";
import TeacherDashboard from "./teacher/TeacherDashboard";

const Dashboard = () => {
  const user = useSelector((state) => state.user);

  if (user.role === "student") {
    return <StudentDashboard />;
  }

  if (user.role === "teacher") {
    return <TeacherDashboard />;
  }

  if (user.role === "admin") {
    return (
      <div>
        <h1>Admin Dashboard</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>This shouldn't happen</h1>
    </div>
  );
};

export default Dashboard;
