import { api } from "@src/config/api";
import { useQuery } from "react-query";
import { BankQuery, BankResponse } from "../types/banks.interface";

export function useListBanks(params: BankQuery) {
  const { data, isFetching, error, refetch } = useQuery<
    BankResponse | null | undefined
  >("BankList", async () => {
    const response = await api.get("config/list_banks", {
      params,
    });
    return response.data;
  });

  const bankListData = data;
  const isBankListFetching = isFetching;
  const bankListError: any = error;
  const refetchBankList = refetch;

  return {
    bankListData,
    isBankListFetching,
    bankListError,
    refetchBankList,
  };
}
