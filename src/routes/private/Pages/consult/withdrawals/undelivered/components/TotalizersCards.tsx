import { ReloadOutlined } from "@ant-design/icons";
import { useTheme } from "@src/contexts/ThemeContext";
import { getPercent } from "@src/utils/getPercent";
import { Button, Card, Col, Row, Statistic } from "antd";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import {
  generatedWithdrawalsRowsQuery,
  generatedWithdrawalsTotal,
} from "../../../../../../../services/types/consult/withdrawals/generatedWithdrawals.interface";
import { defaultTheme } from "../../../../../../../styles/defaultTheme";
import { moneyFormatter } from "@src/utils/moneyFormatter";

interface TotalizersInterface {
  data: generatedWithdrawalsTotal | null | undefined;
  query: generatedWithdrawalsRowsQuery;
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
      {(props.query.status === "PAID" || !props.query.status) && (
        <Col
          style={{ maxWidth: "220px" }}
          xs={{ span: isMobile ? 10 : undefined }}
        >
          <Card
            bordered={false}
            style={{ height: isMobile ? "100%" : undefined }}
          >
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
              value={moneyFormatter(props?.data?.paid_value || 0)}
              precision={2}
              valueStyle={{
                color: defaultTheme.colors.success,
                fontSize: isMobile ? "12px" : "18px",
                wordBreak: "break-all",
              }}
              suffix=""style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: isMobile ? undefined : "75px",
              }}
            />
          </Card>
        </Col>
      )}
      {(props.query.status === "REFUNDED_WITHDRAW" || !props.query.status) && (
        <Col
          style={{ maxWidth: "220px" }}
          xs={{ span: isMobile ? 10 : undefined }}
        >
          <Card
            bordered={false}
            style={{ height: isMobile ? "100%" : undefined }}
          >
            <Statistic
              loading={props.loading}
              title={
                <>
                  <>{t("table.refunded")}</>:{" "}
                  <span style={{ fontSize: "12px" }}>
                    {props?.data?.withdraw_refunded_total || 0} /{" "}
                    {getPercent(
                      props?.data?.withdraw_refunded_total ?? 0,
                      props.data?.transactions_total ?? 0
                    )}
                  </span>
                </>
              }
              value={moneyFormatter(props?.data?.withdraw_refunded_value || 0)}
              precision={2}
              valueStyle={{
                color: defaultTheme.colors.success,
                fontSize: isMobile ? "12px" : "18px",
                wordBreak: "break-all",
              }}style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: isMobile ? undefined : "75px",
              }}
            />
          </Card>
        </Col>
      )}

      {(props.query.status === "CANCELED" || !props.query.status) && (
        <Col
          style={{ maxWidth: "220px" }}
          xs={{ span: isMobile ? 10 : undefined }}
        >
          <Card
            bordered={false}
            style={{ height: isMobile ? "100%" : undefined }}
          >
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
              value={moneyFormatter(props?.data?.canceled_value || 0)}
              precision={2}
              valueStyle={{
                color: defaultTheme.colors.error,
                fontSize: isMobile ? "12px" : "18px",
                wordBreak: "break-all",
              }}style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: isMobile ? undefined : "75px",
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
            style={{ height: isMobile ? "100%" : undefined }}
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
              value={moneyFormatter(props?.data?.processing_value || 0)}
              precision={2}
              valueStyle={{
                color: defaultTheme.colors.warnning,
                fontSize: isMobile ? "12px" : "18px",
                wordBreak: "break-all",
              }}style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: isMobile ? undefined : "75px",
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
            style={{ height: isMobile ? "100%" : undefined }}
          >
            <Statistic
              loading={props.loading}
              title={
                <>
                  <>{t("table.waiting")}</>:{" "}
                  <span style={{ fontSize: "12px" }}>
                    {props?.data?.pending_total || 0} /{" "}
                    {getPercent(
                      props?.data?.pending_total ?? 0,
                      props.data?.transactions_total ?? 0
                    )}
                  </span>
                </>
              }
              value={moneyFormatter(props?.data?.pending_value || 0)}
              precision={2}
              valueStyle={{
                color: defaultTheme.colors.warnning,
                fontSize: isMobile ? "12px" : "18px",
                wordBreak: "break-all",
              }}style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: isMobile ? undefined : "75px",
              }}
            />
          </Card>
        </Col>
      )}

      {(props.query.status === "IN_ANALYSIS" || !props.query.status) && (
        <Col
          style={{ maxWidth: "220px" }}
          xs={{ span: isMobile ? 10 : undefined }}
        >
          <Card
            bordered={false}
            style={{ height: isMobile ? "100%" : undefined }}
          >
            <Statistic
              loading={props.loading}
              title={
                <>
                  <>{t("table.in_analysis")}</>:{" "}
                  <span style={{ fontSize: "12px" }}>
                    {props?.data?.in_analysis_total || 0} /{" "}
                    {getPercent(
                      props?.data?.in_analysis_total ?? 0,
                      props.data?.transactions_total ?? 0
                    )}
                  </span>
                </>
              }
              value={moneyFormatter(props?.data?.in_analysis_value || 0)}
              precision={2}
              valueStyle={{
                color: defaultTheme.colors.warnning,
                fontSize: isMobile ? "12px" : "18px",
                wordBreak: "break-all",
              }}style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: isMobile ? undefined : "75px",
              }}
            />
          </Card>
        </Col>
      )}
      {(props.query.status === "CREATED" || !props.query.status) && (
        <Col
          style={{ maxWidth: "220px" }}
          xs={{ span: isMobile ? 10 : undefined }}
        >
          <Card bordered={false}>
            <Statistic
              loading={props.loading}
              title={
                <>
                  <>{t("table.created")}</>:{" "}
                  <span style={{ fontSize: "12px" }}>
                    {props?.data?.created_total || 0} /{" "}
                    {getPercent(
                      props?.data?.created_total ?? 0,
                      props.data?.transactions_total ?? 0
                    )}
                  </span>
                </>
              }
              value={moneyFormatter(props?.data?.created_value || 0)}
              precision={2}
              valueStyle={{
                color: defaultTheme.colors.info,
                fontSize: isMobile ? "12px" : "18px",
                wordBreak: "break-all",
              }}style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: isMobile ? undefined : "75px",
              }}
            />
          </Card>
        </Col>
      )}

      <Col
        style={{ maxWidth: "220px" }}
        xs={{ span: isMobile ? 10 : undefined }}
      >
        <Card bordered={false}>
          <Statistic
            loading={props.loading}
            title={<>
              {`Total: ${props?.data?.transactions_total || 0}`}{" "}
              <Button
                style={{ marginTop: "-10px"}}
                loading={props.loading}
                type="link"
                onClick={props.fetchData}
              >
                {!props.loading && <ReloadOutlined />}
              </Button>
            </>}
            value={moneyFormatter(props?.data?.transaction_value || 0)}
            precision={2}
            valueStyle={{
              color: theme === "dark" ? "#fff" : defaultTheme.colors.dark,
              fontSize: isMobile ? "12px" : "18px",
              wordBreak: "break-all",
            }}style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: isMobile ? undefined : "75px",
            }}
          />
        </Card>
      </Col>
     
    </Row>
  );
};
