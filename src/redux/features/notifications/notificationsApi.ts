import { baseApi } from "../api/baseApi";

const notificationsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllNotifications: builder.query({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters) {
          filters?.forEach(
            (filter: { key: string; value: string }) =>
              filter?.value && params.append(filter?.key, filter?.value)
          );
        }
        return {
          url: "/notifications",
          method: "GET",
          params,
        };
      },
      providesTags: ["Notifications"],
    }),
    getALLMessageNotifications: builder.query({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters) {
          filters?.forEach(
            (filter: { key: string; value: string }) =>
              filter?.value && params.append(filter?.key, filter?.value)
          );
        }
        return {
          url: "/notifications/get-all-message-notifications",
          method: "GET",
          params,
        };
      },
      providesTags: ["Notifications"],
    }),
    viewAllNotifications: builder.mutation({
      query: () => {
        return {
          url: `/notifications/view-all-notifications`,
          method: "POST"
        };
      },

      invalidatesTags: ["Notifications"],
    }),
    viewAllMessageNotifications: builder.mutation({
      query: () => ({
        url: `/notifications/view-all-message-notifications`,
        method: "POST",
      }),
      invalidatesTags: ["Notifications"],
    }),
    viewSingleNotification: builder.mutation({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}`,
        method: "PATCH",
      }),

      invalidatesTags: ["Notifications"],
    }),
    getUnviewedNotificationsCount: builder.query({
      query: () => ({
        url: "/notifications/unview-notification-count",
        method: "GET",
      }),
      providesTags: ["Notifications"],
    }),
    getUnviewedMessageNotificationsCount: builder.query({
      query: () => ({
        url: "/notifications/unview-message-notification-count",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetALLMessageNotificationsQuery,
  useGetAllNotificationsQuery,
  useViewAllNotificationsMutation,
  useViewAllMessageNotificationsMutation,
  useViewSingleNotificationMutation,
  useGetUnviewedNotificationsCountQuery,
  useGetUnviewedMessageNotificationsCountQuery,
} = notificationsApi;
