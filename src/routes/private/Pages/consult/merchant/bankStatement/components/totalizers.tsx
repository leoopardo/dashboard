/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import Icon, { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import type { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { Grid } from "@mui/material";
import { useGetMerchantBankStatementTotals } from "@src/services/consult/merchant/bankStatement/getTotals";
import { MerchantBankStatementTotalsQuery } from "@src/services/types/consult/merchant/bankStatement";
import { defaultTheme } from "@src/styles/defaultTheme";
import { moneyFormatter } from "@src/utils/moneyFormatter";
import { Divider, Statistic, Typography } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface TotalizersInterface {
  query: MerchantBankStatementTotalsQuery;
}

export const Totalizers = ({ query }: TotalizersInterface) => {
  const { t } = useTranslation();
  const {
    MerchantBankStatementTotals,
    isMerchantBankStatementTotalsFetching,
    refetchMerchantBankStatementTotalsTotal,
  } = useGetMerchantBankStatementTotals(query);

  const MoneyIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={() => <AttachMoneyIcon />} {...props} />
  );

  useEffect(() => {
    refetchMerchantBankStatementTotalsTotal();
  }, [query]);

  return (
    <Grid container>
      <Grid
        container
        item
        xs={12}
        md={2}
        style={{
          marginTop: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Statistic
          style={{ textAlign: "center" }}
          title="Resultado do período"
          value={moneyFormatter(MerchantBankStatementTotals?.result_total ?? 0)}
          precision={2}
          valueStyle={{ color: defaultTheme.colors.secondary }}
        />
      </Grid>
      <Grid container item xs={12} md={10}>
        <Grid container>
          <Grid
            container
            item
            xs={12}
            style={{ height: "5px", marginBottom: "40px" }}
          >
            <Divider />
          </Grid>
        </Grid>
        <Grid
          container
          item
          xs={12}
          spacing={2}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingLeft: "3%",
            paddingRight: "3%",
          }}
        >
          <Grid
            item
            xs={12}
            md={1}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ArrowUpOutlined style={{ marginRight: "-5px" }} />
                <MoneyIcon />
              </div>
              {t("table.in")}
            </Typography>
          </Grid>
          {MerchantBankStatementTotals &&
            Object.keys(MerchantBankStatementTotals).map((key) => {
              switch (key) {
                case "number_in":
                  return (
                    <Grid item md={2} xs={6}>
                      <Statistic
                        loading={isMerchantBankStatementTotalsFetching}
                        title={t("table.number_in")}
                        value={MerchantBankStatementTotals[key]}
                        precision={0}
                        valueStyle={{
                          color: defaultTheme.colors.paid,
                          fontSize: "16px",
                        }}
                        prefix={<ArrowUpOutlined />}
                        valueRender={(node: any) => <>{node.props.value}</>}
                      />
                    </Grid>
                  );
                case "value_in":
                case "fee_in":
                case "average_ticket_in":
                  return (
                    <Grid item md={2} xs={6}>
                      <Statistic
                        loading={isMerchantBankStatementTotalsFetching}
                        title={t(`table.${key}`)}
                        value={moneyFormatter(
                          MerchantBankStatementTotals[key] || 0
                        )}
                        precision={2}
                        valueStyle={{
                          color: defaultTheme.colors.paid,
                          fontSize: "16px",
                        }}
                        prefix={<ArrowUpOutlined />}
                      />
                    </Grid>
                  );

                default:
                  return;
              }
            })}
        </Grid>
        <Grid container>
          <Grid container item xs={12} style={{ height: "5px" }}>
            <Divider />
          </Grid>
        </Grid>
        <Grid
          container
          item
          xs={12}
          spacing={2}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "25px",
            paddingLeft: "3%",
            paddingRight: "3%",
          }}
        >
          <Grid
            item
            xs={12}
            md={1}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ArrowDownOutlined style={{ marginRight: "-5px" }} />
                <MoneyIcon />
              </div>
              {t("table.out")}
            </Typography>
          </Grid>
          {MerchantBankStatementTotals &&
            Object.keys(MerchantBankStatementTotals).map((key) => {
              switch (key) {
                case "number_out":
                  return (
                    <Grid item md={2} xs={6}>
                      <Statistic
                        loading={isMerchantBankStatementTotalsFetching}
                        title={t("table.number_out")}
                        value={MerchantBankStatementTotals[key]}
                        precision={0}
                        valueStyle={{
                          color: defaultTheme.colors.error,
                          fontSize: "16px",
                        }}
                        prefix={<ArrowDownOutlined />}
                        valueRender={(node: any) => <>{node.props.value}</>}
                      />
                    </Grid>
                  );
                case "value_out":
                case "fee_out":
                case "average_ticket_out":
                  return (
                    <Grid item md={2} xs={6}>
                      <Statistic
                        loading={isMerchantBankStatementTotalsFetching}
                        title={t(`table.${key}`)}
                        value={moneyFormatter(
                          MerchantBankStatementTotals[key] || 0
                        )}
                        precision={2}
                        valueStyle={{
                          color: defaultTheme.colors.error,
                          fontSize: "16px",
                        }}
                        prefix={<ArrowDownOutlined />}
                      />
                    </Grid>
                  );

                default:
                  return;
              }
            })}
        </Grid>
      </Grid>
    </Grid>
  );
};
