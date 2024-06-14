import { useDispatch } from "react-redux";
import { useGetCoursesByUserQuery } from "../../app/api/course";

const TeacherDashboard = () => {
  const dispatch = useDispatch();
  const { data, isError, isLoading, error } = useGetCoursesByUserQuery();

  if (isError) {
    console.log(error);
    return <div>error fetching data: {error.message}</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error</div>
      ) : (
        <div>
          {data.map((course) => (
            <div key={course.id}>{course.name}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
