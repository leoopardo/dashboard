import { useEffect, useState } from "react";
import { api } from "../../../config/api";
import { BankQuery, BankResponse } from "../../../services/types/banks.interface";

export function useListBanks(params: BankQuery) {
  const [data, setData] = useState<BankResponse | null>(null);
  const [error, setError] = useState<any>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fetchBankList = async () => {
    try {
      setIsFetching(true);
      const response = await api.get("config/list_banks", {
        params,
      });
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchBankList();
  }, [params]);

  const bankListData = data;
  const isBankListFetching = isFetching;
  const bankListError: any = error;
  const refetchBankList = fetchBankList;

  return {
    bankListData,
    isBankListFetching,
    bankListError,
    refetchBankList,
  };
}
