/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useMutation } from "react-query";

export function useCreateQrCodeReserve(type?: "123fixed" | "123free") {
  const { isLoading, error, mutate, isSuccess, reset, data } = useMutation<
    | {
        token: string;
      }
    | null
    | undefined
  >("CreateReserveQrCode", async () => {
    const response = await axios.post(
      "https://sandbox-v4.paybrokers.io/v4/fastpix/checkout/reserve/qrcode",
      {},
      { headers: { ["merchant-hash"]: type } }
    );
    return response.data;
  });

  const QrCodeReserveMutate = mutate;
  const QrCodeReserveIsLoading = isLoading;
  const QrCodeReserveError: any = error;
  const QrCodeReserveIsSuccess = isSuccess;
  const QrCodeReserveReset = reset;
  const QrCodeReserveData = data;

  return {
    QrCodeReserveMutate,
    QrCodeReserveReset,
    QrCodeReserveIsLoading,
    QrCodeReserveError,
    QrCodeReserveIsSuccess,
    QrCodeReserveData,
  };
}
