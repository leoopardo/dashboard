import { ReloadOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Statistic } from "antd";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import {
  paidWithdrawalsRowsQuery,
  paidWithdrawalsTotal,
} from "../../../../../../../services/types/consult/withdrawals/paidWithdrawals.interface";
import { defaultTheme } from "../../../../../../../styles/defaultTheme";
import { useTheme } from "@src/contexts/ThemeContext";
import { moneyFormatter } from "@src/utils/moneyFormatter";

interface TotalizersInterface {
  data: paidWithdrawalsTotal | null | undefined;
  query: paidWithdrawalsRowsQuery;
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
              title={`${t("table.paid")}: ${props?.data?.paid_total || 0}`}
              value={moneyFormatter(props?.data?.paid_value || 0)}
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
     
    </Row>
  );
};
