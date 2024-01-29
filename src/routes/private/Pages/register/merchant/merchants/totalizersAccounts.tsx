import { Card, Statistic } from "antd";
import { Grid } from "@mui/material";
import { defaultTheme } from "@src/styles/defaultTheme";
import { MerchantsQuery } from "@src/services/types/register/merchants/merchantsRegister.interface";
import { t } from "i18next";
import { useMediaQuery } from "react-responsive";
import { useGetMerchantsAccountTotals } from "@src/services/register/merchant/merchant/getMerchantsAccountTotals";

export const TotalizersAccounts = (props: {
  params: MerchantsQuery;
  loading: boolean;
}) => {
  const isMobile = useMediaQuery({ maxWidth: "950px" });

  const { MerchantAccountTotalsData } = useGetMerchantsAccountTotals({
    ...props.params,
    locked: false,
  });

  return (
    <Grid
      container
      spacing={1}
      justifyContent={"center"}
      mb={1}
      style={{ overflow: "hidden", paddingBottom: 10, marginBottom: -10 }}
    >
      {MerchantAccountTotalsData?.items.map((item: any) => (
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
              valueStyle={{ color: defaultTheme.colors.info, fontSize: "24px" }}
            />
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
