import { ClientBankQuery, ClientBankResponse } from "../types/banks.interface";
import { useQuery } from "react-query";
import { api } from "@src/config/api";

export function useListClientClientBanks(params: ClientBankQuery) {
 
  const { data, isFetching, error, refetch } = useQuery<
  ClientBankResponse | null | undefined
  >(
    "ClientBank",
    async () => {
      const response = await api.get("blacklist/bank-list", {
        params,
      });
      return response.data;
    }
  );

  const clientbankListData = data;
  const isClientBankListFetching = isFetching;
  const clientbankListError: any = error;
  const refetchClientBankList = refetch;

  return {
    clientbankListData,
    isClientBankListFetching,
    clientbankListError,
    refetchClientBankList,
  };
}
