import { useGetPermissionMenus } from "@src/services/register/permissionGroups/getPermissionMenus";
import { Drawer, Form, Select } from "antd";
import Tree, { DataNode } from "antd/es/tree";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface PermissionsModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  group?: any;
}

export const PermissionsModal = ({
  open,
  setOpen,
  group,
}: PermissionsModalProps) => {
  const { t } = useTranslation();
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const {
    PermissionMenusData,
    PermissionMenusDataError,
    isPermissionMenusDataFetching,
    isSuccessPermissionMenusData,
  } = useGetPermissionMenus({ group_id: group?.id });

  console.log(PermissionMenusData);

  useEffect(() => {
    if (isSuccessPermissionMenusData && PermissionMenusData) {
      setTreeData(
        PermissionMenusData?.map((item) => {
          return {
            title: item?.name,
            key: item?.id?.toString(),
            children: [
              ...item.permissions.map((subPermission) => {
                return {
                  title: subPermission?.permission_type?.name,
                  key: subPermission.id.toString(),
                };
              }),
              ...item.menu_id_children.map((permission) => {
                return {
                  title: permission?.name,
                  key: permission.id.toString(),
                  children: [
                    ...permission.permissions.map((sub) => {
                      return {
                        title: sub?.permission_type?.name,
                        key: sub.id.toString(),

                      };
                    }),
                    ...permission.menu_id_children.map((sub) => {
                      return {
                        title: sub?.name,
                        key: sub.id.toString(),
                        children: sub.menu_id_children.map((supPermission) => {
                          return {
                            title: supPermission?.name,
                            key: supPermission.id.toString(),
                          };
                        }),
                      };
                    }),
                  ],
                };
              }),
            ],
          };
        })
      );
    }
  }, [PermissionMenusData]);

  // const treeData: DataNode[] = [
  //   {
  //     title: "Dashboard",
  //     key: "0-0",
  //     children: [
  //       {
  //         title: "parent 1-0",
  //         key: "0-0-0",
  //         children: [
  //           {
  //             title: "leaf",
  //             key: "0-0-0-0",
  //           },
  //           {
  //             title: "leaf",
  //             key: "0-0-0-1",
  //           },
  //         ],
  //       },
  //       {
  //         title: "parent 1-1",
  //         key: "0-0-1",

  //       },
  //     ],
  //   },
  //   {
  //     title: "Cadastros",
  //     key: "0-1",
  //     children: [
  //       {
  //         title: "parent 1-1",
  //         key: "0-1-0",
  //         children: [
  //           {
  //             title: "leaf",
  //             key: "0-1-0-0",
  //           },
  //           {
  //             title: "leaf",
  //             key: "0-1-0-1",
  //           },
  //         ],
  //       },
  //       {
  //         title: "parent 1-1",
  //         key: "0-1-1",
  //         children: [
  //           {
  //             title: <span style={{ color: "#1677ff" }}>sss</span>,
  //             key: "0-1-1-0",
  //           },
  //         ],
  //       },
  //     ],
  //   },
  //   {
  //     title: "Movimentações",
  //     key: "0-2",
  //     children: [
  //       {
  //         title: "parent 1-0",
  //         key: "0-2-0",
  //         children: [
  //           {
  //             title: "leaf",
  //             key: "0-2-0-0",
  //           },
  //           {
  //             title: "leaf",
  //             key: "0-2-0-1",
  //           },
  //         ],
  //       },
  //       {
  //         title: "parent 1-1",
  //         key: "0-2-1",
  //         children: [
  //           {
  //             title: <span style={{ color: "#1677ff" }}>sss</span>,
  //             key: "0-2-1-0",
  //           },
  //         ],
  //       },
  //     ],
  //   },
  // ];
  return (
    <Drawer
      title={`${t("table.permissions")}: ${group?.name}`}
      onClose={() => setOpen(false)}
      open={open}
    >
      <Tree treeData={treeData} checkable />
    </Drawer>
  );
};
