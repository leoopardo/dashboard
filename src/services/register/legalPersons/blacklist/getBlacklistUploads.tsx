/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";
import { PersonBlacklistUploadsData, PersonBlacklistUploadsQuery } from "@src/services/types/register/persons/blacklist/uploads.interface";

import { useQuery } from "react-query";

export function useGetLegalPersonBlacklistUploads(params: PersonBlacklistUploadsQuery) {
  const { data, isFetching, error, refetch } = useQuery<
  PersonBlacklistUploadsData | null | undefined
  >("LegalPersonBlacklistUploads", async () => {
    const response = await api.get("customer/bulk_create/companies", {
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
