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
    }),
  }),
});

export const { useGetQuestionsByExamIdQuery } = questionApi;
