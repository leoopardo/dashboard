/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "react-hot-toast";
import { QueryCache, QueryClient } from "react-query";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (err: any) => {
      if (
        err.response.status === 401 &&
        err.request.responseURL.split("token/")[1] !== "validate"
      ) {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        queryClient.refetchQueries(["validate"]);
        toast.error("Token expirado");
      }
    },
  }),
  defaultOptions: {
    queries: {
      refetchOnMount: "always",
      retry: false,
    },
  },
});
