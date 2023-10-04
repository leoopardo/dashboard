/* eslint-disable @typescript-eslint/no-explicit-any */
import { Grid } from "@mui/material";
import { useGetRowsGeneratedDeposits } from "@src/services/consult/deposits/generatedDeposits/getRows";
import { useGetRefund } from "@src/services/consult/refund/refundDeposits/getRefund";
import { Descriptions, Drawer, Segmented, Spin } from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface ViewModalProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  open: boolean;
  item: any;
  type: "Refund" | "manual" | "withdraw";
}

export const ViewModal = (props: ViewModalProps) => {
  const { t } = useTranslation();
  const onClose = () => {
    props.setOpen(false);
  };

  const { Refund, isRefundFetching } = useGetRefund(props?.item?._id);
  const [currOption, setCurrOption] = useState<any>("transaction");
  const { depositsRows, refetchDepositsTotalRows } =
    useGetRowsGeneratedDeposits({
      initial_date: undefined,
      pix_id: props?.item?.pix_id,
    });

  useEffect(() => {
    refetchDepositsTotalRows();
  }, [Refund]);

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
          <Segmented
            block
            size="middle"
            style={{ width: "100%" }}
            value={currOption}
            options={[
              { label: t("table.transaction"), value: "transaction" },
              {
                label: t("table.origin_transaction"),
                value: "origin",
                disabled: !depositsRows?.items[0],
              },
            ]}
            onChange={(value: any) => {
              setCurrOption(value);
            }}
          />
        </Grid>{" "}
        {isRefundFetching && <Spin />}{" "}
        {props.type === "Refund" && Refund && (
          <Grid xs={12}>
            <Descriptions bordered style={{ margin: 0, padding: 0 }} column={1}>
              {currOption === "transaction" &&
                Object.keys(Refund).map((key: string) => {
                  switch (key) {
                    case "createdAt":
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
                    case "buyer_name":
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
            </Descriptions>
          </Grid>
        )}
        {depositsRows?.items[0] && (
          <Grid xs={12}>
            <Descriptions bordered style={{ margin: 0, padding: 0 }} column={1}>
              {currOption === "origin" &&
                Object.keys(depositsRows?.items[0]).map((key: string) => {
                  switch (key) {
                    case "createdAt":
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
                            depositsRows?.items[0][key]
                          ).toLocaleDateString()} ${new Date(
                            depositsRows?.items[0][key]
                          ).toLocaleTimeString()}`}
                        </Descriptions.Item>
                      );
                    case "_id":
                    case "merchant_name":
                    case "bank":
                    case "buyer_name":
                      return (
                        depositsRows?.items[0][key] !== "N/A" && (
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
                            {depositsRows?.items[0][key]}
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
                          {`${depositsRows?.items[0][key]}`.replace(
                            /(\d{3})(\d{3})(\d{3})(\d{2})/,
                            "$1.$2.$3-$4"
                          )}
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
                          }).format(Number(depositsRows?.items[0][key]) || 0)}
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
