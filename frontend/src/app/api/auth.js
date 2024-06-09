import { api } from "./api";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ body, queryParams }) => ({
        url: "auth/login",
        method: "POST",
        params: queryParams,
        body: body,
      }),
    }),
    signup: builder.mutation({
      query: (body) => ({
        url: "auth/signup",
        method: "POST",
        body: {
          email: body.email,
          password: body.password,
          confirm_password: body.confirmPassword,
          firstname: body.firstName,
          lastname: body.lastName,
          role: body.roleSelect,
        },
      }),
    }),
    logout: builder.query({
      query: () => ({
        url: "auth/logout",
        method: "GET",
      }),
    }),
  }),
});

export const { useLoginMutation, useSignupMutation, useLogoutQuery } = authApi;
