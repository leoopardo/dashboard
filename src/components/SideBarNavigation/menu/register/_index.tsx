import { FolderAddOutlined } from "@ant-design/icons";
import { MenuRouteInterface } from "..";
import { ItemInterface } from "../types/item.interface";
import { Organization } from "./organization";
import { Aggregators } from "./aggregators";
import { Partners } from "./partners";
import { Operators } from "./operators";
import { Merchants } from "./merchants";
import { Persons } from "./persons";
import { Licenses } from "./licenses";

export function Register({
  permissions,
  userType,
}: ItemInterface): MenuRouteInterface {
  return {
    key: "register",
    label: "register",
    icon: <FolderAddOutlined style={{ fontSize: "23px" }} />,
    permission:
      permissions?.register?.aggregator?.menu ||
      permissions?.register?.merchant?.menu ||
      permissions?.register?.operator?.menu ||
      permissions?.register?.partner?.menu ||
      permissions?.register?.paybrokers?.menu ||
      permissions?.register?.person?.menu ||
      permissions?.register?.licenses?.menu,
    children: [
      Organization({ permissions, userType }),
      Aggregators({ permissions }),
      Partners({ permissions }),
      Operators({ permissions }),
      Merchants({ permissions }),
      Persons({ permissions }),
      Licenses({ permissions }),
    ],
  };
}
