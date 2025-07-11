import { baseApi } from "../api/baseApi";

const connectionsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // add connection
    addConnection: builder.mutation({
      query: (data) => ({
        url: "/connections/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Connections"],
    }),
    // check connection exist or not exist
    checkIsSentConnectionExists: builder.query({
      query: (friendId) => ({
        url: `/connections/check-sent-connection/${friendId}`,
        method: "GET",
      }),
      providesTags: ["Connections"],
    }),
    acceptConnection: builder.mutation({
      query: (connectionId) => ({
        url: `/connections/accept/${connectionId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Connections"],
    }),
    cancelConnection: builder.mutation({
      query: (friendId) => ({
        url: `/connections/cancel/${friendId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Connections"],
    }),
    removeConnection: builder.mutation({
      query: (removedByUserId) => ({
        url: `/connections/delete/${removedByUserId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Connections"],
    }),
    removeSuggestionConnection: builder.mutation({
      query: (removedByUserId) => ({
        url: `/connections/remove/${removedByUserId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Connections"],
    }),
    declineConnection: builder.mutation({
      query: (connectionId) => ({
        url: `/connections/decline/${connectionId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Connections"],
    }),
    getMyConnections: builder.query({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.length > 0) {
          filters?.forEach(
            (filter: { key: string; value: string }) =>
              filter?.value && params.append(filter?.key, filter?.value)
          );
        }
        return {
          url: `/connections`,
          method: "GET",
          params,
        };
      },
      providesTags: ["Connections"],
    }),
    getConnectionRequests: builder.query({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.length > 0) {
          filters?.forEach(
            (filter: { key: string; value: string }) =>
              filter?.value && params.append(filter?.key, filter?.value)
          );
        }
        return {
          url: `/connections/requests/received`,
          method: "GET",
          params,
        };
      },
      providesTags: ["Connections"],
    }),
    getSentConnectionRequests: builder.query({
      query: () => ({
        url: "/connections/requests/sent",
        method: "GET",
      }),
      providesTags: ["Connections"],
    }),
    getSuggestionsConnections: builder.query({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.length > 0) {
          filters?.forEach(
            (filter: { key: string; value: string }) =>
              filter?.value && params.append(filter?.key, filter?.value)
          );
        }
        return {
          url: `/connections/suggestions`,
          method: "GET",
          params,
        };
      },
      providesTags: ["Connections"],
    }),
  }),
});

export const {
  useAddConnectionMutation,
  useAcceptConnectionMutation,
  useCancelConnectionMutation,
  useCheckIsSentConnectionExistsQuery,
  useRemoveSuggestionConnectionMutation,
  useDeclineConnectionMutation,
  useRemoveConnectionMutation,
  useGetMyConnectionsQuery,
  useGetConnectionRequestsQuery,
  useGetSentConnectionRequestsQuery,
  useGetSuggestionsConnectionsQuery,
} = connectionsApi;
