/* eslint-disable no-constant-condition */
import { Toast } from "@src/components/Toast";
import { useGetReceipts } from "@src/services/consult/deposits/receipts/useGetRecepts";
import { defaultTheme } from "@src/styles/defaultTheme";
import {
  Col,
  Descriptions,
  Divider,
  Empty,
  Input,
  Row,
  Typography,
} from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { ViewModal } from "../components/ViewModal";
import { moneyFormatter } from "@src/utils/moneyFormatter";

export const DepositsReceipts = () => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery({ maxWidth: "750px" });
  const [endToEndId, setEndToEndId] = useState<string | undefined>(undefined);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const {
    receipts,
    refetchReceipts,
    isReceiptsFetching,
    receiptsError,
    isSuccess,
  } = useGetReceipts(endToEndId);

  return (
    <Row style={{ padding: 25 }}>
      <Col xs={{ span: 24 }} md={{ span: 8 }}>
        <Input.Search
          placeholder="EndToEnd ID"
          size="large"
          onChange={(e) => setEndToEndId(e.target.value)}
          onSearch={() => refetchReceipts()}
          loading={isReceiptsFetching}
        />
      </Col>
      <Col span={24} style={{ marginTop: 8, marginBottom: 8 }}>
        {receipts ? (
          <Divider>
            <Typography.Title
              level={isMobile ? 5 : 3}
              style={{ color: defaultTheme.colors.secondary }}
            >
              {t(`messages.${receipts?.code}`)}
            </Typography.Title>
          </Divider>
        ) : (
          <Divider />
        )}
      </Col>

      <Col span={24}>
        {receipts ? (
          <Descriptions bordered column={isMobile ? 1 : 3}>
            {receipts?.transaction?.id && (
              <Descriptions.Item label={t("table.id")}>
                <Typography.Link onClick={() => setIsViewModalOpen(true)}>
                  {receipts?.transaction?.id}
                </Typography.Link>
              </Descriptions.Item>
            )}
            {receipts?.transaction?.acquirer_id && (
              <Descriptions.Item label={"TXID (QR Code)"}>
                {receipts?.transaction?.id}
              </Descriptions.Item>
            )}
            {receipts?.transaction?.bank && (
              <Descriptions.Item label={t("table.bank")}>
                {receipts?.transaction?.bank}
              </Descriptions.Item>
            )}
            {receipts?.transaction?.endToEndId && (
              <Descriptions.Item label={t("table.endToEndId")}>
                {receipts?.transaction?.endToEndId}
              </Descriptions.Item>
            )}
            {receipts?.transaction?.value && (
              <Descriptions.Item label={t("table.value")}>
                {moneyFormatter(Number(receipts?.transaction?.value) || 0)}
              </Descriptions.Item>
            )}
            {receipts?.transaction?.payer_name && (
              <Descriptions.Item label={t("table.payer_name")}>
                {receipts?.transaction?.payer_name}
              </Descriptions.Item>
            )}
            {receipts?.transaction?.payer_document && (
              <Descriptions.Item label={t("table.payer_document")}>
                {receipts?.transaction?.payer_document}
              </Descriptions.Item>
            )}
            {receipts?.transaction?.email && (
              <Descriptions.Item label={t("table.email")}>
                {receipts?.transaction?.email}
              </Descriptions.Item>
            )}
            {receipts?.transaction?.status && (
              <Descriptions.Item label={t("table.status")}>
                {t(`table.${receipts?.transaction?.status?.toLowerCase()}`)}
              </Descriptions.Item>
            )}
            {receipts?.transaction?.date && (
              <Descriptions.Item label={t("table.date")}>
                {`${new Date(
                  receipts?.transaction?.date
                ).toLocaleDateString()} ${new Date(
                  receipts?.transaction?.date
                ).toLocaleTimeString()}`}
              </Descriptions.Item>
            )}
            {receipts?.transaction?.required_date && (
              <Descriptions.Item label={t("table.required_date")}>
                {`${new Date(
                  receipts?.transaction?.required_date
                ).toLocaleDateString()} ${new Date(
                  receipts?.transaction?.required_date
                ).toLocaleTimeString()}`}
              </Descriptions.Item>
            )}
            {receipts?.transaction?.refund_date && (
              <Descriptions.Item label={t("table.date")}>
                {`${new Date(
                  receipts?.transaction?.refund_date
                ).toLocaleDateString()} ${new Date(
                  receipts?.transaction?.refund_date
                ).toLocaleTimeString()}`}
              </Descriptions.Item>
            )}
          </Descriptions>
        ) : (
          <Empty description={t("messages.empty_table_data")} />
        )}
      </Col>
      <Toast
        error={receiptsError}
        success={isSuccess}
        actionError={t("messages.found")}
        actionSuccess={t("messages.founded")}
      />

      <ViewModal
        open={isViewModalOpen}
        setOpen={setIsViewModalOpen}
        id={receipts?.transaction?.id}
      />
    </Row>
  );
};
