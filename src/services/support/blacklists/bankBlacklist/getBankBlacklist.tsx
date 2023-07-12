import {
  BankBlacklistData,
  BankBlacklistQuery,
} from "@src/services/types/support/blacklists/bankBlacklist.interface";
import moment from "moment";
import { useQuery } from "react-query";
import { api } from "../../../../config/api";

export function useGetBankBlacklist(params: BankBlacklistQuery) {
  const { data, isFetching, error, refetch } = useQuery<
    BankBlacklistData | null | undefined
  >("BankBlacklist", async () => {
    const response = await api.get("blacklist/bank-black-list", {
      params: {
        ...params,
        start_date: params.start_date
          ? moment(params.start_date)
              .add(3, "hours")
              .format("YYYY-MM-DDTHH:mm:ss.SSS")
          : null,
        end_date: params.end_date
          ? moment(params.end_date)
              .add(3, "hours")
              .format("YYYY-MM-DDTHH:mm:ss.SSS")
          : null,
      },
    });
    return response.data;
  });

  const BankBlacklist = data;
  const isBankBlacklistFetching = isFetching;
  const BankBlacklistError: any = error;
  const refetchBankBlacklist = refetch;
  return {
    BankBlacklist,
    isBankBlacklistFetching,
    BankBlacklistError,
    refetchBankBlacklist,
  };
}
