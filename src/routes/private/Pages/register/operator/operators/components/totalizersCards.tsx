import { Card, Statistic } from "antd";
import { Grid } from "@mui/material";
import { defaultTheme } from "@src/styles/defaultTheme";
import {
  OperatorQuery,
  OperatorsTotalResponse,
} from "@src/services/types/register/operators/operators.interface";
import { t } from "i18next";

export const TotalizersCards = (props: {
  params: OperatorQuery;
  data?: OperatorsTotalResponse;
  loading: boolean
}) => {
  return (
    <Grid container spacing={1} justifyContent={"center"} mb={2}>
      <Grid item xs={12} md="auto">
        <Card bordered={false}>
          <Statistic
            loading={props?.loading}
            title={t("titles.total_registred", {entity: t('menus.operators')?.toLowerCase()})}
            style={{ maxWidth: 200, minHeight: 75 }}
            value={props?.data?.registered_operators_totals}
            precision={0}
            valueStyle={{ color: defaultTheme.colors.info, fontSize: "24px" }}
          />
        </Card>
      </Grid>
      <Grid item xs={12} md="auto">
        <Card bordered={false}>
          <Statistic
            loading={props?.loading}
            title={t("titles.total_registred_active", {entity: t('menus.operators')?.toLowerCase()})}
            style={{ maxWidth: 200, minHeight: 75 }}
            value={props?.data?.active_operators_totals}
            precision={0}
            valueStyle={{
              color: defaultTheme.colors.success,
              fontSize: "24px",
            }}
          />
        </Card>
      </Grid>
      <Grid item xs={12} md="auto">
        <Card bordered={false}>
          <Statistic
            loading={props?.loading}
            title={t("titles.total_registred_inactive", {entity: t('menus.operators')?.toLowerCase()})}
            style={{ maxWidth: 200, minHeight: 75 }}
            value={props?.data?.inactive_operators_totals}
            precision={0}
            valueStyle={{
              color: defaultTheme.colors.warnning,
              fontSize: "24px",
            }}
          />
        </Card>
      </Grid>
      <Grid item xs={12} md="auto">
        <Card bordered={false}>
          <Statistic
            loading={props?.loading}
            title={t("titles.total", {entity: t('menus.merchants')?.toLowerCase()})}
            style={{ maxWidth: 200, minHeight: 75 }}
            value={props?.data?.linked_merchants_total}
            precision={0}
            valueStyle={{
              color: defaultTheme.colors.secondary,
              fontSize: "24px",
              marginTop: 27,
            }}
          />
        </Card>
      </Grid>
    </Grid>
  );
};
