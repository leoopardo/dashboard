import { CustomTable } from "@src/components/CustomTable";
import { useGetMerchantBalance } from "@src/services/consult/merchant/balance/getMerchantBalance";
import { Col, Divider, Typography } from "antd";
import { useTranslation } from "react-i18next";

export const MerchantsBalance = () => {
  const { t } = useTranslation();
  const { MerchantBalance, isMerchantBalanceFetching } = useGetMerchantBalance({ limit: 25, page: 1 });

  return (
    <Col span={24}>
      <Divider orientation="left">
        <Typography.Title level={4}>
          {t("table.merchants_balance")}
        </Typography.Title>
      </Divider>
      <CustomTable
        query={{}}
        setCurrentItem={() => {
          return;
        }}
        setQuery={() => {
          return;
        }}
        actions={[]}
        data={MerchantBalance}
        loading={isMerchantBalanceFetching}
        items={MerchantBalance?.items}
        error={false}
        columns={[
          { name: "merchant_name", type: "text" },
          { name: "balance_to_transactions", type: "value" },
          { name: "balance_to_payment", type: "value" },
          { name: "balance_reserved", type: "value" },
        ]}
        label={["merchant", "value"]}
        disableScrollToTop
      />
    </Col>
  );
};
