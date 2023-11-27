import { Col, Form, Row, Select } from "antd";
import { useTranslation } from "react-i18next";
import { TableProps } from "..";
import { DepositOperations } from "./deposit";
import { TotalOperations } from "./total";
import { WithdrawOperations } from "./withdraw";

export const OperationMovementsTab = ({
  query,
  chart,
  operationType,
  setOperationType,
}: TableProps) => {
  const { t } = useTranslation();

  return (
    <Row gutter={[8, 8]}>
      <Col xs={{ span: 12 }} md={{ span: 6 }}>
        <Form layout="vertical">
          <Form.Item label={t("input.operation_type")}>
            <Select
              size="large"
              style={{ width: "100%", marginBottom: 16 }}
              options={[
                { label: "Total", value: "total" },
                { label: t("table.deposits"), value: "deposit" },
                { label: t("table.withdrawals"), value: "withdraw" },
              ]}
              value={operationType || "total"}
              onChange={(value) => {
                setOperationType && setOperationType(value);
              }}
            />
          </Form.Item>
        </Form>
      </Col>

      {operationType === "total" ? (
        <Col xs={{ span: 24 }} md={{ span: 24 }}>
          <TotalOperations query={query} chart={chart} />
        </Col>
      ) : operationType === "deposit" ? (
        <Col xs={{ span: 24 }} md={{ span: 24 }}>
          <DepositOperations query={query} chart={chart} />
        </Col>
      ) : (
        <Col xs={{ span: 24 }} md={{ span: 24 }}>
          <WithdrawOperations query={query} chart={chart} />
        </Col>
      )}
    </Row>
  );
};
