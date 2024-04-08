/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetTotalRefundDeposits } from "@src/services/consult/refund/refundDeposits/getTotal";
import { defaultTheme } from "@src/styles/defaultTheme";
import { moneyFormatter } from "@src/utils/moneyFormatter";
import { Card, Col, Divider, Row, Statistic } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface RefundDepositsCardProps {
  query: any;
}

export const RefundDepositsCard = ({ query }: RefundDepositsCardProps) => {
  const { t } = useTranslation();
  const {
    refundDepositsTotal,
    isRefundDepositsTotalFetching,
    refetchRefundDepositsTotal,
  } = useGetTotalRefundDeposits(query);

  useEffect(() => {
    refetchRefundDepositsTotal();
  }, [query]);

  return (
    <Card loading={isRefundDepositsTotalFetching}>
      <Card.Meta
        title={`${t("menus.refund_deposits")}: ${
          refundDepositsTotal?.transactions_total || 0
        }`}
      />
      <Row style={{ marginTop: 8 }}>
        <Divider style={{ margin: 8 }} dashed />
        <Col span={24}>
          <Statistic
            title={`${t("table.paid_to_merchant")}: ${
              refundDepositsTotal?.paid_to_merchant_total || 0
            }`}
            value={moneyFormatter(
              refundDepositsTotal?.paid_to_merchant_value || 0
            )}
            precision={2}
            valueStyle={{ color: defaultTheme.colors.success }}
          />
        </Col>
        <Col span={24}>
          <Divider style={{ margin: 8 }} />
          <Statistic
            title={`${t("table.refunded")}: ${
              refundDepositsTotal?.refunded_total || 0
            }`}
            value={moneyFormatter(refundDepositsTotal?.refunded_value || 0)}
            precision={2}
            valueStyle={{ color: defaultTheme.colors.info }}
          />
        </Col>
        <Col span={24}>
          <Divider style={{ margin: 8 }} />
          <Statistic
            title={`${t("table.error")}: ${
              refundDepositsTotal?.error_total || 0
            }`}
            value={moneyFormatter(refundDepositsTotal?.error_value || 0)}
            precision={2}
            valueStyle={{ color: defaultTheme.colors.error }}
          />
        </Col>
      </Row>
    </Card>
  );
};
