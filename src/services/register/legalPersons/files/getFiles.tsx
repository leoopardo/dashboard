/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";
import { PersonFilesResponse } from "@src/services/types/register/persons/persons.interface";
import { useQuery } from "react-query";

export function useGetLegalPersonFiles(cpf?: string) {
  const { data, isFetching, error, refetch } = useQuery<
    PersonFilesResponse | null | undefined
  >("LegalPersonFiles", async () => {
    const response = await api.get(`customer/companies/${cpf}/files`, {});
    return response.data;
  });

  const Files = data;
  const isFilesFetching = isFetching;
  const FilesError: any = error;
  const refetchFiles = refetch;
  return {
    Files,
    isFilesFetching,
    FilesError,
    refetchFiles,
  };
}
