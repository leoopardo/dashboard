import { MenuRouteInterface } from "..";
import { ItemInterface } from "../types/item.interface";

export function Merchant({ permissions }: ItemInterface): MenuRouteInterface {
  return {
    key: "merchant_moviments",
    label: "merchant_moviments",
    permission: permissions?.transactions?.merchant?.menu,
    children: [
      {
        key: "merchant_manual_moviments",
        label: "merchant_manual_moviments",
        path: "/moviment/merchant_moviments/merchant_manual_moviments",
        permission:
          permissions?.transactions?.merchant?.manual_transactions?.menu,
      },
      {
        key: "between_accounts_transfers",
        label: "between_accounts_transfers",
        path: "/moviment/merchant_moviments/between_accounts_transfers",
        permission:
          permissions?.transactions?.merchant?.internal_transfers?.menu,
      },
      {
        key: "merchant_pre_manual_moviment",
        label: "merchant_pre_manual_moviment",
        permission:
          permissions?.transactions?.merchant?.merchant_pre_manual?.menu,
        children: [
          {
            key: "merchant_pre_manual_moviments",
            label: "merchant_pre_manual_moviments",
            path: "/moviment/merchant_moviments/merchant_pre_manual_moviment/merchant_pre_manual_moviments",
            permission:
              permissions?.transactions?.merchant?.merchant_pre_manual?.menu,
          },
          {
            key: "merchant_pre_manual_moviments_import",
            label: "merchant_pre_manual_moviments_import",
            path: "/moviment/merchant_moviments/merchant_pre_manual_moviment/merchant_pre_manual_moviments_import",
            permission:
              permissions?.transactions?.merchant?.merchant_pre_manual?.menu,
          },
          {
            key: "merchant_pre_manual_moviments_uploads",
            label: "merchant_pre_manual_moviments_uploads",
            path: "/moviment/merchant_moviments/merchant_pre_manual_moviment/merchant_pre_manual_moviments_uploads",
            permission:
              permissions?.transactions?.merchant?.merchant_pre_manual?.menu,
          },
        ],
      },
      {
        key: "merchant_moviments_reports",
        label: "merchant_moviments_reports",
        permission:
          permissions?.transactions?.merchant?.manual_transactions
            ?.merchant_manual_transactions_export_csv ||
          permissions?.transactions?.merchant?.internal_transfers
            ?.merchant_internal_transfers_export_csv ||
          permissions?.transactions?.merchant?.merchant_pre_manual?.menu,
        children: [
          {
            key: "merchant_manual_moviments_reports",
            label: "merchant_manual_moviments_reports",
            path: "/moviment/merchant_moviments/merchant_moviments_reports/merchant_manual_moviments_reports",
            permission:
              permissions?.transactions?.merchant?.manual_transactions
                ?.merchant_manual_transactions_export_csv,
          },
          {
            key: "merchant_between_accounts_reports",
            label: "merchant_between_accounts_reports",
            path: "/moviment/merchant_moviments/merchant_moviments_reports/merchant_between_accounts_reports",
            permission:
              permissions?.transactions?.merchant?.internal_transfers
                ?.merchant_internal_transfers_export_csv,
          },
          {
            key: "merchant_pre_manual_moviments_reports",
            label: "merchant_pre_manual_moviments_reports",
            path: "/moviment/merchant_moviments/merchant_moviments_reports/merchant_pre_manual_moviments_reports",
            permission:
              permissions?.transactions?.merchant?.merchant_pre_manual?.menu,
          },
        ],
      },
    ],
  };
}
