import { api } from "@config/api";
import { PersonFilesResponse } from "@src/services/types/register/persons/persons.interface";
import { useQuery } from "react-query";

export function useGetFiles(cpf?: string) {
  const { data, isFetching, error, refetch } = useQuery<
    PersonFilesResponse | null | undefined
  >("personFiles", async () => {
    const response = await api.get(`customer/persons/${cpf}/files`, {});
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
