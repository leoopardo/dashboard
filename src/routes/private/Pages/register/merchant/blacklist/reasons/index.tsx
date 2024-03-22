/* eslint-disable react-hooks/exhaustive-deps */
import { FilterOutlined, PlusOutlined } from "@ant-design/icons";
import { ColumnInterface, CustomTable } from "@components/CustomTable";
import { FiltersModal } from "@components/FiltersModal";
import { FilterChips } from "@components/FiltersModal/filterChips";
import { ViewModal } from "@components/Modals/viewGenericModal";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { Grid } from "@mui/material";
import useDebounce from "@utils/useDebounce";
import { Button } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { MutateModal } from "@src/components/Modals/mutateGenericModal";
import { useCreateMerchantBlacklistReason } from "@src/services/register/merchant/blacklist/createMerchantBlacklistReason";
import { useGetRowsMerchantBlacklistReasons } from "@src/services/register/merchant/blacklist/getMerchantBlacklistReason";
import { MerchantBlacklistItem } from "@src/services/types/register/merchants/merchantBlacklist.interface";
import {
  CreateMerchantBlacklistReasons,
  MerchantBlacklistReasonQuery,
} from "@src/services/types/register/merchants/merchantBlacklistReasons.interface";
import { queryClient } from "@src/services/queryClient";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { ExportReportsModal } from "@src/components/Modals/exportReportsModal";
import { useCreateMerchantBlacklistReasonsReports } from "@src/services/register/merchant/blacklist/exportCsvMerchantBlacklistReason";

const INITIAL_QUERY: MerchantBlacklistReasonQuery = {
  limit: 25,
  page: 1,
};

