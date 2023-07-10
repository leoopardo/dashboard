import { api } from "../../../../config/api";

import { useQuery } from "react-query";
import {
  MerchantManualEntryCategoryQuery,
  MerchantManualEntryCategoryResponse,
} from "@src/services/types/register/merchants/merchantManualEntryCategory.interface";

export function useGetRowsMerchantManualEntryCategory(
  params: MerchantManualEntryCategoryQuery
) {
  const { data, isFetching, error, refetch } = useQuery<
    MerchantManualEntryCategoryResponse | null | undefined
  >("MerchantManualEntryCategory", async () => {
    const response = await api.get("core/entry-account/category", {
      params,
    });
    return response.data;
  });

  const categoryData = data;
  const isCategoryDataFetching = isFetching;
  const categoryDataError: any = error;
  const refetchCategoryData = refetch;
  return {
    categoryData,
    isCategoryDataFetching,
    categoryDataError,
    refetchCategoryData,
  };
}
