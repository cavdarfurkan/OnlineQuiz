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
  }),
});

export const { useGetOptionsByQuestionIdQuery } = optionApi;
