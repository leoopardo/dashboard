/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  OperatorQuery,
  OperatorsResponse,
} from "@src/services/types/register/operators/operators.interface";
import { useEffect, useState } from "react";
import { api } from "../../../config/api";

export function useListOperators(params: OperatorQuery) {
  const [data, setData] = useState<OperatorsResponse | null>(null);
  const [error, setError] = useState<any>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fetchOperators = async () => {
    try {
      setIsFetching(true);
      const response = await api.get("core/operator", {
        params,
      });
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchOperators();
  }, [params]);

  const operatorsData = data;
  const isOperatorsFetching = isFetching;
  const operatorsError: any = error;
  const refetcOperators = fetchOperators;

  return {
    operatorsData,
    isOperatorsFetching,
    operatorsError,
    refetcOperators,
  };
}
