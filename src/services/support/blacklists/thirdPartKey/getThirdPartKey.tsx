/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ThirdPartData,
  ThirdPartQuery,
} from "@src/services/types/support/blacklists/thirdPartKey.interface";
import moment from "moment";
import { useQuery } from "react-query";
import { api } from "../../../../config/api";

export function useGetThirdPartKey(params: ThirdPartQuery) {
  const { data, isFetching, error, refetch } = useQuery<
    ThirdPartData | null | undefined
  >("ThirdPartKey", async () => {
    const response = await api.get("blacklist/pix-key-from-another-owner", {
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

  const ThirdPartKey = data;
  const isThirdPartKeyFetching = isFetching;
  const ThirdPartKeyError: any = error;
  const refetchThirdPartKey = refetch;
  return {
    ThirdPartKey,
    isThirdPartKeyFetching,
    ThirdPartKeyError,
    refetchThirdPartKey,
  };
}
