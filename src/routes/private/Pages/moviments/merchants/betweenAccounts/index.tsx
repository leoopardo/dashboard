/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ArrowUpOutlined,
  DollarOutlined,
  EyeFilled,
  FilterOutlined,
} from "@ant-design/icons";
import { CustomTable } from "@src/components/CustomTable";
import { FiltersModal } from "@src/components/FiltersModal";
import { FilterChips } from "@src/components/FiltersModal/filterChips";
import { ExportReportsModal } from "@src/components/Modals/exportReportsModal";
import { MutateModal } from "@src/components/Modals/mutateGenericModal";
import { ViewModal } from "@src/components/Modals/viewGenericModal";
import { Toast } from "@src/components/Toast";
import { useCreateTransferBetweenAccounts } from "@src/services/moviments/merchants/betweenAccounts/createTransferBetweenAccounts";
import { useGetTransferBetweenAccounts } from "@src/services/moviments/merchants/betweenAccounts/getTransfersBetweenAccounts";
import { queryClient } from "@src/services/queryClient";
import { useCreateMerchantTransferBetweenAccountsReports } from "@src/services/reports/moviments/merchant/createTransferBetweenAccountsReports";
import {
  MerchantTransferBetweenAccountsQuery,
  TransferBetweenAccountsbody,
} from "@src/services/types/moviments/merchant/transferBetweenAccounts.interface";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { defaultTheme } from "@src/styles/defaultTheme";
import { Button, Card, Col, Row, Statistic, Tabs } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MerchantBalance } from "../../../dashboard/components/merchantBalance";
import { moneyFormatter } from "@src/utils/moneyFormatter";
import { MerchantBalanceTotalsData } from "@src/services/types/consult/merchant/balance";

