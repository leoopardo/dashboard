/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomTable } from "@src/components/CustomTable";
import { useGetMerchantBalance } from "@src/services/consult/merchant/balance/getMerchantBalance";
import { MerchantBalanceQuery } from "@src/services/types/consult/merchant/balance";
import { Col, Divider, Typography } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export const MerchantsBalance = ({
  ref,
  refs,
  query,
}: {
  ref: any;
  refs: any[];
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
      <Divider orientation="left">
        <Typography.Title level={4} ref={ref}>
          {t("table.merchants_balance")}
        </Typography.Title>
      </Divider>
      <CustomTable
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
          { name: "merchant_name", type: "text", key: refs[0] },
          { name: "balance_to_transactions", type: "value", key: refs[1] },
          { name: "balance_to_payment", type: "value", key: refs[2] },
          { name: "balance_reserved", type: "value", key: refs[3] },
        ]}
        label={["merchant", "value"]}
        disableScrollToTop
        removePagination
      />
    </Col>
  );
};
