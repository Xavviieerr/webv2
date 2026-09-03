import { toast } from "react-hot-toast";
import { apiSlice } from "./requestSlice";

const FALLBACK_ADDRESSES = {
  bitcoin: "bc1q2hxp46cmzjm8ynxj2lxusdt5vuwnd0hl75qvue",
  solana: "EeRXdx9UMLe6cfWUYHjToLSBD6e9xQ4HNpa2XZHNvmJc",
  usdt: "0xfD62fdB875301c1D3cbbdb97aeA15a4cA6B14B7d",
};

export const donationEndpoints = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWalletAddresses: builder.query<
      { bitcoin?: string; solana?: string; usdt?: string },
      void
    >({
      query: () => ({ url: "/donations/wallet-addresses" }),
      transformResponse: (response: unknown) => (response as any) ?? FALLBACK_ADDRESSES,
    }),

    submitDonation: builder.mutation<
      { message: string },
      {
        name: string;
        email: string;
        currency: string;
        address: string;
        network?: string;
        amount?: number;
      }
    >({
      query: (body) => ({
        url: "/donations",
        method: "POST",
        body,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data?.message || "Donation recorded successfully");
        } catch (err: unknown) {
          const msg =
            (err as { data?: { message?: string } })?.data?.message ||
            "Failed to record donation";
          toast.error(msg);
        }
      },
    }),
  }),
});

export const {
  useGetWalletAddressesQuery,
  useLazyGetWalletAddressesQuery,
  useSubmitDonationMutation,
} = donationEndpoints;
