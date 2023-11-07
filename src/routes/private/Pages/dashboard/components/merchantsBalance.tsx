import { CustomTable } from "@src/components/CustomTable";
import { useGetMerchantBalance } from "@src/services/consult/merchant/balance/getMerchantBalance";
import { MerchantBalanceQuery } from "@src/services/types/consult/merchant/balance";
import { Col, Divider, Typography } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const MerchantsBalance = () => {
  const { t } = useTranslation();
  const INITIAL_QUERY: MerchantBalanceQuery = {
    page: 1,
    limit: 10,
  };
  const [query, setQuery] = useState<MerchantBalanceQuery>(INITIAL_QUERY);
  const { MerchantBalance, isMerchantBalanceFetching } =
    useGetMerchantBalance(query);
  return (
    <Col span={24}>
      <Divider orientation="left">
        <Typography.Title level={4}>
          {t("table.merchants_balance")}
        </Typography.Title>
      </Divider>
      <CustomTable
        query={query}
        setCurrentItem={() => {
          return;
        }}
        setQuery={setQuery}
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
        removePagination
      />
    </Col>
  );
};
