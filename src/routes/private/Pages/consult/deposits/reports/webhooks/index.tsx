import { EyeFilled } from "@ant-design/icons";
import { CustomTable } from "@src/components/CustomTable";
import { FiltersModal } from "@src/components/FiltersModal";
import { FilterChips } from "@src/components/FiltersModal/filterChips";
import { ViewModal } from "@src/components/Modals/viewGenericModal";
import { useGetDepositsWebhooks } from "@src/services/consult/deposits/webhooks/getDepositsWebhooks";
import {
  DepositWebhooksItem,
  DepositWebhooksQuery,
} from "@src/services/types/consult/deposits/webhooks.interface";
import { Button, Col, Row, Tabs } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";

export const DepositsWebhooks = () => {
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
    depositsWebhooks,
    depositsWebhooksError,
    isDepositsWebhooksFetching,
    refetchDepositsWebhooks,
  } = useGetDepositsWebhooks(query);


  useEffect(() => {
     refetchDepositsWebhooks();

      // eslint-disable-next-line react-hooks/exhaustive-deps
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
            loading={isDepositsWebhooksFetching}
            type="primary"
            onClick={() => setIsFiltersOpen(true)}
          >
            {t("table.filters")}
          </Button>
        </Col>
        <Col xs={{ span: 24 }} md={{ span: 16 }} lg={{ span: 18 }}>
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
          tabPosition={isMobile ? "top" : "right"}
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
                    data={depositsWebhooks}
                    items={depositsWebhooks?.itens}
                    error={depositsWebhooksError}
                    refetch={refetchDepositsWebhooks}
                    columns={[
                    
                      { name: "user_id", type: "text" },
                      { name: "merchant_id", type: "text" },
                      { name: "webhook_url_type_filter", type: "translate" },
                    
                      { name: "success_rows", type: "text" },
                      { name: "failed_rows", type: "text" },
                      
                      { name: "progress", type: "progress" },
                      { name: "createdAt", type: "date" },
                      { name: "start_date_filter", type: "date" },
                      { name: "end_date_filter", type: "date" },
                    ]}
                    loading={isDepositsWebhooksFetching}
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
                    data={depositsWebhooks}
                    items={depositsWebhooks?.itens}
                    error={depositsWebhooksError}
                    refetch={refetchDepositsWebhooks}
                    columns={[
                      { name: "_id", type: "id" },
                      { name: "user_name", type: "text" },
                      { name: "webhook_type", type: "translate" },
                      { name: "partner_id", type: "text" },
                      { name: "merchant_id", type: "text" },
                      { name: "createdAt", type: "date" },
                      { name: "date", type: "date" },
                    ]}
                    loading={isDepositsWebhooksFetching}
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
          filters={["start_date", "end_date", "partner_id", "merchant_id"]}
          refetch={refetchDepositsWebhooks}
          selectOptions={{}}
          startDateKeyName="start_date"
          endDateKeyName="end_date"
          initialQuery={INITIAL_QUERY}
        />
      )}
      {isViewModalOpen && (
        <ViewModal
          item={currentItem}
          loading={isDepositsWebhooksFetching}
          modalName={t("modal.details")}
          open={isViewModalOpen}
          setOpen={setIsViewModalOpen}
        />
      )}
    </Row>
  );
};
