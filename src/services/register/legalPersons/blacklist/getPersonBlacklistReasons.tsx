/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";
import {
    PersonBlacklistReasonsData,
    PersonBlacklistReasonsQuery,
} from "@src/services/types/register/persons/blacklist/reasons.interface";

import { useQuery } from "react-query";

export function useGetLegalPersonBlacklistReasons(
  params: PersonBlacklistReasonsQuery
) {
  const { data, isFetching, error, refetch } = useQuery<
    PersonBlacklistReasonsData | null | undefined
  >("LegalPersonBlacklistReasons", async () => {
    const response = await api.get("customer/blacklist-reason", {
      params,
    });
    return response.data;
  });

  const reasonsData = data;
  const reasonsIsFetching =isFetching
  const reasonsError = error
  const refetchReasons= refetch

  return {
    reasonsData,
    reasonsIsFetching,
    reasonsError,
    refetchReasons,
  };
}
