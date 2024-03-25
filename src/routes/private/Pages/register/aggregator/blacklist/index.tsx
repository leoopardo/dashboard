/* eslint-disable react-hooks/exhaustive-deps */
import {
  DeleteOutlined,
  FilterOutlined,
  InfoCircleOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { CustomTable } from "@components/CustomTable";
import { FiltersModal } from "@components/FiltersModal";
import { FilterChips } from "@components/FiltersModal/filterChips";
import { ViewModal } from "@components/Modals/viewGenericModal";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { Grid } from "@mui/material";
import { Confirmation } from "@src/components/Modals/confirmation";
import { ExportReportsModal } from "@src/components/Modals/exportReportsModal";
import { MutateModal } from "@src/components/Modals/mutateGenericModal";
import { Toast } from "@src/components/Toast";
import { TuorComponent } from "@src/components/Tuor";
import { queryClient } from "@src/services/queryClient";
import { useCreateAggregatorBlacklist } from "@src/services/register/aggregator/blacklist/createAggregatorBlacklist";
import { useDeleteAggregatorBlacklist } from "@src/services/register/aggregator/blacklist/deleteAggregatorBlacklist";
import { useGetAggregatorsBlacklist } from "@src/services/register/aggregator/blacklist/getAggregatorsBlacklist";
import { useCreateAggregatorBlacklistReports } from "@src/services/reports/register/aggregators/createAggregatorBlacklistReports";
import { AggregatorBlacklistQuery } from "@src/services/types/register/aggregators/aggregatorBlacklist.interface";
import { MerchantBlacklistItem } from "@src/services/types/register/merchants/merchantBlacklist.interface";
import { ValidateInterface } from "@src/services/types/validate.interface";
import useDebounce from "@utils/useDebounce";
import { Button, Input, Select, Space, Tooltip, Typography } from "antd";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import ReactInputMask from "react-input-mask";

const INITIAL_QUERY: AggregatorBlacklistQuery = {
  limit: 25,
  page: 1,
  sort_field: "createdAt",
  sort_order: "DESC",
};

export const AggregatorBlacklist = () => {
  const { permissions, type } = queryClient.getQueryData(
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
  const [docType, setDocType] = useState<"cpf" | "cnpj">("cpf");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [body, setBody] = useState<MerchantBlacklistItem | null>({
    document: "",
    reason: "",
    description: "",
  });
  const [currentItem, setCurrentItem] = useState<MerchantBlacklistItem | null>(
    null
  );

  const { isDeleteLoading, mutateDelete, DeleteError, isDeleteSuccess } =
    useDeleteAggregatorBlacklist({
      blacklist_id: currentItem?._id,
    });

  const {
    AggregatorReportsError,
    AggregatorReportsIsLoading,
    AggregatorReportsIsSuccess,
    AggregatorReportsMutate,
  } = useCreateAggregatorBlacklistReports(query);

  const { error, isLoading, isSuccess, mutate, reset } =
    useCreateAggregatorBlacklist(body);
  const [search, setSearch] = useState<string>("");
  const debounceSearch = useDebounce(search);

  const [isTuorOpen, setIsTuorOpen] = useState<boolean>(false);
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const ref5 = useRef(null);
  const ref6 = useRef(null);
  const refDoc = useRef(null);
  const refAggregator = useRef(null);
  const refReason = useRef(null);
  const refDescription = useRef(null);
  const refWhoAdd = useRef(null);
  const refCreatedAt = useRef(null);

  useEffect(() => {
    refetchAggregatorsBlacklistData();
  }, [query]);

  useEffect(() => {
    if (!debounceSearch) {
      const q = { ...query };
      delete q.document;
      return setQuery(q);
    }
    setQuery((state) => ({ ...state, document: debounceSearch }));
  }, [debounceSearch]);

  return (
    <Grid container style={{ padding: "25px" }}>
      <Grid
        container
        style={{ display: "flex", alignItems: "center" }}
        spacing={1}
      >
        <Grid item xs={12} md={4} lg={2}>
          <Button
            ref={ref1}
            size="large"
            style={{ width: "100%" }}
            loading={isAggregatorsBlacklistDataFetching}
            type="primary"
            onClick={() => setIsFiltersOpen(true)}
            icon={<FilterOutlined />}
          >
            {t("table.filters")}
          </Button>
        </Grid>
        <Grid item xs={12} md={7} lg={9}>
          <FilterChips
            initial_query={INITIAL_QUERY}
            startDateKeyName="start_date"
            endDateKeyName="end_date"
            query={query}
            setQuery={setQuery}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={1}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: -20,
            marginBottom: 20,
          }}
        >
          <Tooltip title={t("buttons.help")}>
            <Button
              type="link"
              onClick={() => setIsTuorOpen((state) => !state)}
            >
              <InfoCircleOutlined />
            </Button>
          </Tooltip>
        </Grid>
      </Grid>

      <Grid container style={{ marginTop: "5px" }} spacing={1}>
        <Grid item xs={12} md={4} lg={4}>
          <Space.Compact style={{ width: "100%" }} size="large">
            <Select
              size="small"
              style={{ width: "100%", maxWidth: "100px", marginBottom: 16 }}
              options={[
                { label: "CPF", value: "cpf" },
                { label: "CNPJ", value: "cnpj" },
              ]}
              value={docType}
              onChange={(value) => {
                setDocType(value);
              }}
            />
            <ReactInputMask
              value={search}
              placeholder={t("table.document") ?? ""}
              mask={docType === "cpf" ? "999.999.999-99" : "99.999.999/9999-99"}
              onChange={(event) => {
                const value = event.target.value.replace(/[^\d]/g, "");
                setSearch(value);
              }}
            >
              <Input size="large" style={{ height: "40px" }} />
            </ReactInputMask>
          </Space.Compact>
        </Grid>
        <Grid item xs={12} md={3} lg={2}>
          <Button
            ref={ref4}
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
            icon={<FilterAltOffOutlinedIcon />}
          >
            {t("table.clear_filters")}
          </Button>
        </Grid>
        {permissions?.register?.aggregator?.blacklist
          ?.aggregator_blacklist_create && (
          <Grid item xs={12} md={2} lg={2}>
            <Button
              ref={ref5}
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
              icon={<LockOutlined style={{ fontSize: "20px" }} />}
            >
              {t("buttons.create_bank_blacklist")}
            </Button>
          </Grid>
        )}

        {permissions?.register?.aggregator?.blacklist
          ?.aggregator_blacklist_export_csv && (
          <Grid item xs={12} md={2} ref={ref6}>
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
            refetch={refetchAggregatorsBlacklistData}
            columns={[
              { name: "document", type: "document", key: refDoc },
              { name: "aggregator_name", type: "text", key: refAggregator },
              { name: "reason", type: "text", sort: true, key: refReason },
              { name: "description", type: "text", key: refDescription },
              { name: "create_user_name", type: "text", key: refWhoAdd },
           /*    {
                name: "can_be_deleted_only_by_organization",
                type: "boolean",
                sort: true,
              }, */
              {
                name: "createdAt",
                type: "date",
                sort: true,
                key: refCreatedAt,
              },
            ]}
            loading={isAggregatorsBlacklistDataFetching}
            label={["document", "aggregator_name"]}
            actions={[
              {
                label: "delete",
                icon: <DeleteOutlined style={{ fontSize: "18px" }} />,
                onClick: () => setIsDeleteOpen(true),
                disabled: (item) =>
                  !permissions?.register?.merchant?.blacklist
                    ?.merchant_blacklist_delete ||
                  (item?.can_be_deleted_only_by_organization &&
                    type !== 1 &&
                    type !== 2),
              },
            ]}
          />
        </Grid>
      </Grid>

      <FiltersModal
        open={isFiltersOpen}
        setOpen={setIsFiltersOpen}
        query={query}
        setQuery={setQuery}
        filters={[
          "start_date",
          "end_date",
          "aggregator_id",
          "document_type",
          "aggregator_reason",
        ]}
        refetch={refetchAggregatorsBlacklistData}
        selectOptions={{
          document_type: ["CPF", "CNPJ"],
          can_be_deleted_only_by_organization: ["true", "false"],
        }}
        startDateKeyName="start_date"
        endDateKeyName="end_date"
        initialQuery={INITIAL_QUERY}
      />

      {isDeleteOpen && (
        <Confirmation
          open={isDeleteOpen}
          setOpen={setIsDeleteOpen}
          submit={mutateDelete}
          title={t("actions.delete")}
          description={`${t("messages.are_you_sure", {
            action: t("actions.delete").toLocaleLowerCase(),
            itens: currentItem?.document,
          })}`}
          loading={isDeleteLoading}
        />
      )}

      <MutateModal
        type="create"
        open={isUpdateModalOpen}
        setOpen={setIsUpdateModalOpen}
        fields={[
          type == 1 || type === 2
            ? {
                label: "can_be_deleted_only_by_organization",
                required: true,
              }
            : undefined,
          { label: "document", required: true },
          { label: "aggregator_id", required: true },
          { label: "aggregator_reason", required: true },
          { label: "description", required: true },
        ]}
        body={body}
        setBody={setBody}
        modalName={t("modal.new_bank_blacklist")}
        submit={mutate}
        submitLoading={isLoading}
        error={error}
        success={isSuccess}
        clear={reset}
      />

      <ViewModal
        item={currentItem}
        loading={isAggregatorsBlacklistDataFetching}
        modalName={`${t("table.document")}: ${currentItem?.document}`}
        open={isViewModalOpen}
        setOpen={setIsViewModalOpen}
      />

      <TuorComponent
        open={isTuorOpen}
        setOpen={setIsTuorOpen}
        searchFilterStepRef={ref1}
        removeFiltersStepRef={ref4}
        createRegisterStep={
          permissions?.register?.aggregator?.users?.aggregator_user_create && {
            title: t("wiki.register_self_exclusion"),
            description: t("wiki.register_self_exclusion_descriptions"),
            target: () => ref5.current,
          }
        }
        exportCsvStep={
          permissions?.register?.aggregator?.users
            ?.aggregator_user_export_csv && {
            title: t("wiki.generate_reports"),
            description: (
              <Typography>
                {t("wiki.generate_reports_descriptions")}{" "}
                <Typography.Link
                  href="/register/aggregator/aggregator_reports/aggregator_blacklist_reports"
                  target="_blank"
                >
                  {t("menus.aggregators")} | {t("menus.reports")} |{" "}
                  {t("menus.aggregator_blacklist_blacklist")}
                </Typography.Link>
              </Typography>
            ),
            target: () => ref6.current,
          }
        }
        steps={[
          {
            title: t("wiki.search_by_reason"),
            description: t("wiki.search_by_reason_description"),
            target: () => ref2.current,
          },
          {
            title: t("wiki.search_by_cpf"),
            description: t("wiki.search_by_cpf_description"),
            target: () => ref3.current,
          },
          {
            title: t("table.document"),
            description: t("wiki.document_description"),
            target: () => refDoc.current,
          },
          {
            title: t("table.merchant"),
            description: t("wiki.aggregator_description"),
            target: () => refAggregator.current,
          },
          {
            title: t("table.reason"),
            description: t("wiki.reason_description"),
            target: () => refReason.current,
          },
          {
            title: t("table.description"),
            description: t("wiki.description_description"),
            target: () => refDescription.current,
          },
          {
            title: t("table.create_user_name"),
            description: t("wiki.create_user_name_description"),
            target: () => refWhoAdd.current,
          },
          {
            title: t("table.createdAt"),
            description: t("wiki.created_at_description"),
            target: () => refCreatedAt.current,
          },
        ]}
        pageStep={{
          title: t("menus.aggregator_blacklist_blacklist"),
          description: t("wiki.aggregator_blacklist_description"),
        }}
      />
      <Toast
        actionError={t("messages.create")}
        actionSuccess={t("messages.created")}
        error={error}
        success={isSuccess}
      />

      <Toast
        actionError={t("messages.delete")}
        actionSuccess={t("messages.deleted")}
        error={DeleteError}
        success={isDeleteSuccess}
      />
    </Grid>
  );
};
