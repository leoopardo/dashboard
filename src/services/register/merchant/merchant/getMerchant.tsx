/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";
import {
  MerchantByIdResponse
} from "@services/types/register/merchants/merchantsRegister.interface";
import { useQuery } from "react-query";

export function useGetMerchantById(id?: string) {
  const { data, isFetching, error, refetch, isSuccess } = useQuery<
  MerchantByIdResponse | null | undefined
  >(
    "MerchantsRegister",
    async () => {
      const response = await api.get(`core/merchant/detail/${id}`, {});
      return response.data;
    },
  );

  const MerchantByIdData = data;
  const isSuccessMerchantByIdData = isSuccess;
  const isMerchantByIdDataFetching = isFetching;
  const MerchantByIdDataError: any = error;
  const refetchMerchantByIdData = refetch;
  return {
    MerchantByIdData,
    isSuccessMerchantByIdData,
    isMerchantByIdDataFetching,
    MerchantByIdDataError,
    refetchMerchantByIdData,
  };
}
