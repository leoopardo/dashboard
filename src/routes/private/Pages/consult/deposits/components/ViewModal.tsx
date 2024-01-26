/* eslint-disable @typescript-eslint/no-explicit-any */
import { CopyOutlined } from "@ant-design/icons";
import { Grid } from "@mui/material";
import {
  Button,
  Descriptions,
  Drawer,
  Input,
  QRCode,
  Segmented,
  Spin,
  Typography,
} from "antd";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useGetDeposit } from "../../../../../../services/consult/deposits/generatedDeposits/getDeposit";
import { moneyFormatter } from "@src/utils/moneyFormatter";

interface ViewModalProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  open: boolean;
  id?: string | null;
}

export const ViewModal = (props: ViewModalProps) => {
  const { t } = useTranslation();
  const onClose = () => {
    props.setOpen(false);
  };

  const { deposit, isDepositFetching } = useGetDeposit(`${props.id}`);
  const [currOption, setCurrOption] = useState<any>("transaction");

  return (
    <Drawer
      title={`${t("table.details")}: (${props?.id || "-"})`}
      placement="right"
      onClose={onClose}
      open={props.open}
      bodyStyle={{ padding: 0 }}
    >
      <Grid container>
        <Grid item xs={12}>
          <Segmented
            block
            size="middle"
            style={{ width: "100%" }}
            value={currOption}
            options={[
              { label: t("table.transaction"), value: "transaction" },
              { label: t("table.buyer"), value: "buyer" },
              {
                label: t("table.payer"),
                value: "payer",
                disabled: deposit?.status !== "PAID",
              },
            ]}
            onChange={(value) => {
              setCurrOption(value);
            }}
          />
        </Grid>{" "}
        {isDepositFetching && <Spin />}{" "}
        {deposit && (
          <Grid xs={12}>
            <Descriptions bordered style={{ margin: 0, padding: 0 }} column={1}>
              {currOption === "transaction" &&
                Object.keys(deposit).map((key: string) => {
                  switch (key) {
                    case "createdAt":
                    case "paid_at":
                    case "delivered_at":
                      return (
                        <Descriptions.Item
                          key={key}
                          label={t(`table.${key}`)}
                          labelStyle={{
                            maxWidth: "120px !important",
                            margin: 0,
                            padding: 0,
                            textAlign: "center",
                          }}
                        >
                          {`${new Date(
                            deposit[key]
                          ).toLocaleDateString()} ${new Date(
                            deposit[key]
                          ).toLocaleTimeString()}`}
                        </Descriptions.Item>
                      );

                    case "merchant_name":
                    case "bank":
                    case "reference_id":
                    case "description":
                    case "buyer_name":
                    case "payer_name":
                      return (
                        deposit[key] !== "N/A" && (
                          <Descriptions.Item
                            key={key}
                            label={t(`table.${key}`)}
                            labelStyle={{
                              maxWidth: "120px !important",
                              margin: 0,
                              padding: 0,
                              textAlign: "center",
                            }}
                          >
                            {deposit[key]}
                          </Descriptions.Item>
                        )
                      );
                    case "webhook_url":
                    case "webhook_url_optional":
                    case "txid":
                    case "endToEndId":
                    case "_id":
                      return (
                        deposit[key] !== "N/A" &&
                        deposit[key] && (
                          <Descriptions.Item
                            key={key}
                            label={t(`table.${key}`)}
                            labelStyle={{
                              maxWidth: "120px !important",
                              margin: 0,
                              padding: 0,
                              textAlign: "center",
                            }}
                          >
                            <Typography.Text copyable>
                              {deposit[key]}
                            </Typography.Text>
                          </Descriptions.Item>
                        )
                      );

                    case "payer_document":
                    case "buyer_document":
                      return (
                        <Descriptions.Item
                          key={key}
                          label={t(`table.${key}`)}
                          labelStyle={{
                            maxWidth: "120px !important",
                            margin: 0,
                            padding: 0,
                            textAlign: "center",
                          }}
                        >
                          {`${deposit[key]}`.replace(
                            /(\d{3})(\d{3})(\d{3})(\d{2})/,
                            "$1.$2.$3-$4"
                          )}
                        </Descriptions.Item>
                      );

                    case "qr_code":
                      return (
                        <Descriptions.Item
                          key={key}
                          label={t(`table.${key}`)}
                          labelStyle={{
                            maxWidth: "120px !important",
                            margin: 0,
                            padding: 0,
                            textAlign: "center",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <QRCode
                              value={deposit[key] || "-"}
                              icon={import.meta.env.VITE_APP_ICON}
                              errorLevel="L"
                              type="canvas"
                              style={{ marginBottom: "5px" }}
                            />
                            <Input
                              placeholder="-"
                              value={deposit[key] || "-"}
                              addonAfter={
                                <Button
                                  size="small"
                                  type="ghost"
                                  onClick={() => {
                                    navigator.clipboard.writeText(deposit[key]);
                                    toast.success(t("table.copied"));
                                  }}
                                >
                                  <CopyOutlined />
                                </Button>
                              }
                            />
                          </div>
                        </Descriptions.Item>
                      );
                    case "value":
                      return (
                        <Descriptions.Item
                          key={key}
                          label={t(`table.${key}`)}
                          labelStyle={{
                            maxWidth: "120px !important",
                            margin: 0,
                            padding: 0,
                            textAlign: "center",
                          }}
                        >
                          {" "}
                          {moneyFormatter(Number(deposit[key]) || 0)}
                        </Descriptions.Item>
                      );

                    default:
                      return;
                  }
                })}
              {currOption === "buyer" &&
                Object.keys(deposit).map((key: string) => {
                  switch (key) {
                    case "buyer_birth_date":
                      return (
                        <Descriptions.Item
                          key={key}
                          label={t(`table.${key}`)}
                          labelStyle={{
                            maxWidth: "120px !important",
                            margin: 0,
                            padding: 0,
                            textAlign: "center",
                          }}
                        >
                          {`${new Date(
                            deposit[key]
                          ).toLocaleDateString()} ${new Date(
                            deposit[key]
                          ).toLocaleTimeString()}`}
                        </Descriptions.Item>
                      );
                    case "buyer_city":
                    case "buyer_email":
                    case "buyer_gender":
                    case "buyer_name":
                    case "buyer_neighborhood":
                    case "buyer_number":
                    case "buyer_state":
                    case "buyer_street":
                    case "buyer_zip_code":
                      return (
                        deposit[key] !== "N/A" && (
                          <Descriptions.Item
                            key={key}
                            label={t(`table.${key}`)}
                            labelStyle={{
                              maxWidth: "120px !important",
                              margin: 0,
                              padding: 0,
                              textAlign: "center",
                            }}
                          >
                            {deposit[key]}
                          </Descriptions.Item>
                        )
                      );

                    case "buyer_document":
                      return (
                        <Descriptions.Item
                          key={key}
                          label={t(`table.${key}`)}
                          labelStyle={{
                            maxWidth: "120px !important",
                            margin: 0,
                            padding: 0,
                            textAlign: "center",
                          }}
                        >
                          {`${deposit[key]}`.replace(
                            /(\d{3})(\d{3})(\d{3})(\d{2})/,
                            "$1.$2.$3-$4"
                          )}
                        </Descriptions.Item>
                      );

                    default:
                      return;
                  }
                })}

              {currOption === "payer" &&
                Object.keys(deposit).map((key: string) => {
                  switch (key) {
                    case "payer_account":
                    case "payer_agency":
                    case "payer_bank":
                    case "payer_name":
                      return (
                        deposit[key] !== "N/A" && (
                          <Descriptions.Item
                            key={key}
                            label={t(`table.${key}`)}
                            labelStyle={{
                              maxWidth: "120px !important",
                              margin: 0,
                              padding: 0,
                              textAlign: "center",
                            }}
                          >
                            {deposit[key]}
                          </Descriptions.Item>
                        )
                      );

                    case "payer_document":
                      return (
                        <Descriptions.Item
                          key={key}
                          label={t(`table.${key}`)}
                          labelStyle={{
                            maxWidth: "120px !important",
                            margin: 0,
                            padding: 0,
                            textAlign: "center",
                          }}
                        >
                          {`${deposit[key]}`.replace(
                            /(\d{3})(\d{3})(\d{3})(\d{2})/,
                            "$1.$2.$3-$4"
                          )}
                        </Descriptions.Item>
                      );

                    default:
                      return;
                  }
                })}
            </Descriptions>
          </Grid>
        )}
      </Grid>
    </Drawer>
  );
};
