/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  BankOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import { useListBanks } from "@src/services/bank/listBanks";
import { defaultTheme } from "@src/styles/defaultTheme";
import {
  Avatar,
  Button,
  Checkbox,
  Collapse,
  CollapseProps,
  Descriptions,
  Divider,
  Dropdown,
  Empty,
  Tooltip,
  Typography,
} from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ColumnInterface, actionsInterface } from "..";
import { moneyFormatter } from "@src/utils/moneyFormatter";
import { useGetrefetchCountries } from "@src/services/states_cities/getCountries";

interface MobileProps {
  columns: ColumnInterface[];
  items: any;
  label: any;
  removeValue?: boolean;
  actions: any;
  setCurrentItem: Dispatch<SetStateAction<any>>;
  checkbox?: boolean;
  setSelectedRows?: Dispatch<SetStateAction<any[] | null>>;
  selectedKeys?: any;
  loading?: boolean;
}

export const Mobile = (props: MobileProps) => {
  const { t } = useTranslation();
  const [active, setActive] = useState<string | string[]>([]);
  const { Countries } = useGetrefetchCountries();
  const translation = useTranslation().i18n.language;
  const [items, setItems] = useState<CollapseProps["items"]>([]);
  const [checkedRows, setCheckedRows] = useState<any[]>([]);
  const { bankListData } = useListBanks({
    limit: 200,
    page: 1,
  });
  useEffect(() => {
    if (props.setSelectedRows) props.setSelectedRows(checkedRows);
  }, [checkedRows]);

  useEffect(() => {
    if (props?.items?.length >= 1 && !props?.loading) {
      setItems(
        props?.items?.map((item: any) => {
          return {
            key: item?.id ?? item?._id,
            collapsible: "icon",
            label: (
              <>
                {props?.label?.map((label: string) => {
                  if (label.split(".").length === 2) {
                    if (
                      !item[label?.split(".")[0]] ||
                      !item[label?.split(".")[0]][label?.split(".")[1]]
                    ) {
                      return;
                    }
                    if (label?.split(".")[1] === "cash_in_bank") {
                      return (
                        <Tooltip placement="topLeft" title={item[label]} arrow>
                          <ArrowUpOutlined
                            style={{ color: "lightgreen", paddingTop: 5 }}
                          />
                          <Avatar
                            src={
                              bankListData?.itens.find(
                                (bank) =>
                                  bank?.bank ===
                                  item?.merchantConfig?.cash_in_bank
                              )?.icon_url ?? null
                            }
                            size="small"
                            shape="square"
                          >
                            <BankOutlined />
                          </Avatar>
                        </Tooltip>
                      );
                    }
                    if (label?.split(".")[1] === "name") {
                      return (
                        <Typography>
                          {t(`table.${label?.split(".")[0]}`)}:{" "}
                          {item[label?.split(".")[0]]?.name}
                        </Typography>
                      );
                    }
                    if (label.split(".")[1] === "cash_out_bank") {
                      return (
                        <Tooltip placement="topLeft" title={item[label]} arrow>
                          <ArrowDownOutlined
                            style={{
                              color: "red",
                              paddingLeft: 5,
                              paddingTop: 5,
                            }}
                          />
                          <Avatar
                            src={
                              bankListData?.itens.find(
                                (bank) =>
                                  bank?.bank ===
                                  item?.merchantConfig?.cash_out_bank
                              )?.icon_url ?? null
                            }
                            size="small"
                            shape="square"
                          >
                            <BankOutlined />
                          </Avatar>
                        </Tooltip>
                      );
                    }
                  }
                  switch (label) {
                    case "bank":
                    case "bank_name":
                      return item[label];

                    case "createdAt":
                    case "paid_at":
                    case "updated_at":
                    case "last_check":
                      return (
                        <Typography key={label} style={{ fontSize: "12px" }}>
                          <span> {t(`table.${label}`)}: </span>
                          {`${
                            item[label]
                              ? `${new Date(
                                  item[label]
                                ).toLocaleDateString()} ${new Date(
                                  item[label]
                                ).toLocaleTimeString()}`
                              : ""
                          }`}
                        </Typography>
                      );
                    case "cash_in":
                    case "cash_out": {
                      return typeof item[label] === "boolean" ||
                        item[label] === 0 ||
                        item[label] === 1 ? (
                        <>
                          <Typography key={label}>
                            <span>{t(`table.${label && label}`)}:</span>{" "}
                            {item[label] || item[label] === 1
                              ? t("table.true")
                              : t("table.false")}
                          </Typography>
                        </>
                      ) : (
                        <Typography
                          key={label}
                          style={{
                            color: (defaultTheme.colors as any)[
                              item[label]?.toLocaleLowerCase()
                            ],
                          }}
                        >
                          {t(`table.${item[label]?.toLocaleLowerCase()}`)}
                        </Typography>
                      );
                    }
                    case "status": {
                      return typeof item[label] === "boolean" ||
                        item[label] === 0 ||
                        item[label] === 1 ? (
                        <Typography key={label}>
                          {item[label] || item[label] === 1
                            ? t("table.active")
                            : t("table.inactive")}
                        </Typography>
                      ) : (
                        <Typography
                          key={label}
                          style={{
                            color: (defaultTheme.colors as any)[
                              item[label]?.toLocaleLowerCase()
                            ],
                          }}
                        >
                          {t(`table.${item[label]?.toLocaleLowerCase()}`)}
                        </Typography>
                      );
                    }

                    case "delivered_at":
                      return (
                        <Typography key={label} style={{ fontSize: "12px" }}>
                          {t("table.delivered_at")}:{" "}
                          {`${
                            item[label]
                              ? new Date(item[label])?.toLocaleDateString()
                              : ""
                          } ${
                            item[label]
                              ? new Date(item[label])?.toLocaleTimeString()
                              : "-"
                          }`}
                        </Typography>
                      );

                    case "profileType":
                      return (
                        <Typography key={label}>
                          {t(
                            `table.${item?.profileType?.name
                              .toString()
                              .toLowerCase()}`
                          )}
                        </Typography>
                      );

                    case "value_total":
                    case "value":
                      return (
                        <Typography
                          key={label}
                          style={{
                            color: (defaultTheme.colors as any)[
                              item?.status?.toLocaleLowerCase()
                            ],
                          }}
                        >
                          {item?.type === "in" ? (
                            <ArrowUpOutlined />
                          ) : item?.type === "out" ? (
                            <ArrowDownOutlined />
                          ) : (
                            " "
                          )}{" "}
                          {moneyFormatter(item[label] ?? 0)}
                        </Typography>
                      );

                    case "total":
                      return !props.removeValue ? (
                        <Typography key={label}>
                          {moneyFormatter(Number(item[label]) || 0)}
                        </Typography>
                      ) : (
                        <Typography key={label}>
                          {Number(item[label]) || 0}
                        </Typography>
                      );

                    case "balance_to_transactions":
                    case "balance_to_payment":
                    case "balance_reserved":
                      return (
                        <Typography key={label}>
                          <span>{t(`table.${label && label}`)}:</span>{" "}
                          {moneyFormatter(item[label] ?? 0)}
                        </Typography>
                      );

                    default:
                      return (
                        <>
                          <Typography key={label}>
                            <span>{t(`table.${label && label}`)}:</span>{" "}
                            {label && item && item[label] !== undefined
                              ? item[label]
                              : ""}
                          </Typography>
                          <Divider style={{ margin: 2, padding: 2 }} dashed />
                        </>
                      );
                  }
                })}
              </>
            ),
            extra: props.actions.length ? (
              <>
                {props.checkbox && (
                  <Checkbox
                    style={{ marginRight: 16 }}
                    onChange={(event) => {
                      if (!event.target.checked) {
                        setCheckedRows((state) => {
                          state.splice(state.indexOf(item), 1);
                          return [...state];
                        });
                        return;
                      }
                      setCheckedRows((state) => [...state, item]);
                    }}
                  />
                )}
                <Dropdown
                  trigger={["click"]}
                  menu={{
                    items: props.actions.map((action: actionsInterface) => {
                      let disable = false;

                      if (action.disabled) {
                        action.disabled(item)
                          ? (disable = true)
                          : (disable = false);
                      }

                      return {
                        ...action,
                        disabled: disable,
                        onClick: () => {
                          if (action && action.onClick) {
                            action.onClick(item);
                          }
                        },
                      };
                    }),
                  }}
                  onOpenChange={(open) => {
                    if (open) {
                      props.setCurrentItem(item);
                    }
                  }}
                  arrow
                >
                  <Button style={{ width: "45px" }}>
                    <EllipsisOutlined />
                  </Button>
                </Dropdown>
              </>
            ) : (
              <></>
            ),

            children: (
              <Descriptions bordered style={{ margin: 0, padding: 0 }}>
                {props?.columns?.map((value) => {
                  switch (value?.type) {
                    case "date":
                      return (
                        <Descriptions.Item
                          key={value?.name}
                          label={t(`table.${value?.head ?? value?.name}`)}
                          labelStyle={{
                            maxWidth: "100px",
                            margin: 0,
                            padding: 5,
                          }}
                        >
                          <Typography
                            style={{ width: "100%", textAlign: "center" }}
                          >
                            {item[value?.name]
                              ? `${new Date(
                                  item[value?.name]
                                )?.toLocaleDateString()} ${new Date(
                                  item[value?.name]
                                )?.toLocaleTimeString()}`
                              : "-"}
                          </Typography>
                        </Descriptions.Item>
                      );
                    case "value":
                      return (
                        <Descriptions.Item
                          key={value?.name}
                          label={t(`table.${value.head ?? value?.name}`)}
                          labelStyle={{
                            maxWidth: "100px",
                            margin: 0,
                            padding: 5,
                          }}
                        >
                          <Typography
                            key={value?.name}
                            style={{ width: "100%", textAlign: "center" }}
                          >
                            {moneyFormatter(Number(item[value?.name]) || 0)}
                          </Typography>
                        </Descriptions.Item>
                      );
                    case "icon":
                      return (
                        <Descriptions.Item
                          key={value?.name}
                          label={t(`table.${value.head ?? value?.name}`)}
                          labelStyle={{
                            maxWidth: "100px",
                            margin: 0,
                            padding: 5,
                          }}
                        >
                          <div style={{ width: "100%", textAlign: "center" }}>
                            <Avatar
                              src={item[value?.name]}
                              size="large"
                              shape="square"
                            />
                          </div>
                        </Descriptions.Item>
                      );

                    case "text":
                      return (
                        <Descriptions.Item
                          key={value?.name}
                          label={t(`table.${value.head ?? value?.name}`)}
                          labelStyle={{
                            maxWidth: "100px",
                            margin: 0,
                            padding: 5,
                          }}
                        >
                          <Typography
                            style={{ width: "100%", textAlign: "center" }}
                          >
                            {item[value?.name] ?? "-"}
                          </Typography>
                        </Descriptions.Item>
                      );

                    case "bankNameToIcon":
                      return (
                        <Descriptions.Item
                          key={value?.name}
                          label={t(`table.${value?.head ?? value?.name}`)}
                          labelStyle={{
                            maxWidth: "100px",
                            margin: 0,
                            padding: 5,
                          }}
                        >
                          <div style={{ width: "100%", textAlign: "center" }}>
                            <Tooltip
                              placement="topLeft"
                              title={item[value?.name]}
                              arrow
                            >
                              {value?.name.length === 2 ? (
                                <Avatar
                                  src={
                                    Array.isArray(value?.name) &&
                                    item[value?.name[0]]
                                      ? bankListData?.itens.find(
                                          (bank) =>
                                            bank?.bank ===
                                            item[value?.name[0]][value?.name[1]]
                                        )?.icon_url ?? null
                                      : bankListData?.itens.find(
                                          (bank) =>
                                            bank?.bank === item[value?.name]
                                        )?.icon_url ?? null
                                  }
                                  size="large"
                                  shape="square"
                                >
                                  <BankOutlined />
                                </Avatar>
                              ) : (
                                <Avatar
                                  src={
                                    bankListData?.itens.find(
                                      (bank) => bank?.bank === item[value?.name]
                                    )?.icon_url ?? null
                                  }
                                  size="large"
                                  shape="square"
                                >
                                  <BankOutlined />
                                </Avatar>
                              )}
                            </Tooltip>
                          </div>
                        </Descriptions.Item>
                      );

                    case "switch":
                    case "status":
                      return (
                        <Descriptions.Item
                          key={value?.name}
                          label={t(`table.${value?.head ?? value?.name}`)}
                          labelStyle={{
                            maxWidth: "100px",
                            margin: 0,
                            padding: 5,
                          }}
                        >
                          {typeof item[value?.name] === "boolean" ||
                          item[value?.name] == 1 ||
                          item[value?.name] == 0 ? (
                            <Typography
                              key={value?.name}
                              style={{ width: "100%", textAlign: "center" }}
                            >
                              {item[value?.name] || item[value?.name] == 1
                                ? t("table.active")
                                : t("table.inactive")}
                            </Typography>
                          ) : (
                            <Typography
                              key={value?.name}
                              style={{ width: "100%", textAlign: "center" }}
                            >
                              {item[value?.name]
                                ? t(
                                    `table.${item[
                                      value?.name
                                    ]?.toLocaleLowerCase()}`
                                  )
                                : "-"}
                            </Typography>
                          )}
                        </Descriptions.Item>
                      );

                    case "country": {
                      const currentCountry = Countries?.find((country) => {
                        return (
                          country?.name?.common ===
                          item[value.name as keyof typeof item]
                        );
                      });

                      return (
                        <Descriptions.Item
                          key={item[value?.name]}
                          label={t(`table.${value?.head ?? value.name}`)}
                          labelStyle={{
                            maxWidth: "100px",
                            margin: 0,
                            padding: 5,
                          }}
                        >
                          <Typography
                            key={value?.name}
                            style={{ width: "100%", textAlign: "center" }}
                          >
                            {translation === "pt-BR"
                              ? currentCountry?.translations?.por?.common
                              : currentCountry?.name?.common}
                          </Typography>
                        </Descriptions.Item>
                      );
                    }

                    case "status_color": {
                      return (
                        <Descriptions.Item
                          key={value?.name}
                          label={t(`table.${value?.head ?? value?.name}`)}
                          labelStyle={{
                            maxWidth: "100px",
                            margin: 0,
                            padding: 5,
                          }}
                        >
                          <Typography
                            key={value?.name}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignContent: "center",
                              textAlign: "center",
                              color: (defaultTheme.colors as any)[
                                item[value?.name]?.toString()?.toLocaleLowerCase()
                              ],
                              fontWeight: 600,
                              wordBreak: "keep-all",
                              alignItems: "center",
                              gap: "6px",
                              borderRadius: "4px",
                              border: "1px solid #DCDFE7",
                              padding: "0 4px 0 4px",
                              width: "fit-content",
                              margin: "0 auto",
                            }}
                          >
                            <div
                              style={{
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                backgroundColor: (defaultTheme.colors as any)[
                                  item[value?.name]?.toString()?.toLocaleLowerCase()
                                ],
                              }}
                            />
                            {t(
                              `table.${item[value?.name]?.toString()?.toLocaleLowerCase()}`
                            )}
                          </Typography>
                        </Descriptions.Item>
                      );
                    }

                    case "boolean":
                      return (
                        <Descriptions.Item
                          key={value?.name}
                          label={t(`table.${value?.head ?? value?.name}`)}
                          labelStyle={{
                            maxWidth: "100px",
                            margin: 0,
                            padding: 5,
                          }}
                        >
                          <Typography
                            key={item[value?.name]}
                            style={{ width: "100%", textAlign: "center" }}
                          >
                            {item[value?.name]
                              ? t("table.true")
                              : t("table.false")}
                          </Typography>
                        </Descriptions.Item>
                      );

                    case "document":
                      return (
                        <Descriptions.Item
                          key={value?.name}
                          label={t(`table.${value?.head ?? value?.name}`)}
                          labelStyle={{
                            maxWidth: "100px",
                            margin: 0,
                            padding: 5,
                          }}
                        >
                          <Typography
                            key={value?.name}
                            style={{ width: "100%", textAlign: "center" }}
                          >
                            {`${item[value?.name]}`?.replace(
                              /(\d{3})(\d{3})(\d{3})(\d{2})/,
                              "$1.$2.$3-$4"
                            ) || "-"}
                          </Typography>
                        </Descriptions.Item>
                      );

                    case "actions":
                    case "action":
                      return;

                    case "translate":
                      return (
                        <Descriptions.Item
                          key={
                            Array.isArray(value?.name) && item[value?.name[0]]
                              ? value?.name + `${Math.random()}`
                              : value?.name
                          }
                          label={t(`table.${value?.head ?? value?.name}`)}
                          labelStyle={{
                            maxWidth: "100px",
                            margin: 0,
                            padding: 5,
                          }}
                        >
                          {" "}
                          <Typography
                            key={value?.name}
                            style={{ width: "100%", textAlign: "center" }}
                          >
                            {Array.isArray(value?.name) && item[value?.name[0]]
                              ? t(
                                  `table.${
                                    item[value?.name[0]][
                                      value?.name[1]?.toString().toLowerCase()
                                    ]
                                  }`
                                )
                              : t(
                                  `table.${item[value?.name]
                                    ?.toString()
                                    .toLowerCase()}`
                                )}
                          </Typography>
                        </Descriptions.Item>
                      );

                    default:
                      return (
                        <Descriptions.Item
                          key={
                            Array.isArray(value?.name) && item[value?.name[0]]
                              ? value?.name + `${Math.random()}`
                              : value?.name
                          }
                          label={t(`table.${value?.head ?? value?.name}`)}
                          labelStyle={{
                            maxWidth: "100px",
                            margin: 0,
                            padding: 5,
                          }}
                        >
                          <Typography
                            key={value?.name}
                            style={{ width: "100%", textAlign: "center" }}
                          >
                            {Array.isArray(value?.name) &&
                            item[value?.name[0]] &&
                            item[value?.name[0]]
                              ? item[value?.name[0]][value?.name[1]]
                              : !item[value.name]
                              ? "-"
                              : item[value.name]}
                          </Typography>
                        </Descriptions.Item>
                      );
                  }
                })}
              </Descriptions>
            ),
          };
        })
      );
    }
  }, [props?.items]);

  const onChange = (key: string | string[]) => {
    setActive(key);
  };
  return props?.items?.length >= 1 ? (
    <div style={{ width: "100%" }}>
      <Collapse
        expandIconPosition="end"
        items={items}
        onChange={onChange}
        activeKey={active}
        style={{ width: "100%", minWidth: "100%" }}
        size="small"
      />
    </div>
  ) : (
    <Empty
      style={{ padding: 15, paddingBottom: 30 }}
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={t("messages.empty_table_data")}
    />
  );
};
