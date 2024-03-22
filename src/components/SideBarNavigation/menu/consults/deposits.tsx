import { MenuRouteInterface } from "..";
import { ItemInterface } from "../types/item.interface";

export function Deposits({ permissions }: ItemInterface): MenuRouteInterface {
  return {
    key: "deposit",
    label: "deposit",
    permission: permissions?.report?.deposit?.menu,
    children: [
      {
        key: "generated_deposits",
        label: "generated_deposits",
        path: "/consult/deposit/generated_deposits",
        permission: permissions?.report?.deposit?.generated_deposit?.menu,
      },
      {
        key: "paid_deposits",
        label: "paid_deposits",
        path: "/consult/deposit/paid_deposits",
        permission: permissions?.report?.deposit?.paid_deposit?.menu,
      },
      {
        key: "undelivered_deposits",
        label: "undelivered_deposits",
        path: "/consult/deposit/undelivered_deposits",
        permission: permissions?.report?.deposit?.undelivered_deposit?.menu,
      },
      {
        key: "receipts",
        label: "receipts",
        path: "/consult/deposit/receipts",
        permission: permissions?.report?.deposit?.deposit_receipt?.menu,
      },
      {
        key: "deposits_reports",
        label: "deposits_reports",
        permission:
          permissions?.report?.deposit?.generated_deposit
            ?.report_deposit_generated_deposit_export_csv ||
          permissions?.report?.deposit?.paid_deposit
            ?.report_deposit_paid_deposit_export_csv ||
          permissions?.report?.deposit?.generated_deposit
            ?.report_deposit_generated_deposit_export_csv,
        children: [
          {
            key: "generated_deposits_reports",
            label: "generated_deposits_reports",
            path: "/consult/deposit/deposits_reports/generated_deposits_reports",
            permission:
              permissions?.report?.deposit?.generated_deposit
                ?.report_deposit_generated_deposit_export_csv,
          },
          {
            key: "paid_deposits_reports",
            label: "paid_deposits_reports",
            path: "/consult/deposit/deposits_reports/paid_deposits_reports",
            permission:
              permissions?.report?.deposit?.paid_deposit
                ?.report_deposit_paid_deposit_export_csv,
          },
          {
            key: "webhooks_reports",
            label: "webhooks_reports",
            path: "/consult/deposit/deposits_reports/webhooks_reports",
            permission:
              permissions?.report?.deposit?.generated_deposit
                ?.report_deposit_generated_deposit_export_csv,
          },
        ],
      },
    ],
  };
}