export const TransfersBetweenAccounts = () => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const MerchantTotals = queryClient.getQueryData(
    "MerchantBalanceTotals"
  ) as MerchantBalanceTotalsData;
  const user = queryClient.getQueryData("validate") as ValidateInterface;
  const INITIAL_QUERY: MerchantTransferBetweenAccountsQuery = {
    limit: 25,
    page: 1,
  };
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [body, setBody] = useState<TransferBetweenAccountsbody | null>({
    from: "",
    to: "",
  });
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [isNewTransferModalOpen, setIsNewTransferModalOpen] =
    useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<any>({});
  const [query, setQuery] =
    useState<MerchantTransferBetweenAccountsQuery>(INITIAL_QUERY);
  const { t } = useTranslation();
  const {
    TransferBetweenAccountsData,
    TransferBetweenAccountsDataError,
    isTransferBetweenAccountsDataFetching,
    refetchTransferBetweenAccountsData,
  } = useGetTransferBetweenAccounts(query);

  const { error, isLoading, isSuccess, mutate, reset } =
    useCreateTransferBetweenAccounts({
      ...body,
      merchant_id: (body?.merchant_id || user?.merchant_id) ?? undefined,
    });

  const {
    MerchantTransferBetweenAccountsError,
    MerchantTransferBetweenAccountsIsLoading,
    MerchantTransferBetweenAccountsIsSuccess,
    MerchantTransferBetweenAccountsMutate,
  } = useCreateMerchantTransferBetweenAccountsReports(query);

  const fieldsIfNotMerch = [
    {
      label: "merchant_id",
      required: true,
    },
    {
      label: "from",
      required: true,
      selectOption: true,
      validator: () => {
        const from = body?.from ? parseFloat(MerchantTotals[String(body.from.toString()) || ''] ?? '0') : 0;
        const value = parseFloat(body?.value?.toString() ?? '0');
        
        if (!isNaN(from) && !isNaN(value) && from >= value) {
          return Promise.resolve();
        }
        
        return Promise.reject(
          new Error(t("error.from_value_must_be_more_than_to_value") || "")
        );
      }
    },
    { label: "to", required: true, selectOption: true },
    { label: "value", required: true },
  ];
  const fieldMerch = [
    {
      label: "from",
      required: true,
      selectOption: true,
      validator: () => {
        const from = body?.from ? parseFloat(MerchantTotals[String(body.from.toString()) || ''] ?? '0') : 0;
        const value = parseFloat(body?.value?.toString() ?? '0');
        
        if (!isNaN(from) && !isNaN(value) && from >= value) {
          return Promise.resolve();
        }
        
        return Promise.reject(
          new Error(t("error.from_value_must_be_more_than_to_value") || "")
        );
      }
    },
    { label: "to", required: true, selectOption: true, },
    { label: "value", required: true },
  ];

  useEffect(() => {
    refetchTransferBetweenAccountsData();
  }, [query]);

  return (
    <Row style={{ padding: 25 }}>
      <Col span={24} style={{ marginBottom: 24 }}>
        <Tabs
          items={[
            {
              label: t("table.balance"),
              key: "balance",
              children: <MerchantBalance customQuery={query} />,
            },
            {
              label: t("menus.between_accounts_transfers"),
              key: "between_accounts_transfers",
              children: (
                <Row
                  gutter={[8, 8]}
                  style={{
                    width: "100%",
                    marginBottom: 16,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Col xs={{ span: 24 }} md={{ span: 4 }}>
                    <Card bordered={false} style={{ width: "100%" }}>
                      <Statistic
                        title={t("table.success")}
                        value={moneyFormatter(
                          TransferBetweenAccountsData?.total_success || 0
                        )}
                        precision={2}
                        valueStyle={{ color: defaultTheme.colors.success }}
                        loading={isTransferBetweenAccountsDataFetching}
                      />
                    </Card>
                  </Col>
                  <Col xs={{ span: 24 }} md={{ span: 4 }}>
                    <Card bordered={false} style={{ width: "100%" }}>
                      <Statistic
                        title={t("table.processing")}
                        value={moneyFormatter(
                          Number(
                            TransferBetweenAccountsData?.total_processing.toFixed(
                              2
                            )
                          ) || 0
                        )}
                        valueStyle={{ color: defaultTheme.colors.processing }}
                        loading={isTransferBetweenAccountsDataFetching}
                      />
                    </Card>
                  </Col>
                  <Col xs={{ span: 24 }} md={{ span: 4 }}>
                    <Card bordered={false} style={{ width: "100%" }}>
                      <Statistic
                        title={t("table.canceled")}
                        value={moneyFormatter(
                          TransferBetweenAccountsData?.total_canceled || 0
                        )}
                        precision={2}
                        valueStyle={{ color: defaultTheme.colors.canceled }}
                        loading={isTransferBetweenAccountsDataFetching}
                      />
                    </Card>
                  </Col>
                </Row>
              ),
            },
          ]}
        />
      </Col>

      <Row gutter={[8, 8]} style={{ width: "100%", marginBottom: 16 }}>
        <Col xs={{ span: 24 }} md={{ span: 4 }}>
          <Button
            size="large"
            style={{ width: "100%" }}
            loading={false}
            type="primary"
            onClick={() => setIsFiltersOpen(true)}
            icon={<FilterOutlined />}
          >
            {t("table.filters")}
          </Button>
        </Col>
        <Col xs={{ span: 24 }} md={{ span: 12 }}>
          <FilterChips initial_query={INITIAL_QUERY}
            startDateKeyName="start_date"
            endDateKeyName="end_date"
            query={query}
            setQuery={setQuery}
          />
        </Col>

        <Col xs={{ span: 24 }} md={{ span: 5 }} lg={{ span: 5 }}>
          <Button
            type="default"
            loading={false}
            onClick={() => {
              setIsNewTransferModalOpen(true);
            }}
            style={{
              height: 40,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ArrowUpOutlined
              style={{ fontSize: 16, marginRight: -8, marginBottom: 12 }}
            />
            <DollarOutlined style={{ fontSize: 22 }} /> {t("table.transfer")}
          </Button>
        </Col>

        {permissions?.transactions?.merchant?.internal_transfers
          ?.merchant_internal_transfers_export_csv && (
          <Col xs={{ span: 24 }} md={{ span: 3 }} lg={{ span: 3 }}>
            <ExportReportsModal
              disabled={
                !TransferBetweenAccountsData?.items ||
                MerchantTransferBetweenAccountsError
              }
              mutateReport={() => MerchantTransferBetweenAccountsMutate()}
              error={MerchantTransferBetweenAccountsError}
              success={MerchantTransferBetweenAccountsIsSuccess}
              loading={MerchantTransferBetweenAccountsIsLoading}
              reportPath="/moviment/merchant_moviments/merchant_moviments_reports/merchant_between_accounts_reports"
            />
          </Col>
        )}
      </Row>

      <Row style={{ width: "100%" }}>
        <Col span={24}>
          <CustomTable
            query={query}
            setCurrentItem={setCurrentItem}
            setQuery={setQuery}
            actions={[
              {
                label: "details",
                icon: <EyeFilled style={{ fontSize: "20px" }} />,
                onClick: () => {
                  setIsViewModalOpen(true);
                },
              },
            ]}
            data={TransferBetweenAccountsData}
            items={TransferBetweenAccountsData?.items}
            error={TransferBetweenAccountsDataError}
            refetch={refetchTransferBetweenAccountsData}
            columns={[
              { name: "_id", type: "id" },
              { name: "from", type: "translate" },
              { name: "to", type: "translate" },
              { name: "user_name", type: "text" },
              { name: "partner_name", type: "text" },
              { name: "merchant_name", type: "text" },
              { name: "value", type: "value" },
              { name: "status", type: "status_color" },
              { name: "createdAt", type: "date", sort: true },
            ]}
            loading={isTransferBetweenAccountsDataFetching}
            label={["merchant_name", "to", "from", "value"]}
          />
        </Col>
      </Row>

      <FiltersModal
        open={isFiltersOpen}
        setOpen={setIsFiltersOpen}
        query={query}
        setQuery={setQuery}
        filters={["start_date", "end_date", "merchant_id", "from", "to"]}
        refetch={() => {
          return "";
        }}
        selectOptions={{
          from: [
            "balance_reserved",
            "balance_to_payment",
            "balance_to_transactions",
          ],
          to: [
            "balance_reserved",
            "balance_to_payment",
            "balance_to_transactions",
          ],
        }}
        startDateKeyName="start_date"
        endDateKeyName="end_date"
        initialQuery={INITIAL_QUERY}
      />

      <MutateModal
        type="create"
        validateToken
        validateTokenAction="MERCHANT_BALANCE_TRANSFER_CREATE"
        open={isNewTransferModalOpen}
        setOpen={setIsNewTransferModalOpen}
        fields={user?.merchant_id ? fieldMerch : fieldsIfNotMerch}
        merchantBetweenAccounts
        body={body}
        setBody={setBody}
        selectOptions={{
          from:
            user?.type === 1 || user?.type === 2
              ? [
                  {
                    label: "balance_reserved",
                    value: "balance_reserved",
                  },
                  {
                    label: "balance_to_payment",
                    value: "balance_to_payment",
                  },
                  {
                    label: "balance_to_transactions",
                    value: "balance_to_transactions",
                  },
                ]
              : [
                  {
                    label: "balance_to_transactions",
                    value: "balance_to_transactions",
                  },
                ],
          to: [
            { label: "balance_reserved", value: "balance_reserved" },
            {
              label: "balance_to_payment",
              value: "balance_to_payment",
            },
            {
              label: "balance_to_transactions",
              value: "balance_to_transactions",
            },
          ].filter((item) => item.value !== body?.from),
        }}
        modalName={t("table.transfer")}
        submit={mutate}
        submitLoading={isLoading}
        error={error}
        success={isSuccess}
        submitText={`${t("buttons.create")}`}
        clear={reset}
      />

      <ViewModal
        item={currentItem}
        loading={isTransferBetweenAccountsDataFetching}
        modalName={t("actions.details")}
        setOpen={setIsViewModalOpen}
        open={isViewModalOpen}
      />

      <Toast
        actionError={t("messages.create")}
        actionSuccess={t("messages.created")}
        error={error}
        success={isSuccess}
      />
    </Row>
  );
};
