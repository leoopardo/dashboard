import { Descriptions, Drawer, QRCode, Segmented, Spin } from "antd";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useGetDeposit } from "../../../../../../../services/generatedDeposits/getDeposit";
import { t } from "i18next";
import { Grid } from "@mui/material";
import { StyledSegmented } from "./styles";
import Paybrokers from "../../../../../../../assets/logo.png";
import { useGetWithdraw } from "../../../../../../../services/generatedWithdrawals/getWithdraw";

interface ViewModalProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  open: boolean;
  id: string;
}

export const ViewModal = (props: ViewModalProps) => {
  const onClose = () => {
    props.setOpen(false);
  };

  const { withdraw, withdrawError, isWithdrawFetching } = useGetWithdraw(
    props.id
  );
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
          <StyledSegmented
            block
            size="middle"
            style={{ width: "100%" }}
            value={currOption}
            options={[
              { label: t("table.transaction"), value: "transaction" },
              { label: t("table.receiver"), value: "receiver" },
            ]}
            onChange={(value) => {
              setCurrOption(value);
            }}
          />
        </Grid>
        {isWithdrawFetching && (
          <Grid container>
            {" "}
            <Grid
              item
              xs={12}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <Spin />
            </Grid>
          </Grid>
        )}{" "}
        {withdraw && (
          <Grid xs={12}>
            <Descriptions bordered style={{ margin: 0, padding: 0 }} column={1}>
              {currOption === "transaction" &&
                Object.keys(withdraw).map((key: string, value) => {
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
                            withdraw[key]
                          ).toLocaleDateString()} ${new Date(
                            withdraw[key]
                          ).toLocaleTimeString()}`}
                        </Descriptions.Item>
                      );
                    case "_id":
                    case "merchant_name":
                    case "bank":
                    case "endToEndId":
                    case "reference_id":
                    case "description":
                    case "webhook_url":
                    case "receiver_name":
                    case "receiver_document":
                    case "webhook_url_optional":
                      return (
                        withdraw[key] !== "N/A" && (
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
                            {withdraw[key]}
                          </Descriptions.Item>
                        )
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
                          }).format(Number(withdraw[key]) || 0)}
                        </Descriptions.Item>
                      );

                    default:
                      return;
                  }
                })}
              {currOption === "receiver" &&
                Object.keys(withdraw).map((key: string, value) => {
                  switch (key) {
                    case "receiver_birth_date":
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
                            withdraw[key]
                          ).toLocaleDateString()} ${new Date(
                            withdraw[key]
                          ).toLocaleTimeString()}`}
                        </Descriptions.Item>
                      );
                    case "receiver_name":
                    case "receiver_document":
                    case "receiver_gender":
                    case "receiver_street":
                    case "receiver_number":
                    case "receiver_neighborhood":
                    case "receiver_city":
                    case "receiver_state":
                    case "receiver_zip_code":
                    case "receiver_bank_account":
                    case "receiver_bank_agency":
                      return (
                        withdraw[key] !== "N/A" && (
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
                            {withdraw[key]}
                          </Descriptions.Item>
                        )
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
