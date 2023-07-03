import {
  Avatar,
  Button,
  CollapseProps,
  Descriptions,
  Dropdown,
  Empty,
  Tooltip,
} from "antd";
import { Collapse } from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { BankOutlined, EllipsisOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { ColumnInterface } from "..";
import { useGetOrganizationBankMaintenece } from "@src/services/register/organization/bankMaitenence/getBanks";
import moment from "moment";

interface MobileProps {
  columns: ColumnInterface[];
  items: any;
  label: any;
  actions: any;
  setCurrentItem: Dispatch<SetStateAction<any>>;
  Confirm: any;
}

export const Mobile = (props: MobileProps) => {
  const { t } = useTranslation();
  const [active, setActive] = useState<string | string[]>(["1"]);
  const [items, setItems] = useState<CollapseProps["items"]>([]);
  const { BankMainteneceData } = useGetOrganizationBankMaintenece({
    limit: 200,
    page: 1,
    sort_field: "label_name",
    sort_order: "DESC",
  });

  useEffect(() => {
    setItems(
      props?.items?.map((item: any) => {
        return {
          key: item.id ?? item._id,
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
                            BankMainteneceData?.itens.find(
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
                    return (
                      <p key={label} style={{ fontSize: "12px" }}>
                        {t("table.createdAt")}:{" "}
                        {`${
                          item[label]
                            ? moment(item[label])
                                .subtract(3, "hours")
                                .format("YYYY/DD/MM HH:MM")
                            : ""
                        }`}
                      </p>
                    );
                  case "delivered_at":
                    return (
                      <p key={label} style={{ fontSize: "12px" }}>
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
                      </p>
                    );

                  default:
                    return <p key={label}>{item[label]}</p>;
                }
              })}
            </>
          ),
          extra: props.actions.length ? (
            <>
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
            <Descriptions bordered style={{ margin: 0 }}>
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
                        {`${new Date(
                          item[value.name]
                        ).toLocaleDateString()} ${new Date(
                          item[value.name]
                        ).toLocaleTimeString()}`}
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
                        <p
                          key={value.name}
                          style={{ width: "100%", textAlign: "center" }}
                        >
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(Number(item[value.name]) || 0)}
                        </p>
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
                                BankMainteneceData?.itens.find(
                                  (bank) =>
                                    bank.label_name?.split(" ").join("_") ===
                                    item[value.name]
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
                        {typeof item[value.name] === "boolean" ? (
                          <p
                            key={value.name}
                            style={{ width: "100%", textAlign: "center" }}
                          >
                            {item[value.name]
                              ? t("table.active")
                              : t("table.inactive")}
                          </p>
                        ) : (
                          <p
                            key={value.name}
                            style={{ width: "100%", textAlign: "center" }}
                          >
                            {t(`table.${item[value.name].toLocaleLowerCase()}`)}
                          </p>
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
                        <p
                          key={item[value.name]}
                          style={{ width: "100%", textAlign: "center" }}
                        >
                          {item[value.name]
                            ? t("table.true")
                            : t("table.false")}
                        </p>
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
                        <p
                          key={value.name}
                          style={{ width: "100%", textAlign: "center" }}
                        >
                          {item[value.name]?.replace(
                            /(\d{3})(\d{3})(\d{3})(\d{2})/,
                            "$1.$2.$3-$4"
                          ) || "-"}
                        </p>
                      </Descriptions.Item>
                    );

                  case "actions":
                  case "action":
                    return;

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
                        <p
                          key={value.name}
                          style={{ width: "100%", textAlign: "center" }}
                        >
                          {Array.isArray(value.name)
                            ? item[value.name[0]][value.name[1]]
                            : item[value.name]}
                        </p>
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
      {props.Confirm && props.Confirm}
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
