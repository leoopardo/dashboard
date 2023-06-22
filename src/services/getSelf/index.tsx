import moment from "moment";
import { api } from "../../config/api";
import { useQuery } from "react-query";
import { SelfInterface } from "../types/register/self/self.interface";

export function useGetSelf() {
  const { data, isFetching, error, refetch } = useQuery<
    SelfInterface | null | undefined
  >(
    "Self",
    async () => {
      const response = await api.get("core/user/self", {});
      return response.data;
    },
    {
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnMount: false,
    }
  );

  const Self = data;
  const SelfFetching = isFetching;
  const SelfError: any = error;
  const refetchSelf = refetch;
  return {
    Self,
    SelfFetching,
    SelfError,
    refetchSelf,
  };
}
