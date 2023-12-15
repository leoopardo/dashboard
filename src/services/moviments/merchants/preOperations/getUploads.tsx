/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import secureLocalStorage from "react-secure-storage";

export function useGetPreManualUploads(params: any) {
  const [loadData, setLoadData] = useState<any | null | undefined>(null);
  const { data, isFetching, error, isSuccess, refetch } = useQuery<
    any | null | undefined
  >(
    "PreManualUploads",
    async () => {
      const response = await axios.get(
        "http://192.168.10.14:8081/v4/core/pre-entry-account/bulk/create/reports",
        {
          params,
          headers: {
            Authorization: `Bearer ${
              secureLocalStorage.getItem("token") ||
              sessionStorage.getItem("token")
            }`,
          },
        }
      );
      return response.data;
    },
    {
      refetchInterval: loadData?.items.find(
        (item: any) => item?.status === "WAITING"
      )
        ? 10000
        : undefined,
    }
  );
  useEffect(() => {
    setLoadData(data);
  }, [data]);
  return {
    data,
    isFetching,
    error,
    isSuccess,
    refetch,
  };
}
