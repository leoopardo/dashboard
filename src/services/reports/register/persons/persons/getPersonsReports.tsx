import {
    ReportsData,
    ReportsQuery,
  } from "@src/services/types/reports/reports.interface";
  import { api } from "../../../../../config/api";
  import { useQuery } from "react-query";
  import { useEffect, useState } from "react";
  
  export function useGetPersonsReports(params: ReportsQuery) {
    const [loadData, setLoadData] = useState<ReportsData | null | undefined>(
      null
    );
  
    const { data, isFetching, error, refetch } = useQuery<
      ReportsData | null | undefined
    >(
      "PersonsReports",
      async () => {
        const response = await api.get("customer/csv/persons", {
          params,
        });
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
  
    const PersonsReportsData = data;
    const isPersonsReportsDataFetching = isFetching;
    const PersonsReportsDataError: any = error;
    const refetchPersonsReportsData = refetch;
    return {
      PersonsReportsData,
      isPersonsReportsDataFetching,
      PersonsReportsDataError,
      refetchPersonsReportsData,
    };
  }
  