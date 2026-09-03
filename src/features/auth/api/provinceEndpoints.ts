import { apiSlice } from "@/slice/requestSlice";
import type { ProvincesResponse, TownsResponse } from "@/features/auth/types";

export const provinceEndpoints = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProvinces: builder.query<ProvincesResponse, void>({
      query: () => ({ url: "/provinces/all", method: "GET" }),
    }),
    getTownsByProvinceId: builder.query<TownsResponse, string>({
      query: (provinceId) => ({
        url: `/provinces/provinces/${encodeURIComponent(provinceId)}/towns`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetProvincesQuery,
  useGetTownsByProvinceIdQuery,
} = provinceEndpoints;
