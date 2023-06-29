import { api } from "@config/api";
import { PersonBlacklistReason } from "@src/services/types/register/persons/persons.interface";
import { useQuery } from "react-query";

interface queryInterface {
  limit: number;
  page: number;
}

export function useGetBlacklistReasons(params?: queryInterface) {
  const { data, isFetching, error, refetch } = useQuery<
    PersonBlacklistReason | null | undefined
  >("blacklistReasons", async () => {
    const response = await api.get("customer/blacklist-reason", { params });
    return response.data;
  });

  const BlacklistReasons = data;
  const isBlacklistReasonsFetching = isFetching;
  const BlacklistReasonsError: any = error;
  const refetchBlacklistReasons = refetch;
  return {
    BlacklistReasons,
    isBlacklistReasonsFetching,
    BlacklistReasonsError,
    refetchBlacklistReasons,
  };
}
