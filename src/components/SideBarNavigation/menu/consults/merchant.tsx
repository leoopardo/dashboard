import { MenuRouteInterface } from "..";
import { ItemInterface } from "../types/item.interface";

export function Merchant({ permissions }: ItemInterface): MenuRouteInterface {
  return {
    key: "consult_merchant",
    label: "consult_merchant",
    permission: permissions?.report?.merchant?.menu,
    children: [
      {
        key: "merchant_bank_statement",
        label: "merchant_bank_statement",
        path: "/consult/consult_merchant/merchant_bank_statement",
        permission: permissions?.report?.merchant?.extract?.menu,
      },
      {
        key: "merchant_balance",
        label: "merchant_balance",
        path: "/consult/consult_merchant/merchant_balance",
        permission: permissions?.report?.merchant?.balance?.menu,
      },
      {
        key: "merchant_history",
        label: "merchant_history",
        path: "/consult/consult_merchant/merchant_history",
        permission: permissions?.report?.merchant?.balance_history?.menu,
      },
      {
        key: "consult_merchant_reports",
        label: "consult_merchant_reports",
        path: "/consult/consult_merchant/consult_merchant_reports",
        permission:
          permissions?.report?.merchant?.extract
            ?.report_merchant_extract_export_csv,
      },
    ],
  };
}
