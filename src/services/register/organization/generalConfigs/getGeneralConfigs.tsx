import { OrganizationGeneralConfigs } from "@src/services/types/register/organization/organizationGeneralConfigs.interface";
import { useQuery } from "react-query";
import { api } from "../../../../config/api";

export function useGetGeneralconfigs() {
  const { data, isFetching, error, isSuccess, refetch } = useQuery<
    OrganizationGeneralConfigs | null | undefined
  >(
    "OrganizationGeneralConfigs",
    async () => {
      const response = await api.get("config/getconfigs");
      return response.data;
    },
    {
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnMount: false,
    }
  );

  return {
    data,
    isFetching,
    error,
    isSuccess,
    refetch,
  };
}
