import { ReloadOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Statistic } from "antd";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import {
  paidDepositRowsQuery,
  paidDepositTotal,
} from "../../../../../../../services/types/consult/deposits/PaidDeposits.interface";
import { defaultTheme } from "../../../../../../../styles/defaultTheme";
import { useTheme } from "@src/contexts/ThemeContext";

interface TotalizersInterface {
  data: paidDepositTotal | null | undefined;
  query: paidDepositRowsQuery;
  loading: boolean;
  fetchData: () => void;
}

export const TotalizersCards = (props: TotalizersInterface) => {
  const isMobile = useMediaQuery({ maxWidth: "900px" });
  const { t } = useTranslation();
  const { theme } = useTheme();
  return (
    <Row
      gutter={[8, 8]}
      justify="center"
      align="middle"
      style={{ width: "100%", marginBottom: 8 }}
    >
      {(props.query.status === "PAID" || !props.query.status) && (
        <Col
          style={{ maxWidth: "220px" }}
          xs={{ span: isMobile ? 11 : undefined }}
        >
          <Card bordered={false}>
            <Statistic
              loading={props.loading}
              title={`${t("table.paid")}: ${props?.data?.paid_total || 0}`}
              value={new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(props?.data?.paid_value || 0)}
              precision={2}
              valueStyle={{
                color: defaultTheme.colors.success,
                fontSize: isMobile ? "12px" : "18px",
                wordBreak: "break-all",
              }}
              suffix=""
            />
          </Card>
        </Col>
      )}
      <Col
        style={{ maxWidth: "220px" }}
        xs={{ span: isMobile ? 11 : undefined }}
      >
        <Card bordered={false}>
          <Statistic
            loading={props.loading}
            title={`Total: ${props?.data?.transactions_total || 0}`}
            value={new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(props?.data?.transaction_value || 0)}
            precision={2}
            valueStyle={{
              color: theme === "dark" ? "#fff" : defaultTheme.colors.dark,
              fontSize: isMobile ? "12px" : "18px",
              wordBreak: "break-all",
            }}
          />
        </Card>
      </Col>
      <Col
        style={{ maxWidth: "220px", display: "flex", justifyContent: "center" }}
        xs={{ span: isMobile ? 24 : undefined }}
      >
        <Button
          shape="circle"
          style={{ width: "50px", height: "50px" }}
          loading={props.loading}
          type="dashed"
          onClick={props.fetchData}
        >
          {!props.loading && <ReloadOutlined />}
        </Button>
      </Col>
    </Row>
  );
};
