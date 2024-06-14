import { api } from "./api";

export const questionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getQuestionsByExamId: builder.query({
      query: ({ examIdQueryParam }) => ({
        url: "questions",
        method: "GET",
        params: {
          examId: examIdQueryParam,
        },
      }),
      providesTags: ["Questions"],
    }),
    createQuestion: builder.mutation({
      query: ({ examId, questionText }) => ({
        url: "questions",
        method: "POST",
        body: {
          exam_id: examId,
          question_text: questionText,
        },
      }),
    }),
    deleteQuestion: builder.mutation({
      query: ({ questionId }) => ({
        url: `questions/${questionId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Questions"],
    }),
  }),
});

export const {
  useGetQuestionsByExamIdQuery,
  useCreateQuestionMutation,
  useDeleteQuestionMutation,
} = questionApi;
