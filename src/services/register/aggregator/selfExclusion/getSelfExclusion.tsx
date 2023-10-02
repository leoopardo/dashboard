/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";
import {
  SelfExclusionData,
  SelfExclusionQuery,
} from "@src/services/types/register/aggregators/selfExclusion/getSelfExclusion";
import { useQuery } from "react-query";

export function useGetSelfExclusion(params: SelfExclusionQuery) {
  const { data, isFetching, error, refetch } = useQuery<
    SelfExclusionData | null | undefined
  >("selfExclusion", async () => {
    const response = await api.get("blacklist/self-exclusion", {
      params,
    });
    return response.data;
  });

  const SelfExclusionData = data;
  const isSelfExclusionDataFetching = isFetching;
  const SelfExclusionDataError: any = error;
  const refetchSelfExclusionData = refetch;
  return {
    SelfExclusionData,
    isSelfExclusionDataFetching,
    SelfExclusionDataError,
    refetchSelfExclusionData,
  };
}
