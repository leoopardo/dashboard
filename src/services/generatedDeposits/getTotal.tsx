import { useEffect, useState } from "react";
import { api } from "../../config/api";
import {
  generatedDepositTotal,
  generatedDepositTotalQuery,
} from "../types/generatedDeposits.interface";

export function useGetTotalGeneratedDeposits(
  params: generatedDepositTotalQuery
) {
  const [depositsTotal, setDepositsTotal] =
    useState<generatedDepositTotal | null>(null);
  const [isTotalFetching, setIsTotalFetching] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  const fetchDepositsTotal = async () => {
    try {
      setDepositsTotal((await api.get("report/pix/total", { params })).data);
    } catch (error: any) {
      setError(error?.response?.data);
    } finally {
      setIsTotalFetching(false);
    }
  };

  useEffect(() => {
    fetchDepositsTotal();
  }, [params]);

  return { depositsTotal, error, isTotalFetching, fetchDepositsTotal };
}
