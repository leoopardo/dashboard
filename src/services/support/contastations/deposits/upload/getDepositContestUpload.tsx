/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";
import { PersonBlacklistUploadsData, PersonBlacklistUploadsQuery } from "@src/services/types/register/persons/blacklist/uploads.interface";

import { useQuery } from "react-query";

export function useGetContestDepositsUploads(params: PersonBlacklistUploadsQuery) {
  const { data, isFetching, error, refetch } = useQuery<
  PersonBlacklistUploadsData | null | undefined
  >("ContestDepositsUpload", async () => {
    const response = await api.get("/reconciliation-pix/pix/bulk/e2e", {
      params,
    });
    return response.data;
  });

  return {
    data,
    isFetching,
    error,
    refetch,
  };
}