import { DollarOutlined } from "@ant-design/icons";
import { MenuRouteInterface } from "..";
import { ItemInterface } from "../types/item.interface";
import { Organization } from "./organization";
import { Aggregator } from "./aggregator";
import { Merchant } from "./merchant";

export function Moviments({
  permissions,
  userType,
}: ItemInterface): MenuRouteInterface {
  return {
    key: "moviment",
    label: "moviment",
    icon: <DollarOutlined style={{ fontSize: "23px" }} />,
    permission: permissions?.transactions?.menu,
    children: [
      Organization({ permissions, userType }),
      Aggregator({ permissions, userType }),
      Merchant({ permissions, userType }),
      {
        key: "merchant_transfers",
        label: "merchant_transfers",
        path: "/moviment/merchant_transfers",
        style: { display: "none" },
      },
    ],
  };
}
