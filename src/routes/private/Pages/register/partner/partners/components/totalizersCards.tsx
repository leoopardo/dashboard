import { Grid } from "@mui/material";
import {
  PartnerQuery,
  PartnerTotalResponse,
} from "@src/services/types/register/partners/partners.interface";
import { defaultTheme } from "@src/styles/defaultTheme";
import { Card, Statistic } from "antd";
import ReactECharts from "echarts-for-react";
import { t } from "i18next";

export const TotalizersCards = (props: {
  params: PartnerQuery;
  data?: PartnerTotalResponse;
  loading: boolean;
}) => {
  return (
    <Grid
      container
      spacing={1}
      justifyContent={"center"}
      mb={
        !props.data?.registered_partners_totals ||
        props.data?.registered_partners_totals === 0
          ? 10
          : 2
      }
    >
      {props.data?.registered_partners_totals &&
        props.data?.registered_partners_totals > 0 && (
          <Grid
            item
            xs={12}
            md={3}
            style={{
              marginTop: "-75px",
              marginBottom: "-60px",
              marginLeft: "-70px",
              marginRight: "-30px",
            }}
          >
            <ReactECharts
              option={{
                tooltip: {
                  trigger: "item",
                },
                legend: {
                  selectedMode: false,
                  show: false,
                },
                color: ["#91cc75", "#fac858"],

                series: [
                  {
                    name: t("menus.partners"),
                    type: "pie",
                    radius: ["40%", "70%"],
                    center: ["50%", "70%"],
                    // adjust the start angle
                    startAngle: 180,
                    label: {
                      show: false,
                    },
                    data: [
                      {
                        value: props?.data?.active_partners_totals,
                        name: t("table.active"),
                      },
                      {
                        value: props?.data?.inactive_partners_totals,
                        name: t("table.inactive"),
                      },
                      {
                        // make an record to fill the bottom 50%
                        value:
                          (props?.data?.active_partners_totals || 0) +
                          (props?.data?.inactive_partners_totals || 0),
                        itemStyle: {
                          top: "-20%",
                          color: "none",
                          decal: {
                            symbol: "none",
                          },
                        },
                        label: {
                          show: false,
                        },
                      },
                    ],
                  },
                ],
              }}
              opts={{ renderer: "svg" }}
              lazyUpdate
            />
          </Grid>
        )}

      <Grid item xs={12} md={3}>
        <Card bordered={false}>
          <Statistic
            loading={props?.loading}
            title={t("titles.total_registred", {
              entity: t("menus.partner")?.toLowerCase(),
            })}
            style={{
              maxWidth: 200,
              height: 90,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
            value={props?.data?.registered_partners_totals}
            precision={0}
            valueStyle={{ color: defaultTheme.colors.info, fontSize: "24px" }}
          />
        </Card>
      </Grid>
      <Grid item xs={12} md={ !props.data?.registered_partners_totals ||
        props.data?.registered_partners_totals === 0 ? 3 : 2}>
        <Card bordered={false}>
          <Statistic
            loading={props?.loading}
            title={t("titles.total_registred_active", {
              entity: t("menus.partner")?.toLowerCase(),
            })}
            style={{
              maxWidth: 200,
              height: 90,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
            value={props?.data?.active_partners_totals}
            precision={0}
            valueStyle={{
              color: defaultTheme.colors.success,
              fontSize: "24px",
            }}
          />
        </Card>
      </Grid>
      <Grid item xs={12} md={!props.data?.registered_partners_totals ||
        props.data?.registered_partners_totals === 0 ? 3 : 2}>
        <Card bordered={false}>
          <Statistic
            loading={props?.loading}
            title={t("titles.total_registred_inactive", {
              entity: t("menus.partner")?.toLowerCase(),
            })}
            style={{
              maxWidth: 200,
              height: 90,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
            value={props?.data?.inactive_partners_totals}
            precision={0}
            valueStyle={{
              color: defaultTheme.colors.warnning,
              fontSize: "24px",
            }}
          />
        </Card>
      </Grid>
      <Grid item xs={12} md={!props.data?.registered_partners_totals ||
        props.data?.registered_partners_totals === 0 ? 3 : 2}>
        <Card bordered={false}>
          <Statistic
            loading={props?.loading}
            title={t("titles.total", {
              entity: t("menus.merchants")?.toLowerCase(),
            })}
            style={{
              maxWidth: 200,
              height: 90,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
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
