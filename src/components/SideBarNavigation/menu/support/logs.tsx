import { MenuRouteInterface } from "..";
import { ItemInterface } from "../types/item.interface";

export function Logs({ permissions }: ItemInterface): MenuRouteInterface {
  return {
    key: "api_logs",
    label: "api_logs",
    permission: permissions?.support?.logs?.menu,
    children: [
      {
        key: "error_logs_deposits",
        label: "error_logs_deposits",
        path: "/support/api_logs/error_logs_deposits",
        permission: permissions?.support?.logs?.deposit_error_logs?.menu,
      },
      {
        key: "error_logs_withdrawals",
        label: "error_logs_withdrawals",
        path: "/support/api_logs/error_logs_withdrawals",
        permission: permissions?.support?.logs?.withdraw_error_logs?.menu,
      },
      {
        key: "authentication_logs",
        label: "authentication_logs",
        path: "/support/api_logs/authentication_logs",
        permission: permissions?.support?.logs?.auth_logs?.menu,
      },
    ],
  };
}
