import { FilterOutlined, ReloadOutlined } from "@ant-design/icons";
import { moneyFormatter } from "@src/utils/moneyFormatter";
import { Button, Col, Row, Statistic } from "antd";
import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import {
  paidDepositRowsQuery,
  paidDepositTotal,
} from "../../../../../../../services/types/consult/deposits/PaidDeposits.interface";
import { defaultTheme } from "../../../../../../../styles/defaultTheme";

interface TotalizersInterface {
  data: paidDepositTotal | null | undefined;
  query: paidDepositRowsQuery;
  loading: boolean;
  fetchData: () => void;
  setIsFiltersOpen: Dispatch<SetStateAction<boolean>>;
}

export const TotalizersCards = (props: TotalizersInterface) => {
  const isMobile = useMediaQuery({ maxWidth: "900px" });
  const { t } = useTranslation();
  
  return (
    <Row
      gutter={[8, 8]}
      justify="center"
      style={{ height: "100%"}}
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
                <span style={{ fontSize: 16 }}>
                  {props?.data?.transactions_total || 0}
                </span>
              </div>
            }
            value={moneyFormatter(props?.data?.transaction_value || 0)}
            precision={2}
            valueStyle={{
              fontSize: isMobile ? "24px" : "28px",
              wordBreak: "break-all",
              fontWeight: "bold", color: defaultTheme.colors.success,
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

    </Row>
  );
};
