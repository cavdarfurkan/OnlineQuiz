import { api } from "./api";

export const examApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getExamsByCourseId: builder.query({
      query: (courseIdParam) => ({
        url: "exams",
        method: "GET",
        params: {
          courseId: courseIdParam,
        },
      }),
      transformResponse: (response) => {
        return response.map((exam) => {
          const { date, ...data } = exam;
          return {
            ...data,
            date: new Date(date)
              .toISOString()
              .split("T")
              .join(" ")
              .split(".")[0]
              .replace("T", " "),
          };
        });
      },
    }),
    getStudentExams: builder.query({
      query: (studentId) => `exams/student-exams/${studentId}`,
    }),
    getExamById: builder.query({
      query: (examId) => `exams/${examId}`,
    }),
  }),
});

export const { useGetExamsByCourseIdQuery } = examApi;
