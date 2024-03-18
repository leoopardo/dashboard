import { MenuRouteInterface } from "..";
import { ItemInterface } from "../types/item.interface";

export function Withdrawals({
  permissions,
}: ItemInterface): MenuRouteInterface {
  return {
    key: "withdrawals",
    label: "withdrawals",
    permission: permissions?.report?.withdraw?.menu,
    children: [
      {
        key: "generated_withdrawals",
        label: "generated_withdrawals",
        path: "/consult/withdrawals/generated_withdrawals",
        permission: permissions?.report?.withdraw?.generated_withdraw?.menu,
      },
      {
        key: "paid_withdrawals",
        label: "paid_withdrawals",
        path: "/consult/withdrawals/paid_withdrawals",
        permission: permissions?.report?.withdraw?.paid_withdraw?.menu,
      },
      {
        key: "undelivered_withdrawals",
        label: "undelivered_withdrawals",
        path: "/consult/withdrawals/undelivered_withdrawals",
        permission: permissions?.report?.withdraw?.undelivered_withdraw?.menu,
      },
      {
        key: "withdrawals_reports",
        label: "withdrawals_reports",
        permission:
          permissions?.report?.withdraw?.generated_withdraw
            ?.report_withdraw_generated_withdraw_export_csv ||
          permissions?.report?.withdraw?.paid_withdraw
            ?.report_withdraw_paid_withdraw_export_csv ||
          permissions?.report?.withdraw?.generated_withdraw
            ?.report_withdraw_generated_withdraw_export_csv,
        children: [
          {
            key: "generated_withdrawals_reports",
            label: "generated_withdrawals_reports",
            path: "/consult/withdrawals/withdrawals_reports/generated_withdrawals_reports",
            permission:
              permissions?.report?.withdraw?.generated_withdraw
                ?.report_withdraw_generated_withdraw_export_csv,
          },
          {
            key: "paid_withdrawals_reports",
            label: "paid_withdrawals_reports",
            path: "/consult/withdrawals/withdrawals_reports/paid_withdrawals_reports",
            permission:
              permissions?.report?.withdraw?.paid_withdraw
                ?.report_withdraw_paid_withdraw_export_csv,
          },
          {
            key: "withdrawals_webhooks_reports",
            label: "withdrawals_webhooks_reports",
            path: "/consult/withdrawals/withdrawals_reports/withdrawals_webhooks_reports",
            permission:
              permissions?.report?.withdraw?.generated_withdraw
                ?.report_withdraw_generated_withdraw_export_csv,
          },
        ],
      },
    ],
  };
}
