/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCreatePermission } from "@src/services/register/permissionGroups/createPermissions";
import { useGetPermissionGroup } from "@src/services/register/permissionGroups/getPermissionGroupById";
import { useGetPermissionMenus } from "@src/services/register/permissionGroups/getPermissionMenus";
import { defaultTheme } from "@src/styles/defaultTheme";
import { Drawer, Input, Spin } from "antd";
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
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [permissionList, setPermissionList] = useState<number[]>([]);
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [checked, setChecked] = useState<any[]>([]);
  const {
    PermissionMenusData,
    isPermissionMenusDataFetching,
    isSuccessPermissionMenusData,
  } = useGetPermissionMenus({ group_id: group?.id });

  const { PermissionGroupData, isPermissionGroupDataFetching } =
    useGetPermissionGroup(group?.id);
  const { PermissionMutate } = useCreatePermission(group?.id, permissionList);

  useEffect(() => {
    if (isSuccessPermissionMenusData && PermissionMenusData) {
      setTreeData(
        PermissionMenusData?.map((item) => {
          return {
            title: t(`permissions.${item?.name}`),
            key: `${item?.name}-${item.id.toString()}_menu`,
            style: {
              color:
                searchValue &&
                t(`permissions.${item?.name}`)
                  .toLowerCase()
                  .includes(searchValue.toLowerCase())
                  ? defaultTheme.colors.secondary
                  : undefined,
            },
            children: [
              ...item.permissions.map((subPermission) => {
                return {
                  title: t(
                    `permissions.${subPermission?.permission_type?.name}`
                  ),
                  key: `${subPermission.id.toString()}`,
                  style: {
                    color:
                      searchValue &&
                      t(`permissions.${subPermission?.permission_type?.name}`)
                        .toLowerCase()
                        .includes(searchValue.toLowerCase())
                        ? defaultTheme.colors.secondary
                        : undefined,
                  },
                };
              }),
              ...item.menu_id_children.map((permission) => {
                return {
                  title: t(`permissions.${permission?.name}`),
                  key: `${permission?.name}-${permission.id.toString()}_menu`,
                  style: {
                    color:
                      searchValue &&
                      t(`permissions.${permission?.name}`)
                        .toLowerCase()
                        .includes(searchValue.toLowerCase())
                        ? defaultTheme.colors.secondary
                        : undefined,
                  },
                  children: [
                    ...permission.permissions.map((sub) => {
                      return {
                        title: t(`permissions.${sub?.permission_type?.name}`),
                        key: `${sub.id.toString()}`,
                        style: {
                          color:
                            searchValue &&
                            t(`permissions.${sub?.permission_type?.name}`)
                              .toLowerCase()
                              .includes(searchValue.toLowerCase())
                              ? defaultTheme.colors.secondary
                              : undefined,
                        },
                      };
                    }),
                    ...permission.menu_id_children.map((sub) => {
                      return {
                        title: t(`permissions.${sub?.name}`),
                        key: `${sub?.name}-${sub.id.toString()}_menu`,
                        style: {
                          color:
                            searchValue &&
                            t(`permissions.${sub?.name}`)
                              .toLowerCase()
                              .includes(searchValue.toLowerCase())
                              ? defaultTheme.colors.secondary
                              : undefined,
                        },
                        children: [
                          ...sub.permissions.map((sub3) => {
                            return {
                              title: t(
                                `permissions.${sub3?.permission_type.name}`
                              ),
                              key: `${sub3.id.toString()}`,
                              style: {
                                color:
                                  searchValue &&
                                  t(
                                    `permissions.${sub3?.permission_type?.name}`
                                  )
                                    .toLowerCase()
                                    .includes(searchValue.toLowerCase())
                                    ? defaultTheme.colors.secondary
                                    : undefined,
                              },
                            };
                          }),
                          ...sub.menu_id_children.map((sub3) => {
                            return {
                              title: t(`permissions.${sub3?.name}`),
                              key: `${sub3?.name}-${sub3.id.toString()}_menu`,
                              style: {
                                color:
                                  searchValue &&
                                  t(`permissions.${sub3?.name}`)
                                    .toLowerCase()
                                    .includes(searchValue.toLowerCase())
                                    ? defaultTheme.colors.secondary
                                    : undefined,
                              },
                              children: [
                                ...sub3.menu_id_children.map((sub4) => {
                                  return {
                                    title: t(`permissions.${sub4?.name}`),
                                    key: `${sub4?.name}-${sub4.id.toString()}_menu`,
                                    style: {
                                      color:
                                        searchValue &&
                                        t(`permissions.${sub4?.name}`)
                                          .toLowerCase()
                                          .includes(searchValue.toLowerCase())
                                          ? defaultTheme.colors.secondary
                                          : undefined,
                                    },
                                    children: [
                                        ...sub4.permissions.map((sub5) => {
                                          return {
                                            title: t(
                                              `permissions.${sub5?.permission_type.name}`
                                            ),
                                            key: `${sub5.id.toString()}`,
                                            style: {
                                              color:
                                                searchValue &&
                                                t(
                                                  `permissions.${sub5?.permission_type?.name}`
                                                )
                                                  .toLowerCase()
                                                  .includes(searchValue.toLowerCase())
                                                  ? defaultTheme.colors.secondary
                                                  : undefined,
                                            },
                                          };
                                        }),
                                    ],
                                  };
                                }),
                              ],
                            };
                          }),
                        ],
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
  }, [PermissionMenusData, searchValue]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const data = [...treeData];
    const keys: any = [];

    if (!value) {
      setExpandedKeys([]);
      setSearchValue("");
      setAutoExpandParent(true);
      return;
    }

    data.filter((item) => {
      if (item.children) {
        for (const sub of item.children) {
          if (sub.children) {
            for (const subSub of sub.children) {
              if (subSub.children) {
                for (const subSubSub of subSub.children) {
                  if (
                    `${t(
                      `permissions.${subSubSub?.title}`
                    ).toLocaleLowerCase()}`.includes(value.toLocaleLowerCase())
                  ) {
                    keys.push(subSubSub.key);
                  }
                }
              }
              if (
                `${t(
                  `permissions.${subSub.title}`
                ).toLocaleLowerCase()}`.includes(value.toLocaleLowerCase())
              ) {
                keys.push(subSub.key);
              }
            }
          }

          if (
            `${t(`permissions.${sub.title}`).toLocaleLowerCase()}`.includes(
              value.toLocaleLowerCase()
            )
          ) {
            keys.push(sub.key);
          }
        }
      }
      if (
        `${t(`permissions.${item.title}`).toLocaleLowerCase()}`.includes(
          value.toLocaleLowerCase()
        )
      ) {
        keys.push(item.key);
      }
    });
    setExpandedKeys(keys);
    setSearchValue(value);
    setAutoExpandParent(true);
  };

  const onExpand = (newExpandedKeys: React.Key[]) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };

  useEffect(() => {
    if (permissionList.length >= 1) PermissionMutate();
  }, [permissionList]);

  useEffect(() => {
    if (PermissionGroupData) {
      setChecked(PermissionGroupData?.permissions.map((p) => `${p?.id}`));
    }
  }, [PermissionGroupData]);

  return (
    <Drawer
      title={`${t("table.permissions")}: ${group?.name}`}
      onClose={() => setOpen(false)}
      open={open}
    >
      {isPermissionMenusDataFetching || isPermissionGroupDataFetching ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Input
            style={{ marginBottom: 24 }}
            placeholder={`${t("input.search")}`}
            onChange={onChange}
            size="large"
          />
          <Tree
            onExpand={onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            treeData={treeData}
            checkable
            showLine
            defaultCheckedKeys={PermissionGroupData?.permissions.map(
              (p) => `${p?.id}`
            )}
            checkedKeys={checked}
            onCheck={(checkedKeys) => {
              setChecked(() => [
                ...(checkedKeys as any)
                  ?.filter((p: string) => !p.includes("_menu"))
                  ?.map((key: string) =>
                    key.split("-").length > 1 ? key.split("-")[1] : key
                  ),
              ]);
              setPermissionList(
                (checkedKeys as any)
                  ?.filter((p: string) => !p.includes("_menu"))
                  ?.map((key: string) =>
                    key.split("-").length > 1 ? +key.split("-")[1] : +key
                  )
              );
            }}
          />
        </>
      )}
    </Drawer>
  );
};
