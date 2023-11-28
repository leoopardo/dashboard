/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  BankOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import { useListBanks } from "@src/services/bank/listBanks";
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
import moment from "moment";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ColumnInterface, actionsInterface } from "..";

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
}

export const Mobile = (props: MobileProps) => {
  const { t } = useTranslation();
  const [active, setActive] = useState<string | string[]>([]);
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
                    !item[label.split(".")[0]] ||
                    !item[label.split(".")[0]][label.split(".")[1]]
                  ) {
                    return;
                  }
                  if (label.split(".")[1] === "cash_in_bank") {
                    return (
                      <Tooltip placement="topLeft" title={item[label]} arrow>
                        <ArrowUpOutlined
                          style={{ color: "lightgreen", paddingTop: 5 }}
                        />
                        <Avatar
                          src={
                            bankListData?.itens.find(
                              (bank) =>
                                bank?.label_name?.split(".").join("_") ===
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
                                bank?.label_name?.split(".").join("_") ===
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
                    return (
                      <Tooltip placement="topLeft" title={item[label]} arrow>
                        <Avatar
                          src={
                            bankListData?.itens.find(
                              (bank) =>
                                bank?.label_name?.split(" ").join("_") ===
                                item[label]
                            )?.icon_url ?? null
                          }
                          size="large"
                          shape="square"
                        >
                          <BankOutlined />
                        </Avatar>
                      </Tooltip>
                    );

                  case "createdAt":
                  case "paid_at":
                  case "updated_at":
                    return (
                      <Typography key={label} style={{ fontSize: "12px" }}>
                        <span> {t(`table.${label}`)}: </span>
                        {`${
                          item[label]
                            ? moment(item[label])
                                .subtract(3, "hours")
                                .format("YYYY/DD/MM HH:MM")
                            : ""
                        }`}
                      </Typography>
                    );
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
                      <Typography key={label}>
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
                  case "balance_to_transactions":
                    return (
                      <Typography key={label}>
                        {item && label && typeof item[label] === "number"
                          ? new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(Number(item[label]))
                          : ""}
                      </Typography>
                    );

                  case "total":
                    return !props.removeValue ? (
                      <Typography key={label}>
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(Number(item[label]) || 0)}
                      </Typography>
                    ) : (
                      <Typography key={label}>
                        {Number(item[label]) || 0}
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
                          {item &&
                          value &&
                          value.name &&
                          item[value.name] !== undefined
                            ? new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              }).format(Number(item[value.name]))
                            : "-"}
                        </Typography>
                      </Descriptions.Item>
                    );
                  case "icon":
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
                          {item &&
                          value &&
                          value.name &&
                          item[value.name] !== undefined
                            ? item[value.name]
                            : "-"}
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
                            <Avatar
                              src={
                                Array.isArray(value?.name) &&
                                item[value?.name[0]]
                                  ? bankListData?.itens.find(
                                      (bank) =>
                                        bank?.label_name
                                          ?.split(" ")
                                          .join("_") ===
                                        item[value?.name[0]][value?.name[1]]
                                    )?.icon_url ?? null
                                  : bankListData?.itens.find(
                                      (bank) =>
                                        bank.label_name
                                          ?.split(" ")
                                          .join("_") === item[value?.name]
                                    )?.icon_url ?? null
                              }
                              size="large"
                              shape="square"
                            >
                              <BankOutlined />
                            </Avatar>
                          </Tooltip>
                        </div>
                      </Descriptions.Item>
                    );

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
                            ? t(`table.${item[value?.name[0]][value?.name[1]]}`)
                            : t(`table.${item[value?.name]}`)}
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
                          onClick={() =>
                            console.log(
                              Array.isArray(value?.name) && item[value?.name[0]]
                                ? item[value?.name[0]][value?.name[1]]
                                : item[value?.name]
                            )
                          }
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
