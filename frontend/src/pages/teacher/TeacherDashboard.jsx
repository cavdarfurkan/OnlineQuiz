import { useGetCoursesByUserQuery } from "../../app/api/course";
import Card from "../../components/card/Card";
import Loading from "../../components/Loading";
import { CardItemThree } from "../../components/card/CardItems";

const TeacherDashboard = () => {
  const { data, isError, isLoading, error } = useGetCoursesByUserQuery();

  if (isError) {
    console.log(error);
    return <div>error fetching data: {error.message}</div>;
  }

  return (
    <>
      <div>
        <h1>Dashboard</h1>
        <hr />
      </div>
      <div className="row justify-content-center">
        <Card title="Courses">
          {isLoading ? (
            <Loading />
          ) : (
            data.map((course, index) => (
              <CardItemThree
                key={index}
                text={`${course.short_name} - ${course.name}`}
                buttonLink={`/courses/${course.id}`}
              />
            ))
          )}
        </Card>
      </div>
    </>
  );
};

export default TeacherDashboard;
