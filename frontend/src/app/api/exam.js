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
