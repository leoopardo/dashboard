/* eslint-disable @typescript-eslint/no-explicit-any */
import { Grid } from "@mui/material";
import { useGetRowsGeneratedDeposits } from "@src/services/consult/deposits/generatedDeposits/getRows";
import { useGetRefund } from "@src/services/consult/refund/refundDeposits/getRefund";
import { Descriptions, Drawer, QRCode, Spin } from "antd";
import { Dispatch, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyledSegmented } from "../deposits/components/styles";

interface ViewModalProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  open: boolean;
  item: any;
}

export const ViewModal = (props: ViewModalProps) => {
  const { t } = useTranslation();
  const onClose = () => {
    props.setOpen(false);
  };

  const { Refund, isRefundFetching } = useGetRefund(props?.item?._id);
  const [currOption, setCurrOption] = useState<any>("transaction");
  const { RefundsRows } = useGetRowsGeneratedDeposits({
    pix_id: props?.item?.endToEndId,
  });

  console.log(RefundsRows);

  return (
    <Drawer
      title={`${t("table.details")}: (${props?.item?._id || "-"})`}
      placement="right"
      onClose={onClose}
      open={props.open}
      bodyStyle={{ padding: 0 }}
    >
      <Grid container>
        <Grid item xs={12}>
          <StyledSegmented
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
                disabled: Refund?.status !== "PAID",
              },
            ]}
            onChange={(value) => {
              setCurrOption(value);
            }}
          />
        </Grid>{" "}
        {isRefundFetching && <Spin />}{" "}
        {Refund && (
          <Grid xs={12}>
            <Descriptions bordered style={{ margin: 0, padding: 0 }} column={1}>
              {currOption === "transaction" &&
                Object.keys(Refund).map((key: string) => {
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
                            Refund[key]
                          ).toLocaleDateString()} ${new Date(
                            Refund[key]
                          ).toLocaleTimeString()}`}
                        </Descriptions.Item>
                      );
                    case "_id":
                    case "merchant_name":
                    case "bank":
                    case "txid":
                    case "endToEndId":
                    case "reference_id":
                    case "description":
                    case "webhook_url":
                    case "buyer_name":
                    case "payer_name":
                    case "webhook_url_optional":
                      return (
                        Refund[key] !== "N/A" && (
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
                            {Refund[key]}
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
                          {`${Refund[key]}`.replace(
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
                          <QRCode value={Refund[key] || "-"} type="canvas" />
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
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(Number(Refund[key]) || 0)}
                        </Descriptions.Item>
                      );

                    default:
                      return;
                  }
                })}
              {currOption === "buyer" &&
                Object.keys(Refund).map((key: string) => {
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
                            Refund[key]
                          ).toLocaleDateString()} ${new Date(
                            Refund[key]
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
                        Refund[key] !== "N/A" && (
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
                            {Refund[key]}
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
                          {`${Refund[key]}`.replace(
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
                Object.keys(Refund).map((key: string) => {
                  switch (key) {
                    case "payer_account":
                    case "payer_agency":
                    case "payer_bank":
                    case "payer_name":
                      return (
                        Refund[key] !== "N/A" && (
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
                            {Refund[key]}
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
                          {`${Refund[key]}`.replace(
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