export const MerchantBlacklistReasons = () => {
  const { t } = useTranslation();
  const { type, permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const [query, setQuery] =
    useState<MerchantBlacklistReasonQuery>(INITIAL_QUERY);
  const {
    isMerchantBlacklistDataFetching,
    merchantBlacklistData,
    merchantBlacklistDataError,
    refetchMerchantBlacklistData,
  } = useGetRowsMerchantBlacklistReasons(query);

  const {
    MerchantBlacklistReasonsReportsError,
    MerchantBlacklistReasonsReportsIsLoading,
    MerchantBlacklistReasonsReportsMutate,
    MerchantBlacklistReasonsReportsIsSuccess,
  } = useCreateMerchantBlacklistReasonsReports(query);

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateReasonOpen, setIsCreateReasonOpen] = useState(false);
  const [body, setBody] = useState<CreateMerchantBlacklistReasons | null>({
    reason_name: "",
  });
  const [currentItem, setCurrentItem] = useState<MerchantBlacklistItem | null>(
    null
  );

  const renderUpdateFields = useCallback(() => {
    if (type === 1 || type === 2) {
      if (body?.general_use) {
        return [
          { label: "general_use", required: false },
          { label: "reason_name", required: true },
        ];
      }

      return [
        { label: "general_use", required: false },
        { label: "merchant_id", required: true },
        { label: "reason_name", required: true },
      ];
    }

    return [
      { label: "merchant_id", required: true },
      { label: "reason_name", required: true },
    ];
  }, [body, type]);

  const bodyToSend = useMemo(() => {
    if (body?.general_use) {
      return {
        reason_name: body.reason_name,
      };
    }

    return {
      reason_name: body?.reason_name,
      merchant_id: body?.merchant_id,
    };
  }, [body]);

  const { error, isLoading, isSuccess, mutate } =
    useCreateMerchantBlacklistReason(bodyToSend);
  const [search, setSearch] = useState<string>("");
  const debounceSearch = useDebounce(search);

  const columns: ColumnInterface[] = [
    { name: "_id", type: "id" },
    { name: "create_user_name", type: "text" },
    { name: "merchant_name", type: "text" },
    { name: "reason_name", head: "reason", type: "text", sort: true },
    { name: "createdAt", type: "date", sort: true },
  ];

  useEffect(() => {
    refetchMerchantBlacklistData();
  }, [query]);

  useEffect(() => {
    if (!debounceSearch) {
      const q = { ...query };
      return setQuery(q);
    }
    setQuery((state) => ({ ...state, cpf: debounceSearch }));
  }, [debounceSearch]);

  return (
    <Grid container style={{ padding: "25px" }}>
      <Grid
        container
        style={{ display: "flex", alignItems: "center" }}
        spacing={1}
      >
        <Grid item xs={12} md={2} lg={2}>
          <Button
            size="large"
            style={{ width: "100%" }}
            loading={isMerchantBlacklistDataFetching}
            type="primary"
            onClick={() => setIsFiltersOpen(true)}
            icon={<FilterOutlined />}
          >
            {t("table.filters")}
          </Button>
        </Grid>
        <Grid item xs={12} md={3} lg={4}>
          <FilterChips
            initial_query={INITIAL_QUERY}
            startDateKeyName="initial_date"
            endDateKeyName="final_date"
            query={query}
            setQuery={setQuery}
          />
        </Grid>
        <Grid item xs={12} md={2} lg={2}>
          <Button
            type="dashed"
            loading={isMerchantBlacklistDataFetching}
            danger
            onClick={() => {
              setQuery(() => ({
                ...INITIAL_QUERY,
              }));
              setSearch("");
            }}
            style={{
              height: 40,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            icon={<FilterAltOffOutlinedIcon />}
          >
            {t("table.clear_filters")}
          </Button>
        </Grid>
        <Grid item xs={12} md={3} lg={2}>
          <Button
            type="primary"
            loading={isMerchantBlacklistDataFetching}
            onClick={() => setIsCreateReasonOpen(true)}
            style={{
              height: 40,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            icon={<PlusOutlined style={{ fontSize: 22 }} />}
          >
            {t("buttons.new_reason")}
          </Button>
        </Grid>

        {permissions?.register?.merchant?.black_list_reason
          ?.merchant_blacklist_reason_export_csv && (
          <Grid item xs={12} md="auto">
            <ExportReportsModal
              disabled={!merchantBlacklistData?.total || !!MerchantBlacklistReasonsReportsError}
              mutateReport={() => MerchantBlacklistReasonsReportsMutate()}
              error={MerchantBlacklistReasonsReportsError}
              success={MerchantBlacklistReasonsReportsIsSuccess}
              loading={MerchantBlacklistReasonsReportsIsLoading}
              reportPath="/register/merchant/merchant_reports/merchant_blacklist_reasons_reports"
            />
          </Grid>
        )}
      </Grid>

      <Grid container style={{ marginTop: "15px" }}>
        <Grid item xs={12}>
          <CustomTable
            query={query}
            setCurrentItem={setCurrentItem}
            setQuery={setQuery}
            data={merchantBlacklistData}
            items={merchantBlacklistData?.items}
            error={merchantBlacklistDataError}
            columns={columns}
            refetch={refetchMerchantBlacklistData}
            disableActions
            loading={isMerchantBlacklistDataFetching}
            label={["merchant_name", "reason_name"]}
            actions={[{}]}
          />
        </Grid>
      </Grid>

      <FiltersModal
        open={isFiltersOpen}
        setOpen={setIsFiltersOpen}
        query={query}
        setQuery={setQuery}
        filters={["start_date", "end_date"]}
        refetch={refetchMerchantBlacklistData}
        selectOptions={{}}
        startDateKeyName="start_date"
        endDateKeyName="end_date"
        initialQuery={INITIAL_QUERY}
      />

      <MutateModal
        type="create"
        open={isCreateReasonOpen}
        setOpen={setIsCreateReasonOpen}
        fields={renderUpdateFields()}
        body={body}
        setBody={setBody}
        modalName={t("modal.new_reason")}
        submit={mutate}
        submitLoading={isLoading}
        error={error}
        success={isSuccess}
      />

      <ViewModal
        item={currentItem}
        loading={isMerchantBlacklistDataFetching}
        modalName={`${t("table.document")}: ${currentItem?.document}`}
        open={isViewModalOpen}
        setOpen={setIsViewModalOpen}
      />
    </Grid>
  );
};
