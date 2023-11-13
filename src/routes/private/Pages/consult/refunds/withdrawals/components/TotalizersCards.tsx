import { ReloadOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Statistic } from "antd";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import {
  refundDepositTotal,
  refundDepositsQuery,
} from "../../../../../../../services/types/consult/refunds/refundsDeposits.interface";
import { defaultTheme } from "../../../../../../../styles/defaultTheme";
import { useTheme } from "@src/contexts/ThemeContext";
import { getPercent } from "@src/utils/getPercent";

interface TotalizersInterface {
  data: refundDepositTotal | null | undefined;
  query: refundDepositsQuery;
  loading: boolean;
  fetchData: () => void;
}

export const TotalizersCards = (props: TotalizersInterface) => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery({ maxWidth: "900px" });
  const { theme } = useTheme();

  return (
    <Row
      gutter={[8, 8]}
      align="middle"
      justify="center"
      style={{ width: "100%" }}
    >
      {(props.query.status === "PAID_TO_MERCHANT" || !props.query.status) && (
        <Col
          style={{ maxWidth: "220px" }}
          xs={{ span: isMobile ? 10 : undefined }}
        >
          <Card
            bordered={false}
            style={{ height: isMobile ? "100px" : "120px" }}
          >
            <Statistic
              loading={props.loading}
              title={
                <>
                  <>{t("table.paid_to_merchant")}</>:{" "}
                  <span style={{ fontSize: "12px" }}>
                    {props?.data?.paid_to_merchant_total || 0} /{" "}
                    {getPercent(
                      props?.data?.paid_to_merchant_total ?? 0,
                      props.data?.transactions_total ?? 0
                    )}
                  </span>
                </>
              }
              value={new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(props?.data?.paid_to_merchant_value || 0)}
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

      {(props.query.status === "PROCESSING" || !props.query.status) && (
        <Col
          style={{ maxWidth: "220px" }}
          xs={{ span: isMobile ? 10 : undefined }}
        >
          <Card
            bordered={false}
            style={{ height: isMobile ? "100px" : "120px" }}
          >
            <Statistic
              loading={props.loading}
              title={
                <>
                  <>{t("table.processing")}</>:{" "}
                  <span style={{ fontSize: "12px" }}>
                    {props?.data?.processing_total || 0} /{" "}
                    {getPercent(
                      props?.data?.processing_total ?? 0,
                      props.data?.transactions_total ?? 0
                    )}
                  </span>
                </>
              }
              value={new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(props?.data?.processing_value || 0)}
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
          xs={{ span: isMobile ? 10 : undefined }}
        >
          <Card
            bordered={false}
            style={{ height: isMobile ? "100px" : "120px" }}
          >
            <Statistic
              loading={props.loading}
              title={
                <>
                  <>{t("table.waiting")}</>:{" "}
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

      <Col
        style={{ maxWidth: "220px" }}
        xs={{ span: isMobile ? 10 : undefined }}
      >
        <Card bordered={false} style={{ height: isMobile ? "100px" : "120px" }}>
          <Statistic
            loading={props.loading}
            title={<>
              {`Total: ${props?.data?.transactions_total || 0}`}{" "}
              <Button
                style={{ marginTop: "-10px" }}
                loading={props.loading}
                type="link"
                onClick={props.fetchData}
              >
                {!props.loading && <ReloadOutlined />}
              </Button>
            </>}
            value={new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(props?.data?.transactions_value || 0)}
            precision={2}
            valueStyle={{
              color: theme === "dark" ? "#fff" : defaultTheme.colors.dark,
              fontSize: isMobile ? "12px" : "18px",
              wordBreak: "break-all",
            }}
          />
        </Card>
      </Col>
      
    </Row>
  );
};
