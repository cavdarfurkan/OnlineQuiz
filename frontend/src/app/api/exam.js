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
      providesTags: ["Exams"],
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
      providesTags: ["Exams"],
    }),
    getExamById: builder.query({
      query: (examId) => `exams/${examId}`,
      providesTags: ["Exam"],
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
      invalidatesTags: ["Exams"],
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
    deleteExam: builder.mutation({
      query: (examId) => ({
        url: `exams/${examId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Exams", "Exam"],
    }),
    createExam: builder.mutation({
      query: (exam) => ({
        url: "exams",
        method: "POST",
        body: exam,
      }),
      invalidatesTags: ["Exams"],
    }),
  }),
});

export const {
  useGetExamsByCourseIdQuery,
  useDeleteExamMutation,
  useCreateExamMutation,
} = examApi;
