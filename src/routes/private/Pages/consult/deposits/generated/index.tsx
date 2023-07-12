/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { EyeFilled, SearchOutlined, SettingFilled } from "@ant-design/icons";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { Grid } from "@mui/material";
import { ExportReportsModal } from "@src/components/Modals/exportReportsModal";
import { Toast } from "@src/components/Toast";
import { useCreateSendWebhook } from "@src/services/consult/deposits/generatedDeposits/resendWebhook";
import { queryClient } from "@src/services/queryClient";
import { useCreateGeneratedDepositsReports } from "@src/services/reports/consult/deposits/createGeneratedDepositsReports";
import { ResendWebhookBody } from "@src/services/types/consult/deposits/createResendWebhook.interface";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { Alert, Button, Input, Select, Space } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ColumnInterface,
  CustomTable,
} from "../../../../../../components/CustomTable";
import { FiltersModal } from "../../../../../../components/FiltersModal";
import { FilterChips } from "../../../../../../components/FiltersModal/filterChips";
import { useGetRowsGeneratedDeposits } from "../../../../../../services/consult/deposits/generatedDeposits/getRows";
import { useGetTotalGeneratedDeposits } from "../../../../../../services/consult/deposits/generatedDeposits/getTotal";
import { generatedDepositTotalQuery } from "../../../../../../services/types/consult/deposits/generatedDeposits.interface";
import useDebounce from "../../../../../../utils/useDebounce";
import { ResendWebhookModal } from "../components/ResendWebhookModal";
import { ViewModal } from "../components/ViewModal";
import { WebhookModal } from "../components/webhooksModal";
import { TotalizersCards } from "./components/TotalizersCards";

const INITIAL_QUERY: generatedDepositTotalQuery = {
  page: 1,
  limit: 25,
  initial_date: moment(new Date())
    .startOf("day")
    .format("YYYY-MM-DDTHH:mm:ss.SSS"),
  final_date: moment(new Date())
    .add(1, "day")
    .startOf("day")
    .format("YYYY-MM-DDTHH:mm:ss.SSS"),
};

