import { api } from "./api";

export const courseApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCoursesByUser: builder.query({
      query: () => ({
        url: "courses",
        method: "GET",
      }),
      providesTags: ["UserCourses"],
    }),
    getCourseById: builder.query({
      query: (courseId) => `courses/${courseId}`,
      providesTags: ["CourseDetail"],
    }),
    getStudensByCourseId: builder.query({
      query: (courseId) => `courses/${courseId}/students`,
      providesTags: ["CourseStudents"],
    }),
    joinCourse: builder.mutation({
      query: ({ invitationQueryParam }) => ({
        url: "courses/join",
        method: "GET",
        params: {
          invitation: invitationQueryParam,
        },
      }),
      invalidatesTags: [
        "UpcomingCourses",
        "CourseDetail",
        "CourseStudents",
        "UserCourses",
      ],
    }),
    getUpcomingCourses: builder.query({
      query: () => ({
        url: "courses/upcoming",
        method: "GET",
      }),
      providesTags: ["UpcomingCourses"],
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
    createCourse: builder.mutation({
      query: (course) => ({
        url: "courses",
        method: "POST",
        body: course,
      }),
      invalidatesTags: ["UpcomingCourses", "UserCourses"],
    }),
    editCourse: builder.mutation({
      query: ({ courseId, course }) => ({
        url: `courses/${courseId}`,
        method: "PATCH",
        body: course,
      }),
      invalidatesTags: ["UpcomingCourses", "UserCourses", "CourseDetail"],
    }),
  }),
});

export const {
  useGetCoursesByUserQuery,
  useGetCourseByIdQuery,
  useGetStudensByCourseIdQuery,
  useJoinCourseMutation,
  useGetUpcomingCoursesQuery,
  useCreateCourseMutation,
  useEditCourseMutation,
} = courseApi;
