import { api } from "../../../../config/api";
import { useQuery } from "react-query";
import {
  
  MerchantBankStatementTotalsQuery,
  MerchantTransactionsData,
} from "@src/services/types/consult/merchant/bankStatement";

export function useGetMerchantTransactions(
  params: MerchantBankStatementTotalsQuery
) {
  const { data, isFetching, error, refetch } = useQuery<
  MerchantTransactionsData | null | undefined
  >("MerchantTransactions", async () => {
    const response = await api.get("account/report/merchant-account/transactions", {
      params,
    });
    return response.data;
  });

  const MerchantTransactions = data;
  const isMerchantTransactionsFetching = isFetching;
  const MerchantTransactionsError: any = error;
  const refetchMerchantTransactionsTotal = refetch;
  return {
    MerchantTransactions,
    isMerchantTransactionsFetching,
    MerchantTransactionsError,
    refetchMerchantTransactionsTotal,
  };
}
