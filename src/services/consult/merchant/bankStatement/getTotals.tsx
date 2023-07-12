/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  MerchantBankStatementTotalsData,
  MerchantBankStatementTotalsQuery,
} from "@src/services/types/consult/merchant/bankStatement";
import { useQuery } from "react-query";
import { api } from "../../../../config/api";

export function useGetMerchantBankStatementTotals(
  params: MerchantBankStatementTotalsQuery
) {
  const { data, isFetching, error, refetch } = useQuery<
    MerchantBankStatementTotalsData | null | undefined
  >("MerchantBankStatementTotals", async () => {
    const response = await api.get("account/report/merchant-account/total", {
      params,
    });
    return response.data;
  });

  const MerchantBankStatementTotals = data;
  const isMerchantBankStatementTotalsFetching = isFetching;
  const MerchantBankStatementTotalsError: any = error;
  const refetchMerchantBankStatementTotalsTotal = refetch;
  return {
    MerchantBankStatementTotals,
    isMerchantBankStatementTotalsFetching,
    MerchantBankStatementTotalsError,
    refetchMerchantBankStatementTotalsTotal,
  };
}
