/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "react-query";
import { api } from "../../../config/api";

export function useGetCheckCpfDetails(document?: string) {
  const { data, isFetching, error, refetch } = useQuery<
    any | null | undefined
  >(
    "BlacklistPersonDetails",
    async () => {
      const response = await api.get(`blacklist/merchant-black-list`, {
        params: { document },
      });
      return response.data;
    },
    {
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnMount: false,
    }
  );

  const CheckCpfData = data;
  const isCheckCpfDataFetching = isFetching;
  const CheckCpfDataError: any = error;
  const refetchCheckCpfData = refetch;
  return {
    CheckCpfData,
    isCheckCpfDataFetching,
    CheckCpfDataError,
    refetchCheckCpfData,
  };
}
