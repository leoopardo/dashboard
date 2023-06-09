import {
  Avatar,
  Button,
  CollapseProps,
  Descriptions,
  Dropdown,
  Typography,
} from "antd";
import { Collapse } from "antd";
import { t } from "i18next";
import React, { useEffect, useState } from "react";
import { getColor } from "../../../utils/getColor";
import { EllipsisOutlined } from "@ant-design/icons";

interface MobileProps {
  columns: any;
  items: any;
  label: any;
  actions: any;
}

export const Mobile = (props: MobileProps) => {
  const [active, setActive] = useState<string | string[]>(["1"]);
  const [items, setItems] = useState<CollapseProps["items"]>([]);

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
                    return <Avatar key={label}>B</Avatar>;
                  case "merchant_name":
                    return ` - ${item[label]}`;
                  case "createdAt":
                    return (
                      <p key={label} style={{ fontSize: "12px" }}>
                        {t("table.createdAt")}:{" "}
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

                  case "status":
                    return (
                      <p
                        key={label}
                        style={{ color: getColor(item[label].toLowerCase()) }}
                      >
                        {t(`table.${item[label].toLowerCase()}`)}:{" "}
                        <>
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(Number(item?.value) || 0)}
                        </>
                      </p>
                    );
                  default:
                    return <p key={label}>{item[label]}</p>;
                }
              })}
            </>
          ),
          extra: (
            <Dropdown menu={{ items: props.actions }} arrow>
              <Button style={{ width: "45px" }}>
                <EllipsisOutlined />
              </Button>
            </Dropdown>
          ),

          children: (
            <Descriptions bordered style={{margin: 0}}>
              {Object.keys(item).map((key, value) => {
                switch (key) {
                  case "createdAt":
                  case "delivered_at":
                    return (
                      <Descriptions.Item
                        key={key}
                        label={t(`table.${key}`)}
                        labelStyle={{
                          maxWidth: "100px",
                          margin: 0,
                          padding: 5,
                        }}
                      >
                        {`${new Date(
                          item[key]
                        ).toLocaleDateString()} ${new Date(
                          item[key]
                        ).toLocaleTimeString()}`}
                      </Descriptions.Item>
                    );

                  default:
                    return (
                      <Descriptions.Item
                        key={key}
                        label={t(`table.${key}`)}
                        labelStyle={{
                          maxWidth: "100px",
                          margin: 0,
                          padding: 5,
                        }}
                      >
                        {item[key]}
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
  return (
    <Collapse
      expandIconPosition="end"
      items={items}
      onChange={onChange}
      activeKey={active}
      style={{ width: "100%" }}
    />
  );
};
