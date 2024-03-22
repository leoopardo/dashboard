import { MenuRouteInterface } from "..";
import { ItemInterface } from "../types/item.interface";

export function Merchants({ permissions }: ItemInterface): MenuRouteInterface {
  return {
    key: "merchant",
    label: "merchant",
    permission: permissions?.register?.merchant?.menu,
    children: [
      {
        key: "merchants",
        label: "merchants",
        path: "/register/merchant/merchants",
        permission: permissions?.register?.merchant?.merchant?.menu,
      },
      {
        key: "merchant_users",
        label: "merchant_users",
        path: "/register/merchant/merchant_users",
        permission: permissions?.register?.merchant?.users?.menu,
      },
      {
        key: "manual_entry_category",
        label: "manual_entry_category",
        path: "/register/merchant/manual_entry_category",
        permission: permissions?.register?.merchant?.release_category?.menu,
      },
      {
        key: "fee_plans",
        label: "fee_plans",
        path: "/register/merchant/fee_plans",
        permission: permissions?.register?.merchant?.fee_plans?.menu,
      },
      {
        key: "merchant_blacklists",
        label: "merchant_blacklists",
        permission:
          permissions?.register?.merchant?.blacklist?.menu ||
          permissions?.register?.merchant?.blacklist
            ?.merchant_blacklist_create ||
          permissions?.register?.merchant?.black_list_reason?.menu,
        children: [
          {
            key: "merchant_blacklist",
            label: "merchant_blacklist",
            path: "/register/merchant/merchant_blacklists/merchant_blacklist",
            permission: permissions?.register?.merchant?.blacklist?.menu,
          },
          {
            key: "import_merchant_blacklist",
            label: "import_merchant_blacklist",
            path: "/register/merchant/merchant_blacklists/import_merchant_blacklist",
            permission:
              permissions?.register?.merchant?.blacklist
                ?.merchant_blacklist_create,
          },
          {
            key: "uploads_merchant_blacklist",
            label: "uploads_merchant_blacklist",
            path: "/register/merchant/merchant_blacklists/uploads_merchant_blacklist",
            permission:
              permissions?.register?.merchant?.blacklist
                ?.merchant_blacklist_create,
          },
          {
            key: "merchant_blacklist_reasons",
            label: "merchant_blacklist_reasons",
            path: "/register/merchant/merchant_blacklists/merchant_blacklist_reasons",
            permission:
              permissions?.register?.merchant?.black_list_reason?.menu,
          },
        ],
      },
      {
        key: "merchant_reports",
        label: "merchant_reports",
        permission:
          permissions?.register?.merchant?.merchant?.merchant_export_csv ||
          permissions?.register?.merchant?.users?.merchant_user_export_csv ||
          permissions?.register?.merchant?.blacklist
            ?.merchant_blacklist_export_csv,
        children: [
          {
            key: "merchant_merchants_reports",
            label: "merchant_merchants_reports",
            path: "/register/merchant/merchant_reports/merchant_merchants_reports",
            permission:
              permissions?.register?.merchant?.merchant?.merchant_export_csv,
          },
          {
            key: "merchant_users_reports",
            label: "merchant_users_reports",
            path: "/register/merchant/merchant_reports/merchant_users_reports",
            permission:
              permissions?.register?.merchant?.users?.merchant_user_export_csv,
          },
          {
            key: "merchant_blacklist_reports",
            label: "merchant_blacklist_reports",
            path: "/register/merchant/merchant_reports/merchant_blacklist_reports",
            permission:
              permissions?.register?.merchant?.blacklist
                ?.merchant_blacklist_export_csv,
          },
        ],
      },
    ],
  };
}
