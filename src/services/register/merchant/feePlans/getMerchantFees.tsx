/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";
import { IMerchantFee } from "@src/services/types/register/merchants/merchantFeePlans.interface";
import { useQuery } from "react-query";

export function useGetmerchantFeeRegister(params?: { merchant_id: number }) {
  const { data, isFetching, error, refetch } = useQuery<
    IMerchantFee | null | undefined
  >(
    "MerchantsmerchantFee",
    async () => {
      const response = await api.get("core/merchant/config/fees", {
        params,
      });
      return response.data;
    },
    {
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnMount: false,
    }
  );

  const merchantFeeData = data;
  const isMerchantFeeDataFetching = isFetching;
  const merchantFeeDataError: any = error;
  const refetchMerchantFeeData = refetch;
  return {
    merchantFeeData,
    isMerchantFeeDataFetching,
    merchantFeeDataError,
    refetchMerchantFeeData,
  };
}
