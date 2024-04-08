/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetTotalRefundWithdrawals } from "@src/services/consult/refund/refundWithdrawals/getTotal";
import { defaultTheme } from "@src/styles/defaultTheme";
import { moneyFormatter } from "@src/utils/moneyFormatter";
import { Card, Col, Divider, Row, Statistic } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface RefundWithdrawalCardProps {
  query: any;
}

export const RefundWithdrawalCard = ({ query }: RefundWithdrawalCardProps) => {
  const { t } = useTranslation();
  const {
    isRefundWithdrawalsTotalFetching,
    refetchRefundWithdrawalsTotal,
    refundWithdrawalsTotal,
  } = useGetTotalRefundWithdrawals(query);

  useEffect(() => {
    refetchRefundWithdrawalsTotal();
  }, [query]);

  return (
    <Card loading={isRefundWithdrawalsTotalFetching}>
      <Card.Meta
        title={`${t("menus.refund_withdrawals")}: ${
          refundWithdrawalsTotal?.transactions_total || 0
        }`}
      />
      <Row style={{ marginTop: 8 }}>
        <Divider style={{ margin: 8 }} dashed />
        <Col span={24}>
          <Statistic
            title={`${t("table.paid_to_merchant")}: ${
              refundWithdrawalsTotal?.paid_to_merchant_total || 0
            }`}
            value={moneyFormatter(
              refundWithdrawalsTotal?.paid_to_merchant_value || 0
            )}
            precision={2}
            valueStyle={{ color: defaultTheme.colors.success }}
          />
        </Col>
        <Col span={24}>
          <Statistic
            title={`${t("table.refunded")}: ${
              refundWithdrawalsTotal?.refunded_total || 0
            }`}
            value={moneyFormatter(refundWithdrawalsTotal?.refunded_value || 0)}
            precision={2}
            valueStyle={{ color: defaultTheme.colors.info }}
          />
        </Col>
        <Col span={24}>
          <Statistic
            title={`${t("table.refunded")}: ${
              refundWithdrawalsTotal?.error_total || 0
            }`}
            value={moneyFormatter(refundWithdrawalsTotal?.error_value || 0)}
            precision={2}
            valueStyle={{ color: defaultTheme.colors.error }}
          />
        </Col>
      </Row>
    </Card>
  );
};
