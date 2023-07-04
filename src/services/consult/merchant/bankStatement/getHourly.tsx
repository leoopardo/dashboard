import { api } from "../../../../config/api";
import { useQuery } from "react-query";
import {
  MerchantBankStatementTotalsQuery,
  MerchantHourlyItem,
} from "@src/services/types/consult/merchant/bankStatement";

export function useGetHourly(params: MerchantBankStatementTotalsQuery) {
  const { data, isFetching, error, refetch } = useQuery<
    MerchantHourlyItem[] | null | undefined
  >("Hourly", async () => {
    const response = await api.get("account/report/merchant-account/total/hourly", {
      params,
    });
    return response.data;
  });

  const Hourly = data;
  const isHourlyFetching = isFetching;
  const HourlyError: any = error;
  const refetchHourlyTotal = refetch;
  return {
    Hourly,
    isHourlyFetching,
    HourlyError,
    refetchHourlyTotal,
  };
}
