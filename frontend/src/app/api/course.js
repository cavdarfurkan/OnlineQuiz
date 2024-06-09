import { api } from "./api";

export const courseApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCoursesByUser: builder.query({
      query: () => ({
        url: "courses",
        method: "GET",
      }),
    }),
    getCourseById: builder.query({
      query: (courseId) => `courses/${courseId}`,
    }),
    joinCourse: builder.query({
      query: ({ courseId, invitationQueryParam }) => ({
        url: `courses/${courseId}/join`,
        method: "GET",
        params: {
          invitation: invitationQueryParam,
        },
      }),
    }),
    getUpcomingCourses: builder.query({
      query: () => ({
        url: "courses/upcoming",
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.map((course) => {
          const { start_date, ...data } = course;
          return {
            ...data,
            start_date: new Date(start_date)
              .toISOString()
              .split("T")
              .join(" ")
              .split(".")[0]
              .replace("T", " "),
          };
        });
      },
    }),
  }),
});

export const {
  useGetCoursesByUserQuery,
  useGetCourseByIdQuery,
  useGetUpcomingCoursesQuery,
} = courseApi;
