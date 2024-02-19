/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Skeleton, Statistic } from "antd";
import { Grid } from "@mui/material";
import { defaultTheme } from "@src/styles/defaultTheme";
import { MerchantsQuery } from "@src/services/types/register/merchants/merchantsRegister.interface";
import { useGetMerchantsAccountTotals } from "@src/services/register/merchant/merchant/getMerchantsAccountTotals";

export const TotalizersAccounts = (props: {
  params: MerchantsQuery;
  loading: boolean;
}) => {
  const { MerchantAccountTotalsData } = useGetMerchantsAccountTotals({
    ...props.params,
  });

  return (
    <Grid
      container
      spacing={1}
      justifyContent={"center"}
      mb={1}
      style={{ overflow: "hidden", paddingBottom: 10, marginBottom: "70px" }}
    >
      {props?.loading && (
        <>
          <Grid
            container
            spacing={2}
            justifyContent="center"
            style={{ marginTop: "20px" }}
          >
            {[...Array(5)].map((_, index) => (
              <Grid item xs={12} md={2.4} key={index}>
                <Skeleton active />
              </Grid>
            ))}
          </Grid>
          <Grid
            container
            spacing={2}
            justifyContent="center"
            style={{ marginTop: "20px", marginBottom: "20px" }}
          >
            {[...Array(5)].map((_, index) => (
              <Grid item xs={12} md={2.4} key={index}>
                <Skeleton active />
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {!props?.loading &&
        MerchantAccountTotalsData?.items.slice(0, 10).map((item: any) => (
          <Grid item xs={12} md={2.4}>
            <Card bordered={false} style={{ minHeight: "133px" }}>
              <Statistic
                loading={props?.loading}
                title={item.name}
                style={{
                  maxWidth: 200,
                  height: 90,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
                value={item.totalMerchant}
                precision={0}
                valueStyle={{
                  color: defaultTheme.colors.info,
                  fontSize: "24px",
                }}
              />
            </Card>
          </Grid>
        ))}
    </Grid>
  );
};
