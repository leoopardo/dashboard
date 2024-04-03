import { FilterOutlined, ReloadOutlined } from "@ant-design/icons";
import { useTheme } from "@src/contexts/ThemeContext";
import { getPercent } from "@src/utils/getPercent";
import { moneyFormatter } from "@src/utils/moneyFormatter";
import { Button, Card, Col, Row, Statistic } from "antd";
import { Dispatch, SetStateAction } from "react";
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
  setIsFiltersOpen: Dispatch<SetStateAction<boolean>>;
}

export const TotalizersCards = (props: TotalizersInterface) => {
  const isMobile = useMediaQuery({ maxWidth: "1250px" });
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <Row
      gutter={[8, 8]}
      justify="center"
      style={{ height: "100%", paddingBottom: 16 }}
    >
      <Row
        style={{ width: "100%", flexWrap: "wrap-reverse" }}
        align="middle"
        gutter={[8, 8]}
      >
        <Col
          xs={{ span: 24 }}
          md={{ span: 18 }}
          lg={{ span: 20 }}
          style={{ paddingLeft: 16 }}
        >
          <Statistic
            loading={props.loading}
            title={
              <div style={{fontSize: 16}}>
                <>Total</>:{" "}
                <span style={{ fontSize: 16}}>
                  {props?.data?.transactions_total || 0}
                </span>
              </div>
            }
            value={moneyFormatter(props?.data?.transaction_value || 0)}
            precision={2}
            valueStyle={{
              fontSize: isMobile ? "24px" : "28px",
              wordBreak: "break-all",
              fontWeight: "bold",
            }}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: isMobile ? undefined : "75px",
            }}
            suffix=""
          />
        </Col>
        <Col xs={{ span: 24 }} md={{ span: 4 }} lg={{ span: 3 }}>
          <Button
            size="large"
            style={{ width: "100%" }}
            type="default"
            onClick={() => props.setIsFiltersOpen(true)}
            icon={<FilterOutlined />}
          >
            {t("table.filters")}
          </Button>
        </Col>
        <Col xs={{ span: 24 }} md={{ span: 2 }} lg={{ span: 1 }}>
          <Button
            size="large"
            style={{ width: "100%" }}
            type="default"
            onClick={() => props.fetchData()}
            icon={<ReloadOutlined />}
            loading={props.loading}
          />
        </Col>
      </Row>

      <Col xs={11} md={12} lg={isMobile ? 8 : 4}>
        <Card
          bordered
          style={{
            height: isMobile ? undefined : "120px",
            border:
              theme === "light" ? "1px solid #DCDFE7" : "1px solid #3b3b3b",
          }}
        >
          <Statistic
            loading={props.loading}
            title={
              <>
                <>{t("table.paid")}</>:{" "}
                {props.query.status === "PAID" || !props.query.status ? (
                  <span style={{ fontSize: "12px" }}>
                    {props?.data?.paid_total || 0} /{" "}
                    {getPercent(
                      props?.data?.paid_total ?? 0,
                      props.data?.transactions_total ?? 0
                    )}
                  </span>
                ) : (
                  "-"
                )}
              </>
            }
            value={
              props.query.status === "PAID" || !props.query.status
                ? moneyFormatter(props?.data?.paid_value || 0)
                : "-"
            }
            precision={2}
            valueStyle={{
              color: defaultTheme.colors.success,
              fontSize: isMobile ? "12px" : "18px",
              wordBreak: "break-all",
            }}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: isMobile ? undefined : "75px",
            }}
            suffix=""
          />
        </Card>
      </Col>

      <Col span={1} xs={12} md={12} lg={isMobile ? 8 : 4}>
        <Card
          bordered
          style={{
            height: isMobile ? undefined : "120px",
            border:
              theme === "light" ? "1px solid #DCDFE7" : "1px solid #3b3b3b",
          }}
        >
          <Statistic
            loading={props.loading}
            title={
              <>
                <>{t("table.refunded")}</>:{" "}
                {props.query.status === "REFUNDED" || !props.query.status ? (
                  <span style={{ fontSize: "12px" }}>
                    {props?.data?.refund_total || 0} /{" "}
                    {getPercent(
                      props?.data?.refund_total ?? 0,
                      props.data?.transactions_total ?? 0
                    )}
                  </span>
                ) : (
                  "-"
                )}
              </>
            }
            value={
              props.query.status === "REFUNDED" || !props.query.status
                ? moneyFormatter(props?.data?.refund_value || 0)
                : "-"
            }
            precision={2}
            valueStyle={{
              color: defaultTheme.colors.success,
              fontSize: isMobile ? "12px" : "18px",
              wordBreak: "break-all",
            }}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: isMobile ? undefined : "75px",
            }}
          />
        </Card>
      </Col>

      <Col xs={12} md={12} lg={isMobile ? 8 : 4}>
        <Card
          bordered
          style={{
            height: isMobile ? undefined : "120px",
            border:
              theme === "light" ? "1px solid #DCDFE7" : "1px solid #3b3b3b",
          }}
        >
          <Statistic
            loading={props.loading}
            title={
              <>
                <>{t("table.canceled")}</>:{" "}
                {props.query.status === "CANCELED" || !props.query.status ? (
                  <span style={{ fontSize: "12px" }}>
                    {props?.data?.canceled_total || 0} /{" "}
                    {getPercent(
                      props?.data?.canceled_total ?? 0,
                      props.data?.transactions_total ?? 0
                    )}
                  </span>
                ) : (
                  "-"
                )}
              </>
            }
            value={
              props.query.status === "CANCELED" || !props.query.status
                ? moneyFormatter(props?.data?.canceled_value || 0)
                : "-"
            }
            precision={2}
            valueStyle={{
              color: defaultTheme.colors.error,
              fontSize: isMobile ? "12px" : "18px",
              wordBreak: "break-all",
            }}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: isMobile ? undefined : "75px",
            }}
          />
        </Card>
      </Col>

      <Col xs={12} md={12} lg={isMobile ? 8 : 4}>
        <Card
          bordered
          style={{
            height: isMobile ? undefined : "120px",
            border:
              theme === "light" ? "1px solid #DCDFE7" : "1px solid #3b3b3b",
          }}
        >
          <Statistic
            loading={props.loading}
            title={
              <>
                <>{t("table.expired")}</>:{" "}
                {props.query.status === "EXPIRED" || !props.query.status ? (
                  <span style={{ fontSize: "12px" }}>
                    {props?.data?.expired_total || 0} /{" "}
                    {getPercent(
                      props?.data?.expired_total ?? 0,
                      props.data?.transactions_total ?? 0
                    )}
                  </span>
                ) : (
                  "-"
                )}
              </>
            }
            value={
              props.query.status === "EXPIRED" || !props.query.status
                ? moneyFormatter(props?.data?.expired_value || 0)
                : "-"
            }
            precision={2}
            valueStyle={{
              color: defaultTheme.colors.error,
              fontSize: isMobile ? "12px" : "18px",
              wordBreak: "break-all",
            }}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: isMobile ? undefined : "75px",
            }}
          />
        </Card>
      </Col>

      <Col xs={12} md={12} lg={isMobile ? 8 : 4}>
        <Card
          bordered
          style={{
            height: isMobile ? undefined : "120px",
            border:
              theme === "light" ? "1px solid #DCDFE7" : "1px solid #3b3b3b",
          }}
        >
          <Statistic
            loading={props.loading}
            title={
              <>
                <>{t("table.waiting")}:</>{" "}
                {props.query.status === "WAITING" || !props.query.status ? (
                  <span style={{ fontSize: "12px" }}>
                    {props?.data?.waiting_total || 0} /{" "}
                    {getPercent(
                      props?.data?.waiting_total ?? 0,
                      props.data?.transactions_total ?? 0
                    )}
                  </span>
                ) : (
                  "-"
                )}
              </>
            }
            value={
              props.query.status === "WAITING" || !props.query.status
                ? moneyFormatter(props?.data?.waiting_value || 0)
                : "-"
            }
            precision={2}
            valueStyle={{
              color: defaultTheme.colors.warnning,
              fontSize: isMobile ? "12px" : "18px",
              wordBreak: "break-all",
            }}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: isMobile ? undefined : "75px",
            }}
          />
        </Card>
      </Col>

      <Col xs={12} md={12} lg={isMobile ? 8 : 4}>
        <Card
          bordered
          style={{
            height: isMobile ? undefined : "120px",
            border:
              theme === "light" ? "1px solid #DCDFE7" : "1px solid #3b3b3b",
          }}
        >
          <Statistic
            loading={props.loading}
            title={
              <>
                <>{t("table.waiting_refund")}</>:{" "}
                {props.query.status === "WAITING_REFUND" ||
                !props.query.status ? (
                  <span style={{ fontSize: "12px" }}>
                    {props?.data?.awaiting_refund_total || 0} /{" "}
                    {getPercent(
                      props?.data?.awaiting_refund_total ?? 0,
                      props.data?.transactions_total ?? 0
                    )}
                  </span>
                ) : (
                  "-"
                )}
              </>
            }
            value={
              props.query.status === "WAITING_REFUND" || !props.query.status
                ? moneyFormatter(props?.data?.awaiting_refund_value || 0)
                : "-"
            }
            precision={2}
            valueStyle={{
              color: defaultTheme.colors.warnning,
              fontSize: isMobile ? "12px" : "18px",
              wordBreak: "break-all",
            }}
            style={{
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
