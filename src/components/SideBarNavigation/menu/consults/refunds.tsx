import { MenuRouteInterface } from "..";
import { ItemInterface } from "../types/item.interface";

export function Refunds({ permissions }: ItemInterface): MenuRouteInterface {
  return {
    key: "refunds",
    label: "refunds",
    permission: permissions?.report?.chargeback?.menu,
    children: [
      {
        key: "refund_deposits",
        label: "refund_deposits",
        path: "/consult/refunds/refund_deposits",
        permission: permissions?.report?.chargeback?.deposit_chargeback?.menu,
      },
      {
        key: "refund_withdrawals",
        label: "refund_withdrawals",
        path: "/consult/refunds/refund_withdrawals",
        permission: permissions?.report?.chargeback?.withdraw_chargeback?.menu,
      },
      {
        key: "refund_manual_deposits",
        label: "refund_manual_deposits",
        path: "/consult/refunds/refund_manual_deposits",
        permission:
          permissions?.report?.chargeback.manual_deposit_chargeback?.menu,
      },
      {
        key: "refund_reports",
        label: "refund_reports",
        permission:
          permissions?.report?.chargeback?.deposit_chargeback
            ?.report_chargeback_deposit_chargeback_export_csv ||
          permissions?.report?.chargeback?.withdraw_chargeback
            ?.report_chargeback_withdraw_chargeback_export_csv ||
          permissions?.report?.chargeback.manual_deposit_chargeback
            ?.report_chargeback_manual_deposit_chargeback_export_csv,
        children: [
          {
            key: "refund_deposits_reports",
            label: "refund_deposits_reports",
            path: "/consult/refunds/refund_reports/refund_deposits_reports",
            permission:
              permissions?.report?.chargeback?.deposit_chargeback
                ?.report_chargeback_deposit_chargeback_export_csv,
          },
          {
            key: "refund_manual_reports",
            label: "refund_manual_reports",
            path: "/consult/refunds/refund_reports/refund_manual_reports",
            permission:
              permissions?.report?.chargeback?.withdraw_chargeback
                ?.report_chargeback_withdraw_chargeback_export_csv,
          },
          {
            key: "refund_withdrawals_reports",
            label: "refund_withdrawals_reports",
            path: "/consult/refunds/refund_reports/refund_withdrawals_reports",
            permission:
              permissions?.report?.chargeback.manual_deposit_chargeback
                ?.report_chargeback_manual_deposit_chargeback_export_csv,
          },
        ],
      },
    ],
  };
}
