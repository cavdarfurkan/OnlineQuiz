import { api } from "./api";

export const optionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getOptionsByQuestionId: builder.query({
      query: ({ questionIdQueryParam }) => ({
        url: "options",
        method: "GET",
        params: {
          questionId: questionIdQueryParam,
        },
      }),
    }),
    createOption: builder.mutation({
      query: ({ questionId, optionText, isCorrect }) => ({
        url: "options",
        method: "POST",
        body: {
          question_id: questionId,
          option_text: optionText,
          is_correct: isCorrect,
        },
      }),
    }),
  }),
});

export const { useGetOptionsByQuestionIdQuery, useCreateOptionMutation } =
  optionApi;
