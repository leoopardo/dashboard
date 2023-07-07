import {
  ReportsData,
  ReportsQuery,
} from "@src/services/types/reports/reports.interface";
import { api } from "../../../../config/api";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";

export function useGetOrganizationCategoriesReports(params: ReportsQuery) {
  const [loadData, setLoadData] = useState<ReportsData | null | undefined>(
    null
  );

  const { data, isFetching, error, refetch } = useQuery<
    ReportsData | null | undefined
  >(
    "OrganizationCategoriesReports",
    async () => {
      const response = await api.get(
        "core/csv/organization/entry-account/category",
        {
          params,
        }
      );
      return response.data;
    },
    {
      refetchInterval: loadData?.items.find(
        (item) => item?.status === "WAITING"
      )
        ? 10000
        : undefined,
    }
  );

  useEffect(() => {
    setLoadData(data);
  }, [data]);

  const CategoriesReportsData = data;
  const isCategoriesReportsDataFetching = isFetching;
  const CategoriesReportsDataError: any = error;
  const refetchCategoriesReportsData = refetch;
  return {
    CategoriesReportsData,
    isCategoriesReportsDataFetching,
    CategoriesReportsDataError,
    refetchCategoriesReportsData,
  };
}
