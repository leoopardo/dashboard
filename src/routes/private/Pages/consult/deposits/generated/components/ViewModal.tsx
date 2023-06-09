import { Descriptions, Drawer, Segmented, Spin } from "antd";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useGetDeposit } from "../../../../../../../services/generatedDeposits/getDeposit";
import { t } from "i18next";
import { Grid } from "@mui/material";

interface ViewModalProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  open: boolean;
  id: string;
}

export const ViewModal = (props: ViewModalProps) => {
  const onClose = () => {
    props.setOpen(false);
  };

  const { deposit, depositError, isDepositFetching } = useGetDeposit(props.id);

  console.log(deposit);

  return (
    <Drawer
      title={`${t("table.details")}: (${deposit?._id})`}
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
            options={["Transção", "Comprador", "Pagador"]}
          />
        </Grid>{" "}
        {isDepositFetching && <Spin />}{" "}
        {deposit && (
          <Grid xs={12}>
            <Descriptions
              bordered
              style={{ margin: 0, padding: 0 }}
              contentStyle={{ maxWidth: 50 }}
              layout="vertical"
              column={1}
            >
              {Object.keys(deposit).map((key: string, value) => {
                switch (key) {
                  case "createdAt":
                    return (
                      <Descriptions.Item key={key} label={t(`table.${key}`)}>
                        {`${new Date(
                          deposit[key]
                        ).toLocaleDateString()} ${new Date(
                          deposit[key]
                        ).toLocaleTimeString()}`}
                      </Descriptions.Item>
                    );
                  case "merchant_name":
                  case "partner_name":
                  case "reference_id":
                  case "endToEndId":
                  case "buyer_name":
                  case "buyer_document":
                  case "payer_name":
                  case "payer_document":
                  case "bank":
                    return (
                      <Descriptions.Item key={key} label={t(`table.${key}`)}>
                        {deposit[key]}
                      </Descriptions.Item>
                    );

                  default:
                    return <></>;
                }
              })}
            </Descriptions>
          </Grid>
        )}
      </Grid>
    </Drawer>
  );
};
