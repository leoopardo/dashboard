/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomTable } from "@src/components/CustomTable";
import { useGetMerchantBalance } from "@src/services/consult/merchant/balance/getMerchantBalance";
import { MerchantBalanceQuery } from "@src/services/types/consult/merchant/balance";
import { Col, Divider, Typography } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export const MerchantsBalance = ({
  query,
}: {
  query: any;
}) => {
  const { t } = useTranslation();

  const [custQuery, setQuery] = useState<MerchantBalanceQuery>(query);
  const { MerchantBalance, isMerchantBalanceFetching, refetchMerchantBalance } =
    useGetMerchantBalance({ ...query, page: 1, limit: 10 });

  useEffect(() => {
    refetchMerchantBalance();
  }, [query]);
  
  return (
    <Col span={24}>
      <Divider orientation="left" data-test-id="divider-1">
        <Typography.Title data-test-id="text-1" level={4}>
          {t("table.merchants_balance")}
        </Typography.Title>
      </Divider>
      <CustomTable
        data-test-id="merchants-balance-table"
        query={custQuery}
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
        label={["merchant_name", "balance_to_transactions"]}
        disableScrollToTop
        removePagination
      />
    </Col>
  );
};
