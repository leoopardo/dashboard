import { useEffect, useState } from "react";
import { api } from "../../../config/api";
import { ClientBankQuery, ClientBankResponse } from "../../../services/types/banks.interface";

export function useListClientClientBanks(params: ClientBankQuery) {
  const [data, setData] = useState<ClientBankResponse | null>(null);
  const [error, setError] = useState<any>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fetchClientBankList = async () => {
    try {
      setIsFetching(true);
      const response = await api.get("blacklist/bank-list", {
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
    fetchClientBankList();
  }, [params]);

  const clientbankListData = data;
  const isClientBankListFetching = isFetching;
  const clientbankListError: any = error;
  const refetchClientBankList = fetchClientBankList;

  return {
    clientbankListData,
    isClientBankListFetching,
    clientbankListError,
    refetchClientBankList,
  };
}
