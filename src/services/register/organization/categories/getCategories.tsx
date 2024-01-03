/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "react-query";
import { api } from "../../../../config/api";
import {
  OrganizationCategoriesQuery,
  OrganizationCategoriesResponse,
} from "../../../types/register/organization/organizationCategories.interface";

export function useGetOrganizationCategories(
  params: OrganizationCategoriesQuery
) {
  const { data, isFetching, error, refetch } = useQuery<
    OrganizationCategoriesResponse | null | undefined
  >(
    "OrganizationCategories",
    async () => {
      const response = await api.get(
        "core/entry-account/organization/category",
        {
          params,
        }
      );
      return response.data;
    },
    {
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnMount: false,
      enabled: params.enabled === true,
    }
  );

  const CategoriesData = data;
  const isCategoriesDataFetching = isFetching;
  const CategoriesDataError: any = error;
  const refetchCategoriesData = refetch;
  return {
    CategoriesData,
    isCategoriesDataFetching,
    CategoriesDataError,
    refetchCategoriesData,
  };
}
