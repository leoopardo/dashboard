import { api } from "@config/api";
import { PixKeyWhitelistQuery, PixKeyWhitelistResponse } from "@src/services/types/register/persons/blacklist/pixKeyWhitelist.interface";

import { useQuery } from "react-query";

export function useGetPixKeyWhitelist(params: PixKeyWhitelistQuery) {
  const { data, isFetching, error, refetch } = useQuery<
    PixKeyWhitelistResponse | null | undefined
  >("PixKeyWhitelist", async () => {
    const response = await api.get("blacklist/pix-key-white-list", {
      params,
    });
    return response.data;
  });

  const PixKeyWhitelistData = data;
  const isPixKeyWhitelistDataFetching = isFetching;
  const PixKeyWhitelistDataError: any = error;
  const refetchPixKeyWhitelistData = refetch;
  return {
    PixKeyWhitelistData,
    isPixKeyWhitelistDataFetching,
    PixKeyWhitelistDataError,
    refetchPixKeyWhitelistData,
  };
}
