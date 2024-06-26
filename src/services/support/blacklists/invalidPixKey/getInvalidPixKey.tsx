/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ThirdPartData,
  ThirdPartQuery,
} from "@src/services/types/support/blacklists/thirdPartKey.interface";
import moment from "moment";
import { useQuery } from "react-query";
import { api } from "../../../../config/api";

export function useGetInvalidPixKey(params: ThirdPartQuery, fetch?: boolean) {
  const { data, isFetching, error, refetch } = useQuery<
    ThirdPartData | null | undefined
  >("InvalidPixKey", async () => {
    if (!fetch) {
      return {};
    }
    const response = await api.get("blacklist/pix-key-black-list", {
      params: {
        ...params,
        start_date: params.start_date
          ? moment(params.start_date)
              .utc()
              .format("YYYY-MM-DDTHH:mm:ss.SSS")
          : null,
        end_date: params.end_date
          ? moment(params.end_date)
              .utc()
              .format("YYYY-MM-DDTHH:mm:ss.SSS")
          : null,
      },
    });
    return response.data;
  });

  const InvalidPixKey = data;
  const isInvalidPixKeyFetching = isFetching;
  const InvalidPixKeyError: any = error;
  const refetchInvalidPixKey = refetch;
  return {
    InvalidPixKey,
    isInvalidPixKeyFetching,
    InvalidPixKeyError,
    refetchInvalidPixKey,
  };
}
