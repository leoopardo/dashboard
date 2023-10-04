/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { BankOutlined, EllipsisOutlined } from "@ant-design/icons";
import { useListBanks } from "@src/services/bank/listBanks";
import {
  Avatar,
  Button,
  Checkbox,
  Collapse,
  CollapseProps,
  Descriptions,
  Dropdown,
  Empty,
  Tooltip,
  Typography,
} from "antd";
import moment from "moment";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ColumnInterface } from "..";

interface MobileProps {
  columns: ColumnInterface[];
  items: any;
  label: any;
  actions: any;
  setCurrentItem: Dispatch<SetStateAction<any>>;
  checkbox?: boolean;
  setSelectedRows?: Dispatch<SetStateAction<any[] | null>>;
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
          key: item.id ?? item._id,
          collapsible: "icon",
          label: (
            <>
              {props?.label?.map((label: string) => {
                switch (label) {
                  case "bank":
                  case "bank_name":
                    return (
                      <Tooltip placement="topLeft" title={item[label]} arrow>
                        <Avatar
                          src={
                            bankListData?.itens.find(
                              (bank) =>
                                bank.label_name?.split(" ").join("_") ===
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

                  case "merchant_name":
                    return ` - ${item[label]}`;
                  case "createdAt":
                  case "paid_at":
                    return (
                      <Typography key={label} style={{ fontSize: "12px" }}>
                        {t(`table.${label}`)}:{" "}
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
                            ? new Date(item[label]).toLocaleDateString()
                            : ""
                        } ${
                          item[label]
                            ? new Date(item[label]).toLocaleTimeString()
                            : "-"
                        }`}
                      </Typography>
                    );

                  case "value_total":
                  case "value":
                    return (
                      <Typography key={label}>
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(Number(item[label]) || 0)}
                      </Typography>
                    );

                  default:
                    return <Typography key={label}>{item[label]}</Typography>;
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
                    const arr = checkedRows;
                    if (!event.target.checked) {
                      arr.splice(
                        arr?.find((i: any) => i?.id === item?.id) ?? 0,
                        1
                      );

                      setCheckedRows(arr);
                      console.log(checkedRows, "removed");
                      return;
                    }
                    arr.push(item);
                    setCheckedRows(item);
                    console.log(checkedRows);
                  }}
                />
              )}
              <Dropdown
                menu={{ items: props.actions }}
                arrow
                onOpenChange={() => props.setCurrentItem(item)}
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
              {props.columns.map((value) => {
                switch (value.type) {
                  case "date":
                    return (
                      <Descriptions.Item
                        key={value.name}
                        label={t(`table.${value.head ?? value.name}`)}
                        labelStyle={{
                          maxWidth: "100px",
                          margin: 0,
                          padding: 5,
                        }}
                      >
                        <Typography
                          style={{ width: "100%", textAlign: "center" }}
                        >
                          {item[value.name]
                            ? `${new Date(
                                item[value.name]
                              ).toLocaleDateString()} ${new Date(
                                item[value.name]
                              ).toLocaleTimeString()}`
                            : "-"}
                        </Typography>
                      </Descriptions.Item>
                    );
                  case "value":
                    return (
                      <Descriptions.Item
                        key={value.name}
                        label={t(`table.${value.head ?? value.name}`)}
                        labelStyle={{
                          maxWidth: "100px",
                          margin: 0,
                          padding: 5,
                        }}
                      >
                        <Typography
                          key={value.name}
                          style={{ width: "100%", textAlign: "center" }}
                        >
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(Number(item[value.name]) || 0)}
                        </Typography>
                      </Descriptions.Item>
                    );
                  case "icon":
                    return (
                      <Descriptions.Item
                        key={value.name}
                        label={t(`table.${value.head ?? value.name}`)}
                        labelStyle={{
                          maxWidth: "100px",
                          margin: 0,
                          padding: 5,
                        }}
                      >
                        <div style={{ width: "100%", textAlign: "center" }}>
                          <Avatar
                            src={item[value.name]}
                            size="large"
                            shape="square"
                          />
                        </div>
                      </Descriptions.Item>
                    );

                  case "bankNameToIcon":
                    return (
                      <Descriptions.Item
                        key={value.name}
                        label={t(`table.${value.head ?? value.name}`)}
                        labelStyle={{
                          maxWidth: "100px",
                          margin: 0,
                          padding: 5,
                        }}
                      >
                        <div style={{ width: "100%", textAlign: "center" }}>
                          <Tooltip
                            placement="topLeft"
                            title={item[value.name]}
                            arrow
                          >
                            <Avatar
                              src={
                                Array.isArray(value.name)
                                  ? bankListData?.itens.find(
                                      (bank) =>
                                        bank.label_name
                                          ?.split(" ")
                                          .join("_") ===
                                        item[value.name[0]][value.name[1]]
                                    )?.icon_url ?? null
                                  : bankListData?.itens.find(
                                      (bank) =>
                                        bank.label_name
                                          ?.split(" ")
                                          .join("_") === item[value.name]
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
                        key={value.name}
                        label={t(`table.${value.head ?? value.name}`)}
                        labelStyle={{
                          maxWidth: "100px",
                          margin: 0,
                          padding: 5,
                        }}
                      >
                        {typeof item[value.name] === "boolean" ||
                        item[value.name] == 1 ||
                        item[value.name] == 0 ? (
                          <Typography
                            key={value.name}
                            style={{ width: "100%", textAlign: "center" }}
                          >
                            {item[value.name] || item[value.name] == 1
                              ? t("table.active")
                              : t("table.inactive")}
                          </Typography>
                        ) : (
                          <Typography
                            key={value.name}
                            style={{ width: "100%", textAlign: "center" }}
                          >
                            {t(`table.${item[value.name].toLocaleLowerCase()}`)}
                          </Typography>
                        )}
                      </Descriptions.Item>
                    );

                  case "boolean":
                    return (
                      <Descriptions.Item
                        key={value.name}
                        label={t(`table.${value.head ?? value.name}`)}
                        labelStyle={{
                          maxWidth: "100px",
                          margin: 0,
                          padding: 5,
                        }}
                      >
                        <Typography
                          key={item[value.name]}
                          style={{ width: "100%", textAlign: "center" }}
                        >
                          {item[value.name]
                            ? t("table.true")
                            : t("table.false")}
                        </Typography>
                      </Descriptions.Item>
                    );

                  case "document":
                    return (
                      <Descriptions.Item
                        key={value.name}
                        label={t(`table.${value.head ?? value.name}`)}
                        labelStyle={{
                          maxWidth: "100px",
                          margin: 0,
                          padding: 5,
                        }}
                      >
                        <Typography
                          key={value.name}
                          style={{ width: "100%", textAlign: "center" }}
                        >
                          {`${item[value.name]}`?.replace(
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
                          Array.isArray(value.name)
                            ? value.name + `${Math.random()}`
                            : value.name
                        }
                        label={t(`table.${value.head ?? value.name}`)}
                        labelStyle={{
                          maxWidth: "100px",
                          margin: 0,
                          padding: 5,
                        }}
                      >
                        {" "}
                        <Typography
                          key={value.name}
                          style={{ width: "100%", textAlign: "center" }}
                        >
                          {Array.isArray(value.name)
                            ? t(`table.${item[value.name[0]][value.name[1]]}`)
                            : t(`table.${item[value.name]}`)}
                        </Typography>
                      </Descriptions.Item>
                    );

                  default:
                    return (
                      <Descriptions.Item
                        key={
                          Array.isArray(value.name)
                            ? value.name + `${Math.random()}`
                            : value.name
                        }
                        label={t(`table.${value.head ?? value.name}`)}
                        labelStyle={{
                          maxWidth: "100px",
                          margin: 0,
                          padding: 5,
                        }}
                      >
                        {" "}
                        <Typography
                          key={value.name}
                          style={{ width: "100%", textAlign: "center" }}
                        >
                          {Array.isArray(value.name)
                            ? item[value.name[0]][value.name[1]]
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
    <>
      <Collapse
        expandIconPosition="end"
        items={items}
        onChange={onChange}
        activeKey={active}
        style={{ width: "100%" }}
      />
    </>
  ) : (
    <Empty
      style={{ padding: 15, paddingBottom: 30 }}
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={t("messages.empty_table_data")}
    />
  );
};
