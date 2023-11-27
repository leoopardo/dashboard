/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@src/config/api";
import { useMutation } from "react-query";

export function useCreateQrCodeReserve() {
  const { isLoading, error, mutate, isSuccess, reset, data } = useMutation<
    | {
        token: string;
      }
    | null
    | undefined
  >("CreateReserveQrCode", async () => {
    const response = await api.post("mock/bank/fastpix/reserve/qrcode",);
    return response.data;
  });

  const QrCodeReserveMutate = mutate;
  const QrCodeReserveIsLoading = isLoading;
  const QrCodeReserveError: any = error;
  const QrCodeReserveIsSuccess = isSuccess;
  const QrCodeReserveReset = reset;
  const QrCodeReserveData = data

  return {
    QrCodeReserveMutate,
    QrCodeReserveReset,
    QrCodeReserveIsLoading,
    QrCodeReserveError,
    QrCodeReserveIsSuccess,
    QrCodeReserveData
  };
}
