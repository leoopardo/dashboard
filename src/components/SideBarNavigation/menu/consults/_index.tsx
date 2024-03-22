import { FileSearchOutlined } from "@ant-design/icons";
import { MenuRouteInterface } from "..";
import { ItemInterface } from "../types/item.interface";
import { Organization } from "./organization";
import { Merchant } from "./merchant";
import { Deposits } from "./deposits";
import { Withdrawals } from "./withdrawals";
import { Refunds } from "./refunds";
import { Persons } from "./persons";

export function Consults({
  permissions,
  userType,
}: ItemInterface): MenuRouteInterface {
  return {
    key: "consult",
    label: "consult",
    icon: <FileSearchOutlined style={{ fontSize: "23px" }} />,
    permission: permissions?.report?.menu,
    children: [
      Organization({ permissions, userType }),
      Merchant({ permissions, userType }),
      Deposits({ permissions, userType }),
      Withdrawals({ permissions, userType }),
      Refunds({ permissions, userType }),
      Persons({ permissions, userType }),
    ],
  };
}
