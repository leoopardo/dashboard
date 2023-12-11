/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";
import { ProfileInterface } from "@src/services/types/register/permissionsGroup/permissionsGroupinterface";
import { useQuery } from "react-query";

export function useGetProfiles(params: {group?: boolean}) {
  const { data, isFetching, error, isSuccess, refetch } = useQuery<
  ProfileInterface[] | null | undefined
  >("Profiles", async () => {
    const response = await api.get("core/profile", {
      params,
    });
    return response.data;
  });

  const ProfilesData = data;
  const isProfilesDataFetching = isFetching;
  const ProfilesDataError: any = error;
  const isSuccessProfilesData = isSuccess;
  const refetchProfilesData = refetch;
  return {
    ProfilesData,
    isProfilesDataFetching,
    ProfilesDataError,
    isSuccessProfilesData,
    refetchProfilesData,
  };
}
