import {
  BankMaintenenceQuery,
  BankMaintenenceResponse,
} from "@src/services/types/bankMaintenence.interface";
import { api } from "../../../../config/api";
import { useQuery } from "react-query";

export function useGetOrganizationBankMaintenece(params: BankMaintenenceQuery) {
  const { data, isFetching, error, refetch } = useQuery<
    BankMaintenenceResponse | null | undefined
  >(
    "OrganizationBankMaintenece",
    async () => {
      const response = await api.get(
        "config/list_banks",
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
    }
  );

  const BankMainteneceData = data;
  const isBankMainteneceDataFetching = isFetching;
  const BankMainteneceDataError: any = error;
  const refetchBankMainteneceData = refetch;
  return {
    BankMainteneceData,
    isBankMainteneceDataFetching,
    BankMainteneceDataError,
    refetchBankMainteneceData,
  };
}
