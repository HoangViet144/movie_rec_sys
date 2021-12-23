import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '../utils/axios-settings'

const apiSlice = createApi({
  reducerPath: 'appApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Movie'],
  endpoints: (builder) => {
    return {
      register: builder.mutation({
        query: ({ email, password }) => ({
          url: `/register`,
          method: 'POST',
          data: {
            email,
            password,
          },
        }),
      }),

      login: builder.mutation({
        query: ({ email, password }) => ({
          url: `/login`,
          method: 'POST',
          data: {
            email,
            password,
          },
        }),
      }),

      rating: builder.mutation({
        query: ({ movieid, rating, token }) => ({
          url: `/rating`,
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          data: {
            movieid,
            rating,
          },
        }),
      }),

      watching: builder.mutation({
        query: ({ movieid, rating, token }) => ({
          url: `/watching`,
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          data: {
            movieid,
            rating,
          },
        }),
      }),

      getMovies: builder.query({
        query: ({ token }) => ({
          url: `/movies-rating`,
          headers: { Authorization: `Bearer ${token}` },
        }),
        providesTags: ['Movie'],
      }),

      getMoviesByCode: builder.query({
        query: ({ id, token }) => ({
          url: `/movies/${id}`,
          headers: { Authorization: `Bearer ${token}` },
        }),
      }),

      getSuggestion: builder.query({
        query: ({ token }) => ({
          url: `/suggestion`,
          headers: { Authorization: `Bearer ${token}` },
        }),
        providesTags: ['Movie'],
      }),
    }
  },
})

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetMoviesQuery,
  useGetMoviesByCodeQuery,
  useRatingMutation,
  useWatchingMutation,
  useGetSuggestionQuery,
} = apiSlice

export default apiSlice
