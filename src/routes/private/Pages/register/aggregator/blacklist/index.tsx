/* eslint-disable react-hooks/exhaustive-deps */
import { PlusOutlined } from "@ant-design/icons";
import { ColumnInterface, CustomTable } from "@components/CustomTable";
import { FiltersModal } from "@components/FiltersModal";
import { FilterChips } from "@components/FiltersModal/filterChips";
import { ViewModal } from "@components/Modals/viewGenericModal";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { Grid } from "@mui/material";
import { ExportReportsModal } from "@src/components/Modals/exportReportsModal";
import { MutateModal } from "@src/components/Modals/mutateGenericModal";
import { ReasonSelect } from "@src/components/Selects/reasonSelect";
import { queryClient } from "@src/services/queryClient";
import { useCreateAggregatorBlacklist } from "@src/services/register/aggregator/blacklist/createAggregatorBlacklist";
import { useGetAggregatorsBlacklist } from "@src/services/register/aggregator/blacklist/getAggregatorsBlacklist";
import { useCreateAggregatorBlacklistReports } from "@src/services/reports/register/aggregators/createAggregatorBlacklistReports";
import { AggregatorBlacklistQuery } from "@src/services/types/register/aggregators/aggregatorBlacklist.interface";
import { MerchantBlacklistItem } from "@src/services/types/register/merchants/merchantBlacklist.interface";
import { ValidateInterface } from "@src/services/types/validate.interface";
import useDebounce from "@utils/useDebounce";
import { Button, Input } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const INITIAL_QUERY: AggregatorBlacklistQuery = {
  limit: 25,
  page: 1,
  sort_field: "createdAt",
  sort_order: "DESC",
};

export const AggregatorBlacklist = () => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const [query, setQuery] = useState<AggregatorBlacklistQuery>(INITIAL_QUERY);
  const { t } = useTranslation();
  const {
    isAggregatorsBlacklistDataFetching,
    AggregatorsBlacklistData,
    AggregatorsBlacklistDataError,
    refetchAggregatorsBlacklistData,
  } = useGetAggregatorsBlacklist(query);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [body, setBody] = useState<MerchantBlacklistItem | null>({
    cpf: "",
    reason: "",
    description: "",
  });
  const [currentItem, setCurrentItem] = useState<MerchantBlacklistItem | null>(
    null
  );

  const {
    AggregatorReportsError,
    AggregatorReportsIsLoading,
    AggregatorReportsIsSuccess,
    AggregatorReportsMutate,
  } = useCreateAggregatorBlacklistReports(query);

  const { error, isLoading, isSuccess, mutate } =
    useCreateAggregatorBlacklist(body);
  const [search, setSearch] = useState<string>("");
  const debounceSearch = useDebounce(search);

  const columns: ColumnInterface[] = [
    { name: "cpf", type: "id" },
    { name: "merchant_name", type: "text" },
    { name: "reason", type: "text", sort: true },
    { name: "description", type: "text" },
    { name: "create_user_name", type: "text" },
    { name: "createdAt", type: "date", sort: true },
  ];

  useEffect(() => {
    refetchAggregatorsBlacklistData();
  }, [query]);

  useEffect(() => {
    if (!debounceSearch) {
      const q = { ...query };
      delete q.cpf;
      return setQuery(q);
    }
    setQuery((state) => ({ ...state, cpf: debounceSearch }));
  }, [debounceSearch]);

  return (
    <Grid container style={{ padding: "25px" }}>
      <Grid
        container
        style={{ marginTop: "20px", display: "flex", alignItems: "center" }}
        spacing={1}
      >
        <Grid item xs={12} md={4} lg={2}>
          <Button
            size="large"
            style={{ width: "100%" }}
            loading={isAggregatorsBlacklistDataFetching}
            type="primary"
            onClick={() => setIsFiltersOpen(true)}
          >
            {t("table.filters")}
          </Button>
        </Grid>
        <Grid item xs={12} md={8} lg={10}>
          <FilterChips
            startDateKeyName="start_date"
            endDateKeyName="end_date"
            query={query}
            setQuery={setQuery}
          />
        </Grid>
      </Grid>

      <Grid container style={{ marginTop: "5px" }} spacing={1}>
        <Grid item xs={12} md={2} lg={2}>
          <ReasonSelect queryOptions={query} setQueryFunction={setQuery} />
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <Input
            size="large"
            placeholder={t("table.cpf") || ""}
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12} md={3} lg={2}>
          <Button
            type="dashed"
            loading={isAggregatorsBlacklistDataFetching}
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
          >
            <FilterAltOffOutlinedIcon style={{ marginRight: 10 }} />{" "}
            {t("table.clear_filters")}
          </Button>
        </Grid>
        {permissions.register.aggregator.blacklist
          .aggregator_blacklist_create && (
          <Grid item xs={12} md={3} lg={2}>
            <Button
              type="primary"
              loading={isAggregatorsBlacklistDataFetching}
              onClick={() => setIsUpdateModalOpen(true)}
              style={{
                height: 40,
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PlusOutlined style={{ marginRight: 10, fontSize: 22 }} />{" "}
              {t("buttons.create_bank_blacklist")}
            </Button>
          </Grid>
        )}

        {permissions.register.aggregator.blacklist
          .aggregator_blacklist_export_csv && (
          <Grid item xs={12} md={2}>
            <ExportReportsModal
              disabled={
                !AggregatorsBlacklistData?.total ||
                AggregatorsBlacklistDataError
              }
              mutateReport={() => AggregatorReportsMutate()}
              error={AggregatorReportsError}
              success={AggregatorReportsIsSuccess}
              loading={AggregatorReportsIsLoading}
              reportPath="/register/aggregator/aggregator_reports/aggregator_blacklist_reports"
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
            data={AggregatorsBlacklistData}
            items={AggregatorsBlacklistData?.items}
            error={AggregatorsBlacklistDataError}
            columns={columns}
            loading={isAggregatorsBlacklistDataFetching}
            label={["cpf", "merchant_name"]}
            actions={[]}
          />
        </Grid>
      </Grid>

      {isFiltersOpen && (
        <FiltersModal
          open={isFiltersOpen}
          setOpen={setIsFiltersOpen}
          query={query}
          setQuery={setQuery}
          filters={["start_date", "end_date", "merchant_id"]}
          refetch={refetchAggregatorsBlacklistData}
          selectOptions={{}}
          startDateKeyName="start_date"
          endDateKeyName="end_date"
          initialQuery={INITIAL_QUERY}
        />
      )}

      {isUpdateModalOpen && (
        <MutateModal
          type="create"
          open={isUpdateModalOpen}
          setOpen={setIsUpdateModalOpen}
          fields={[
            { label: "cpf", required: true },
            { label: "reason", required: true },
            { label: "description", required: true },
          ]}
          body={body}
          setBody={setBody}
          modalName={t("modal.new_bank_blacklist")}
          submit={mutate}
          submitLoading={isLoading}
          error={error}
          success={isSuccess}
        />
      )}

      {isViewModalOpen && (
        <ViewModal
          item={currentItem}
          loading={isAggregatorsBlacklistDataFetching}
          modalName={`CPF: ${currentItem?.cpf}`}
          open={isViewModalOpen}
          setOpen={setIsViewModalOpen}
        />
      )}
    </Grid>
  );
};
