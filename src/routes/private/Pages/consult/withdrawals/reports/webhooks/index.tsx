import { EyeFilled } from "@ant-design/icons";
import { CustomTable } from "@src/components/CustomTable";
import { FiltersModal } from "@src/components/FiltersModal";
import { FilterChips } from "@src/components/FiltersModal/filterChips";
import { ViewModal } from "@src/components/Modals/viewGenericModal";
import { useGetWithdrawWebhooks } from "@src/services/consult/withdrawals/webhooks/getDepositsWebhooks";
import { DepositWebhooksItem, DepositWebhooksQuery } from "@src/services/types/consult/deposits/webhooks.interface";

import { Button, Col, Row, Tabs } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";

export const WithdrawWebhooks = () => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery({ maxWidth: "750px" });
  const INITIAL_QUERY: DepositWebhooksQuery = {
    log_type: "interval",
    limit: 25,
    page: 1,
  };
  const [query, setQuery] = useState<DepositWebhooksQuery>(INITIAL_QUERY);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<DepositWebhooksItem | null>(
    null
  );
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const {
    WithdrawWebhooks,
    WithdrawWebhooksError,
    isWithdrawWebhooksFetching,
    refetchWithdrawWebhooks,
  } = useGetWithdrawWebhooks(query);

  useEffect(() => {
    refetchWithdrawWebhooks();
  }, [query]);

  return (
    <Row style={{ padding: 25, width: "100%" }}>
      <Row
        align="middle"
        justify="start"
        gutter={[8, 8]}
        style={{ width: "100%" }}
      >
        <Col xs={{ span: 24 }} md={{ span: 4 }}>
          <Button
            size="large"
            style={{ width: "100%" }}
            loading={isWithdrawWebhooksFetching}
            type="primary"
            onClick={() => setIsFiltersOpen(true)}
          >
            {t("table.filters")}
          </Button>
        </Col>
        <Col xs={{ span: 24 }} md={{ span: 20 }}>
          <FilterChips
            startDateKeyName="start_date"
            endDateKeyName="end_date"
            query={query}
            setQuery={setQuery}
            haveInitialDate
          />
        </Col>
      </Row>

      <Row
        align="middle"
        justify="start"
        gutter={[8, 8]}
        style={{ width: "100%", marginTop: 16 }}
      >
        <Tabs
          defaultActiveKey="1"
          tabPosition={isMobile ? "top" : "left"}
          style={{ padding: 0 }}
          onChange={(active) => {
            active === "multiple"
              ? setQuery((state) => ({ ...state, log_type: "interval" }))
              : setQuery((state) => ({ ...state, log_type: "single" }));
          }}
          items={[
            {
              label: t("table.multiple"),
              key: "multiple",
              children: (
                <div style={{ width: "99%" }}>
                  <CustomTable
                    query={query}
                    setCurrentItem={setCurrentItem}
                    setQuery={setQuery}
                    data={WithdrawWebhooks}
                    items={WithdrawWebhooks?.items}
                    error={WithdrawWebhooksError}
                    columns={[
                      { name: "_id", type: "id" },
                      { name: "user_name", type: "text" },
                      { name: "webhook_type", type: "translate" },
                      { name: "success", type: "boolean" },
                      { name: "failed", type: "boolean" },
                      { name: "error", type: "text" },
                      { name: "progress", type: "progress" },
                      { name: "createdAt", type: "date" },
                      { name: "start_date", type: "date" },
                      { name: "end_date", type: "date" },
                    ]}
                    loading={isWithdrawWebhooksFetching}
                    actions={[
                      {
                        label: "details",
                        icon: <EyeFilled style={{ fontSize: "18px" }} />,
                        onClick: () => setIsViewModalOpen(true),
                      },
                    ]}
                    removeTotal
                    label={[
                      "bank",
                      "merchant_name",
                      "status",
                      "createdAt",
                      "delivered_at",
                    ]}
                  />
                </div>
              ),
            },
            {
              label: t("table.single"),
              key: "single",
              children: (
                <div style={{ width: "99%" }}>
                  <CustomTable
                    query={query}
                    setCurrentItem={setCurrentItem}
                    setQuery={setQuery}
                    data={WithdrawWebhooks}
                    items={WithdrawWebhooks?.items}
                    error={WithdrawWebhooksError}
                    columns={[
                      { name: "_id", type: "id" },
                      { name: "user_name", type: "text" },
                      { name: "webhook_type", type: "translate" },
                      { name: "partner_id", type: "text" },
                      { name: "merchant_id", type: "text" },
                      { name: "createdAt", type: "date" },
                      { name: "date", type: "date" },
                    ]}
                    loading={isWithdrawWebhooksFetching}
                    actions={[
                      {
                        label: "details",
                        icon: <EyeFilled style={{ fontSize: "18px" }} />,
                        onClick: () => setIsViewModalOpen(true),
                      },
                    ]}
                    removeTotal
                    label={[
                      "bank",
                      "merchant_name",
                      "status",
                      "createdAt",
                      "delivered_at",
                    ]}
                  />
                </div>
              ),
            },
          ]}
        />
      </Row>

      {isFiltersOpen && (
        <FiltersModal
          maxRange
          open={isFiltersOpen}
          setOpen={setIsFiltersOpen}
          query={query}
          setQuery={setQuery}
          haveInitialDate
          filters={["start_date", "end_date", "partner_id", "merchant_id"]}
          refetch={refetchWithdrawWebhooks}
          selectOptions={{}}
          startDateKeyName="start_date"
          endDateKeyName="end_date"
          initialQuery={INITIAL_QUERY}
        />
      )}
      {isViewModalOpen && (
        <ViewModal
          item={currentItem}
          loading={isWithdrawWebhooksFetching}
          modalName={t("modal.details")}
          open={isViewModalOpen}
          setOpen={setIsViewModalOpen}
        />
      )}
    </Row>
  );
};
