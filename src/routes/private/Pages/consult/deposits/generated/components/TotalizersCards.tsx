import { ReloadOutlined } from "@ant-design/icons";
import { useTheme } from "@src/contexts/ThemeContext";
import { getPercent } from "@src/utils/getPercent";
import { Button, Card, Col, Row, Statistic } from "antd";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import {
  generatedDepositTotal,
  generatedDepositTotalQuery,
} from "../../../../../../../services/types/consult/deposits/generatedDeposits.interface";
import { defaultTheme } from "../../../../../../../styles/defaultTheme";

interface TotalizersInterface {
  data: generatedDepositTotal | null | undefined;
  query: generatedDepositTotalQuery;
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
      style={{ marginBottom: 8 }}
    >
      {(props.query.status === "PAID" || !props.query.status) && (
        <Col
          style={{ maxWidth: "220px" }}
          xs={{ span: isMobile ? 11 : undefined }}
        >
          <Card bordered={false}>
            <Statistic
              loading={props.loading}
              title={
                <>
                  <>{t("table.paid")}</>:{" "}
                  <span style={{ fontSize: "12px" }}>
                    {props?.data?.paid_total || 0} /{" "}
                    {getPercent(
                      props?.data?.paid_total ?? 0,
                      props.data?.transactions_total ?? 0
                    )}
                  </span>
                </>
              }
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
      {(props.query.status === "REFUNDED" || !props.query.status) && (
        <Col
          span={1}
          style={{
            maxWidth: "220px",
            minWidth: !isMobile ? "200px" : undefined,
          }}
          xs={{ span: isMobile ? 11 : undefined }}
        >
          <Card bordered={false}>
            <Statistic
              loading={props.loading}
              title={
                <>
                  <>{t("table.refunded")}</>:{" "}
                  <span style={{ fontSize: "12px" }}>
                    {props?.data?.refund_total || 0} /{" "}
                    {getPercent(
                      props?.data?.refund_total ?? 0,
                      props.data?.transactions_total ?? 0
                    )}
                  </span>
                </>
              }
              value={new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(props?.data?.refund_value || 0)}
              precision={2}
              valueStyle={{
                color: defaultTheme.colors.success,
                fontSize: isMobile ? "12px" : "18px",
                wordBreak: "break-all",
              }}
            />
          </Card>
        </Col>
      )}

      {(props.query.status === "CANCELED" || !props.query.status) && (
        <Col
          style={{ maxWidth: "220px" }}
          xs={{ span: isMobile ? 11 : undefined }}
        >
          <Card bordered={false}>
            <Statistic
              loading={props.loading}
              title={
                <>
                  <>{t("table.canceled")}</>:{" "}
                  <span style={{ fontSize: "12px" }}>
                    {props?.data?.canceled_total || 0} /{" "}
                    {getPercent(
                      props?.data?.canceled_total ?? 0,
                      props.data?.transactions_total ?? 0
                    )}
                  </span>
                </>
              }
              value={new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(props?.data?.canceled_value || 0)}
              precision={2}
              valueStyle={{
                color: defaultTheme.colors.error,
                fontSize: isMobile ? "12px" : "18px",
                wordBreak: "break-all",
              }}
            />
          </Card>
        </Col>
      )}

      {(props.query.status === "EXPIRED" || !props.query.status) && (
        <Col
          style={{ maxWidth: "220px" }}
          xs={{ span: isMobile ? 11 : undefined }}
        >
          <Card bordered={false}>
            <Statistic
              loading={props.loading}
              title={
                <>
                  <>{t("table.expired")}</>:{" "}
                  <span style={{ fontSize: "12px" }}>
                    {props?.data?.expired_total || 0} /{" "}
                    {getPercent(
                      props?.data?.expired_total ?? 0,
                      props.data?.transactions_total ?? 0
                    )}
                  </span>
                </>
              }
              value={new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(props?.data?.expired_value || 0)}
              precision={2}
              valueStyle={{
                color: defaultTheme.colors.error,
                fontSize: isMobile ? "12px" : "18px",
                wordBreak: "break-all",
              }}
            />
          </Card>
        </Col>
      )}
      {(props.query.status === "WAITING" || !props.query.status) && (
        <Col
          style={{ maxWidth: "220px" }}
          xs={{ span: isMobile ? 11 : undefined }}
        >
          <Card bordered={false}>
            <Statistic
              loading={props.loading}
              title={
                <>
                  <>{t("table.waiting")}:</>{" "}
                  <span style={{ fontSize: "12px" }}>
                    {props?.data?.waiting_total || 0} /{" "}
                    {getPercent(
                      props?.data?.waiting_total ?? 0,
                      props.data?.transactions_total ?? 0
                    )}
                  </span>
                </>
              }
              value={new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(props?.data?.waiting_value || 0)}
              precision={2}
              valueStyle={{
                color: defaultTheme.colors.warnning,
                fontSize: isMobile ? "12px" : "18px",
                wordBreak: "break-all",
              }}
            />
          </Card>
        </Col>
      )}

      {(props.query.status === "AWAITING_REFUND" || !props.query.status) && (
        <Col
          style={{ maxWidth: "220px" }}
          xs={{ span: isMobile ? 11 : undefined }}
        >
          <Card bordered={false}>
            <Statistic
              loading={props.loading}
              title={
                <>
                  <>{t("table.waiting_refund")}</>:{" "}
                  <span style={{ fontSize: "12px" }}>
                    {props?.data?.awaiting_refund_total || 0} /{" "}
                    {getPercent(
                      props?.data?.awaiting_refund_total ?? 0,
                      props.data?.transactions_total ?? 0
                    )}
                  </span>
                </>
              }
              value={new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(props?.data?.awaiting_refund_value || 0)}
              precision={2}
              valueStyle={{
                color: defaultTheme.colors.warnning,
                fontSize: isMobile ? "12px" : "18px",
                wordBreak: "break-all",
              }}
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
        style={{ maxWidth: "200px", display: "flex", justifyContent: "center" }}
        xs={{ span: isMobile ? 11 : undefined }}
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
