import React from "react";
import { Grid } from "@mui/material";
import { Button, Card, Statistic } from "antd";
import { defaultTheme } from "../../../../../../../styles/defaultTheme";
import { useMediaQuery } from "react-responsive";
import { ReloadOutlined } from "@ant-design/icons";
import { t } from "i18next";
import {
  paidWithdrawalsRowsQuery, paidWithdrawalsTotal,
} from "../../../../../../../services/types/paidWithdrawals.interface";

interface TotalizersInterface {
  data: paidWithdrawalsTotal | null | undefined;
  query: paidWithdrawalsRowsQuery;
  loading: boolean;
  fetchData: () => void;
}

export const TotalizersCards = (props: TotalizersInterface) => {
  const isMobile = useMediaQuery({ maxWidth: "900px" });
  return (
    <Grid
      container
      spacing={1}
      style={{ display: "flex", justifyContent: "center" }}
    >
      {(props.query.status === "PAID" || !props.query.status) && (
        <Grid item xs={6} md={4} lg={"auto"}>
          <Card
            bordered={false}
            style={{ height: isMobile ? "100%" : undefined }}
          >
            <Statistic
              loading={props.loading}
              title={`${t("table.paid")}: ${props?.data?.paid_total || 0}`}
              value={new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(props?.data?.paid_value || 0)}
              precision={2}
              valueStyle={{
                color: defaultTheme.colors.success,
                fontSize: isMobile ? "12px" : "18px",
                wordBreak: "break-all",
              }}
              suffix=""
            />
          </Card>
        </Grid>
      )}

      <Grid item xs={6} md={4} lg={"auto"}>
        <Card bordered={false}>
          <Statistic
            loading={props.loading}
            title={`Total: ${props?.data?.transactions_total || 0}`}
            value={new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(props?.data?.transaction_value || 0)}
            precision={2}
            valueStyle={{
              color: defaultTheme.colors.dark,
              fontSize: isMobile ? "12px" : "18px",
              wordBreak: "break-all",
            }}
          />
        </Card>
      </Grid>
      <Grid item xs={2} md={1} lg={1}>
        <Button
          shape="circle"
          style={{ width: "50px", height: "50px" }}
          loading={props.loading}
          type="dashed"
          onClick={props.fetchData}
        >
          {!props.loading && <ReloadOutlined />}
        </Button>
      </Grid>
    </Grid>
  );
};
