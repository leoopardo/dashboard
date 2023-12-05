/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const {
    PermissionMenusData,
    PermissionMenusDataError,
    isPermissionMenusDataFetching,
    isSuccessPermissionMenusData,
  } = useGetPermissionMenus({ group_id: group?.id });

  useEffect(() => {
    if (isSuccessPermissionMenusData && PermissionMenusData) {
      setTreeData(
        PermissionMenusData?.map((item) => {
          return {
            title: t(`permissions.${item?.name}`),
            key: `${item?.name}-${item.id.toString()}`,
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
                  key: `${
                    subPermission?.permission_type?.name
                  }-${subPermission.id.toString()}`,
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
                  key: `${permission?.name}-${permission.id.toString()}`,
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
                        key: `${
                          sub?.permission_type?.name
                        }-${sub.id.toString()}`,
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
                        key: sub.id.toString(),
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
                              key: `${
                                sub3?.permission_type?.name
                              }-${sub3.id.toString()}`,
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
                              key: `${sub3?.name}-${sub3.id.toString()}`,
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
                                ...sub3.permissions.map((sub4) => {
                                  return {
                                    title: t(
                                      `permissions.${sub4?.permission_type.name}`
                                    ),
                                    key: `${
                                      sub4?.permission_type?.name
                                    }-${sub4.id.toString()}`,
                                    style: {
                                      color:
                                        searchValue &&
                                        t(
                                          `permissions.${sub4?.permission_type?.name}`
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
  return (
    <Drawer
      title={`${t("table.permissions")}: ${group?.name}`}
      onClose={() => setOpen(false)}
      open={open}
    >
      {isPermissionMenusDataFetching ? (
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
          <Input.Search
            style={{ marginBottom: 8 }}
            placeholder="Search"
            onChange={onChange}
          />
          <Tree
            onExpand={onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            treeData={treeData}
            checkable
            showLine
            onCheck={(checkedKeys) => {
              console.log(checkedKeys);
            }}
          />
        </>
      )}
    </Drawer>
  );
};
