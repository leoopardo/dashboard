import { ReloadOutlined } from "@ant-design/icons";
import { Grid } from "@mui/material";
import { Button, Card, Statistic } from "antd";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import {
  paidWithdrawalsRowsQuery,
  paidWithdrawalsTotal,
} from "../../../../../../../services/types/consult/withdrawals/paidWithdrawals.interface";
import { defaultTheme } from "../../../../../../../styles/defaultTheme";

interface TotalizersInterface {
  data: paidWithdrawalsTotal | null | undefined;
  query: paidWithdrawalsRowsQuery;
  loading: boolean;
  fetchData: () => void;
}

export const TotalizersCards = (props: TotalizersInterface) => {
  const { t } = useTranslation();
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
