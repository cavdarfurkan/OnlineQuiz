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
            timestamp: new Date(date).getTime(),
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
    submitExam: builder.mutation({
      query: ({ examId, startTime, endTime, grade }) => ({
        url: `exams/student-exams/${examId}`,
        method: "POST",
        body: {
          start_time: startTime,
          end_time: endTime,
          grade: grade,
        },
      }),
    }),
    submitAnswers: builder.mutation({
      query: ({ questionId, answeredOptionId }) => ({
        url: `questions/${questionId}/answer`,
        method: "POST",
        body: {
          answered_option_id: answeredOptionId,
        },
      }),
      transformErrorResponse: (response) => {
        return response.data;
      },
    }),
  }),
});

export const { useGetExamsByCourseIdQuery } = examApi;