export const GeneratedDeposits = () => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const { t } = useTranslation();
  const [query, setQuery] = useState<generatedDepositTotalQuery>(INITIAL_QUERY);
  const {
    depositsTotal,
    depositsTotalError,
    isDepositsTotalFetching,
    refetchDepositsTotal,
  } = useGetTotalGeneratedDeposits(query);

  const {
    depositsRows,
    depositsRowsError,
    isDepositsRowsFetching,
    refetchDepositsTotalRows,
  } = useGetRowsGeneratedDeposits(query);

  useEffect(() => {
    refetchDepositsTotalRows();
  }, [query]);

  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState<boolean>(false);
  const [isResendWebhookModalOpen, setIsResendWebhookModalOpen] =
    useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<any>();
  const [searchOption, setSearchOption] = useState<string | null>(null);
  const [search, setSearch] = useState<string | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const debounceSearch = useDebounce(search);

  const {
    GeneratedDepositsReportsError,
    GeneratedDepositsReportsIsLoading,
    GeneratedDepositsReportsIsSuccess,
    GeneratedDepositsReportsMutate,
  } = useCreateGeneratedDepositsReports(query);

  const [webhookBody, setWebhookBody] = useState<ResendWebhookBody>({
    start_date: moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSS"),
    end_date: moment(new Date())
      .add(1, "hour")
      .format("YYYY-MM-DDTHH:mm:ss.SSS"),
    merchant_id: undefined,
    partner_id: undefined,
    webhook_url_type: "both",
  });

  const { ResendWebMutate, ResendWebError, ResendWebIsSuccess } =
    useCreateSendWebhook(webhookBody);

  const columns: ColumnInterface[] = [
    { name: "_id", type: "id" },
    { name: "bank", type: "bankNameToIcon" },
    { name: "merchant_name", type: "text" },
    { name: "value", type: "value" },
    { name: "createdAt", type: "date" },
    { name: "delivered_at", type: "date" },
    { name: "buyer_name", type: "text" },
    { name: "buyer_document", type: "document" },
    { name: "status", type: "status" },
  ];

  useEffect(() => {
    const q = { ...query };
    delete q.pix_id;
    delete q.endToEndId;
    delete q.txid;
    delete q.reference_id;
    delete q.buyer_document;
    delete q.payer_document;
    delete q.buyer_name;
    delete q.payer_name;

    if (debounceSearch && searchOption) {
      setQuery(() => ({ ...q, [searchOption]: debounceSearch }));
    }
  }, [debounceSearch, searchOption]);

  return (
    <Grid container style={{ padding: "25px" }}>
      <Grid container>
        {depositsTotalError ? (
          <Grid item xs={12} style={{ marginBottom: "10px" }}>
            <Alert
              message={depositsTotalError?.message}
              type="error"
              closable
            />
          </Grid>
        ) : (
          <></>
        )}
      </Grid>

      {permissions.report.deposit.generated_deposit
        .report_deposit_generated_deposit_list_totals && (
        <TotalizersCards
          data={depositsTotal}
          fetchData={refetchDepositsTotal}
          loading={isDepositsTotalFetching}
          query={query}
        />
      )}

      <Grid
        container
        style={{
          marginTop: permissions.report.deposit.generated_deposit
            .report_deposit_generated_deposit_list_totals
            ? "20px"
            : 0,
          display: "flex",
          alignItems: "center",
        }}
        spacing={1}
      >
        <Grid item xs={12} md={4} lg={2}>
          <Button
            style={{ width: "100%", height: 40 }}
            loading={isDepositsRowsFetching || isDepositsTotalFetching}
            type="primary"
            onClick={() => setIsFiltersOpen(true)}
          >
            {t("table.filters")}
          </Button>
        </Grid>
        <Grid item xs={12} md={8} lg={10}>
          <FilterChips
            startDateKeyName="initial_date"
            endDateKeyName="final_date"
            query={query}
            setQuery={setQuery}
            haveInitialDate
          />
        </Grid>
      </Grid>

      <Grid container style={{ marginTop: "5px" }} spacing={1}>
        <Grid item xs={12} md={2} lg={2}>
          <Select
            style={{ width: "100%" }}
            size="large"
            onChange={(value) => setSearchOption(value)}
            value={searchOption}
            placeholder="Opções"
            options={[
              { value: "pix_id", label: t("table.pix_id") },
              { value: "endToEndId", label: t("table.endToEndId") },
              { value: "payer_document", label: t("table.payer_document") },
              { value: "buyer_document", label: t("table.buyer_document") },
              { value: "buyer_name", label: t("table.buyer_name") },
              { value: "payer_name", label: t("table.payer_name") },
              { value: "txid", label: t("table.txid") },
              { value: "reference_id", label: t("table.reference_id") },
            ]}
          />
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <Space.Compact style={{ width: "100%" }} size="large">
            <Input
              placeholder="Pesquisa"
              size="large"
              disabled={!searchOption}
              style={{ width: "100%" }}
              onChange={(event) => setSearch(event.target.value)}
            />
            <Button
              loading={isDepositsRowsFetching}
              type="primary"
              onClick={() => refetchDepositsTotalRows()}
              disabled={typeof searchOption === "string" && !search}
            >
              <SearchOutlined />
            </Button>
          </Space.Compact>
        </Grid>
        <Grid item xs={12} md={2} lg={2}>
          <Button
            type="dashed"
            loading={isDepositsRowsFetching}
            danger
            size="large"
            onClick={() => {
              setQuery(INITIAL_QUERY);
              setSearchOption(null);
              setSearch(null);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <FilterAltOffOutlinedIcon style={{ marginRight: 10 }} />{" "}
            {t("table.clear_filters")}
          </Button>
        </Grid>
        {permissions.report.deposit.generated_deposit
          .report_deposit_generated_deposit_resend_notification && (
          <Grid item xs={12} md={2} lg={2}>
            <Button
              type="primary"
              loading={isDepositsRowsFetching}
              size="large"
              onClick={() => {
                setIsResendWebhookModalOpen(true);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
            >
              {t("modal.resend_webhook")}
            </Button>
          </Grid>
        )}

        {permissions.report.deposit.generated_deposit
          .report_deposit_generated_deposit_export_csv && (
          <Grid item xs={12} md="auto" lg={1}>
            <ExportReportsModal
              mutateReport={() => GeneratedDepositsReportsMutate()}
              error={GeneratedDepositsReportsError}
              success={GeneratedDepositsReportsIsSuccess}
              loading={GeneratedDepositsReportsIsLoading}
              reportPath="/consult/deposit/deposits_reports/generated_deposits_reports"
            />
          </Grid>
        )}
      </Grid>

      <Grid container style={{ marginTop: "15px" }}>
        <Grid item xs={12}>
          {" "}
          <CustomTable
            query={query}
            setCurrentItem={setCurrentItem}
            setQuery={setQuery}
            data={depositsRows}
            items={depositsRows?.items}
            error={depositsRowsError}
            columns={columns}
            loading={isDepositsRowsFetching}
            actions={[
              {
                label: "details",
                icon: <EyeFilled style={{ fontSize: "18px" }} />,
                onClick: () => setIsViewModalOpen(true),
              },
              {
                label: "logs_webhooks",
                icon: <SettingFilled style={{ fontSize: "18px" }} />,
                onClick: () => setIsWebhookModalOpen(true),
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
        </Grid>
      </Grid>
      {isViewModalOpen && (
        <ViewModal
          open={isViewModalOpen}
          setOpen={setIsViewModalOpen}
          id={currentItem?._id}
        />
      )}
      {isWebhookModalOpen && (
        <WebhookModal
          open={isWebhookModalOpen}
          setOpen={setIsWebhookModalOpen}
          id={currentItem?._id}
        />
      )}
      {isFiltersOpen && (
        <FiltersModal
          maxRange
          open={isFiltersOpen}
          setOpen={setIsFiltersOpen}
          query={query}
          setQuery={setQuery}
          haveInitialDate
          filters={[
            "initial_date",
            "final_date",
            "status",
            "partner_id",
            "merchant_id",
            "bank",
            "payer_bank",
            "state",
            "city",
            "gender",
            "age_start",
            "value_start",
          ]}
          refetch={refetchDepositsTotalRows}
          selectOptions={{
            status: [
              "PAID",
              "REFUNDED",
              "EXPIRED",
              "CANCELED",
              "WAITING",
              "WAITING_REFUND",
            ],
            gender: ["MALE", "FEMALE", "OTHER"],
          }}
          startDateKeyName="initial_date"
          endDateKeyName="final_date"
          initialQuery={INITIAL_QUERY}
        />
      )}
      {isResendWebhookModalOpen && (
        <ResendWebhookModal
          open={isResendWebhookModalOpen}
          setOpen={setIsResendWebhookModalOpen}
          body={webhookBody}
          setBody={setWebhookBody}
          submit={ResendWebMutate}
        />
      )}
      <Toast
        actionSuccess={t("messages.created")}
        actionError={t("messages.create")}
        error={ResendWebError}
        success={ResendWebIsSuccess}
      />
    </Grid>
  );
};
