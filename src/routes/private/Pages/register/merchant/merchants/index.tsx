/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  BankOutlined,
  EditOutlined,
  EyeFilled,
  FileAddOutlined,
  FilterOutlined,
  PlusOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { ColumnInterface, CustomTable } from "@components/CustomTable";
import { FiltersModal } from "@components/FiltersModal";
import { FilterChips } from "@components/FiltersModal/filterChips";
import { MutateModal } from "@components/Modals/mutateGenericModal";
import { Toast } from "@components/Toast";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { Grid } from "@mui/material";
import { useGetRowsMerchantRegister } from "@services/register/merchant/merchant/getMerchants";
import { useUpdateMerchant } from "@services/register/merchant/merchant/updateMerchant";
import {
  MerchantsItem,
  MerchantsQuery,
} from "@services/types/register/merchants/merchantsRegister.interface";
import { ExportCustomReportsModal } from "@src/components/Modals/exportCustomReportsModal";
import { TuorComponent } from "@src/components/Tuor";
import { queryClient } from "@src/services/queryClient";
import { useCreateMerchant } from "@src/services/register/merchant/merchant/createMerchant";
import { useGetMerchantsTotals } from "@src/services/register/merchant/merchant/getMerchantsTotals";
import { useCreateMerchantReports } from "@src/services/reports/register/merchant/createMerchantReports";
import { useGetMerchantReportFields } from "@src/services/reports/register/merchant/getMerchantReportFields";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { defaultTheme } from "@src/styles/defaultTheme";
import { Button, Input, Tabs, Tooltip, Typography } from "antd";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import { ViewMerchantModal } from "./components/ViewMerchantModal";
import { TotalizerPerBanks } from "./components/totalizerPerBank";
import { TotalizersCards } from "./components/totalizersCards";
import { UpdateBanks } from "./components/updatebanks";

const INITIAL_QUERY: MerchantsQuery = {
  limit: 25,
  page: 1,
  sort_field: "created_at",
  sort_order: "DESC",
};

export const MerchantView = () => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const isMobile = useMediaQuery({ maxWidth: "950px" });
  const user = queryClient.getQueryData("validate") as ValidateInterface;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState<MerchantsQuery>(INITIAL_QUERY);
  const [activeTotalizer, setActiveTotalizer] = useState<
    "total_banks" | "total_merchants"
  >("total_banks");
  const {
    MerchantData,
    MerchantDataError,
    isMerchantDataFetching,
    isSuccessMerchantData,
    refetchMerchantData,
  } = useGetRowsMerchantRegister(query);

  const {
    MerchantTotalsData,
    isMerchantTotalsDataFetching,
    isSuccessMerchantTotalsData,
    refetchMerchantTotalsData,
  } = useGetMerchantsTotals(query);

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isNewMerchantModal, setIsNewMerchantModal] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<MerchantsItem | null>(null);
  const [isUpdatebankOpen, setIsUpdateBankOpen] = useState<boolean>(false);

  const [updateBody, setUpdateBody] = useState<MerchantsItem>({
    ...currentItem,
    merchant_id: currentItem?.id,
  });
  const [createBody, setCreateBody] = useState<MerchantsItem>({
    ...currentItem,
    partner_id: user?.partner_id,
  });

  const {
    CreateError,
    CreateIsLoading,
    CreateIsSuccess,
    CreateMutate,
    ClearCreate,
  } = useCreateMerchant({ ...createBody, v3_id: Number(createBody?.v3_id) });
  const {
    UpdateError,
    UpdateIsLoading,
    UpdateIsSuccess,
    UpdateMutate,
    UpdateReset,
  } = useUpdateMerchant(updateBody);

  const [csvFields, setCsvFields] = useState<any>();
  const [comma, setIsComma] = useState<boolean>(false);
  const {
    MerchantReportsError,
    MerchantReportsIsLoading,
    MerchantReportsIsSuccess,
    MerchantReportsMutate,
    MerchantReset,
  } = useCreateMerchantReports({
    ...query,
    fields: csvFields,
    comma_separate_value: comma,
  });

  const { fields } = useGetMerchantReportFields();
  const [isExportReportsOpen, setIsExportReportsOpen] =
    useState<boolean>(false);

  const [, setSearch] = useState<string>("");
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<
    (MerchantsItem | undefined | { id: number })[] | null | undefined
  >(null);
  const searchref = useRef<any>(null);

  const columns: ColumnInterface[] = [
    { name: "id", type: "id", sort: true },
    { name: "name", type: "text", sort: true },
    { name: "domain", type: "text", sort: true },
    { name: ["partner", "name"], head: "partner", type: "text" },
    {
      name: ["merchantConfig", "cash_in_bank"],
      head: "deposit_bank",
      type: "bankNameToIcon",
    },
    {
      name: ["merchantConfig", "cash_out_bank"],
      head: "withdraw_bank",
      type: "bankNameToIcon",
    },
    {
      name: ["merchantConfig", "fastpix_in_bank"],
      head: "fastpix_in_bank",
      type: "bankNameToIcon",
    },
    { name: "status", type: "status" },
    { name: "created_at", type: "date", sort: true },
  ];

  useEffect(() => {
    const id = currentItem?.id;
    isConfigOpen && navigate(`${id}`);
  }, [isConfigOpen]);

  useEffect(() => {
    isSuccessMerchantData && refetchMerchantData();
    isSuccessMerchantTotalsData && refetchMerchantTotalsData();
  }, [query]);

  useEffect(() => {
    setUpdateBody({
      ...currentItem,
      merchant_id: currentItem?.id,
    });
  }, [currentItem]);

  const [isTuorOpen, setIsTuorOpen] = useState<boolean>(false);
  const ref = useRef(null);
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const ref5 = useRef(null);
  const refPerBanks = useRef(null);
  const refId = useRef(null);
  const refName = useRef(null);
  const refStatus = useRef(null);
  const refCreatedAt = useRef(null);

  const TotalizersTabs = [];
  if ([1, 2].includes(user.type)) {
    TotalizersTabs.push({
      label: `${t("titles.merchants_per_bank")}`,
      key: "total_banks",
      children: <TotalizerPerBanks query={query} ref={refPerBanks} />,
    });
  }

  if (!user.merchant_id) {
    TotalizersTabs.push({
      label: `${t("titles.total", {
        entity: t("menus.merchants")?.toLowerCase(),
      })}`,
      key: "total_merchants",
      children: (
        <TotalizersCards
          params={query}
          loading={isMerchantTotalsDataFetching}
          data={MerchantTotalsData || undefined}
        />
      ),
    });
  }

  return (
    <Grid container style={{ padding: "25px" }}>
      {/* <Grid
        item
        xs={12}
        md={12}
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: -50,
        }}
      >
        <Tooltip title={t("buttons.help")}>
          <Button
            style={{ zIndex: 999 }}
            type="link"
            onClick={() => setIsTuorOpen((state) => !state)}
          >
            <InfoCircleOutlined />
          </Button>
        </Tooltip>
      </Grid> */}
      {!user.merchant_id && (
        <Grid item xs={12} ref={refPerBanks}>
          <Grid item xs={12} ref={ref}>
            <Tabs
              items={TotalizersTabs}
              activeKey={activeTotalizer}
              onChange={(key: any) => setActiveTotalizer(key)}
            />
          </Grid>
        </Grid>
      )}

      <Grid
        container
        style={{ display: "flex", alignItems: "center" }}
        spacing={1}
        mt={
          user.merchant_id
            ? "-5px"
            : !isMobile &&
              MerchantTotalsData &&
              MerchantTotalsData?.registered_merchant_totals > 0 &&
              TotalizersTabs.length > 0
            ? "-80px"
            : undefined
        }
      >
        <Grid item xs={12} md={4} lg={2}>
          <Button
            ref={ref1}
            size="large"
            style={{ width: "100%" }}
            loading={isMerchantDataFetching}
            type="primary"
            onClick={() => setIsFiltersOpen(true)}
            icon={<FilterOutlined />}
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
        <Grid item xs={12} md={6} lg={4} ref={ref2}>
          <Input.Search
            size="large"
            ref={searchref}
            placeholder={t("table.search") || ""}
            onSearch={(value) =>
              setQuery((state) => ({ ...state, name: value }))
            }
          />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <Button
            ref={ref3}
            type="dashed"
            loading={isMerchantDataFetching}
            danger
            onClick={() => {
              setQuery(INITIAL_QUERY);
              setTimeout(() => {
                searchref.current.input.value = "";
              }, 1000);

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
        {permissions.register.merchant.merchant.merchant_config_banks && (
          <Grid item xs={12} md={4} lg={2}>
            <Button
              type="primary"
              loading={isMerchantDataFetching}
              onClick={() => {
                setIsUpdateBankOpen(true);
              }}
              style={{
                height: 40,
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              icon={<BankOutlined style={{ fontSize: 22 }} />}
            >
              {`${t("buttons.update")} ${t("table.bank")}`}
            </Button>
          </Grid>
        )}
        {permissions.register.merchant.merchant.merchant_create && (
          <Grid item xs={12} md={4} lg={2}>
            <Button
              ref={ref4}
              type="primary"
              loading={isMerchantDataFetching}
              onClick={() => {
                MerchantReset();
                setIsNewMerchantModal(true);
              }}
              style={{
                height: 40,
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              icon={<PlusOutlined style={{ fontSize: 22 }} />}
            >
              {`${t("buttons.create")} ${t("table.merchant")}`}
            </Button>
          </Grid>
        )}

        {permissions.register.merchant.merchant.merchant_export_csv && (
          <Grid item xs={12} md={"auto"}>
            <Tooltip
              placement="topRight"
              title={
                MerchantData?.total === 0 || MerchantDataError
                  ? t("messages.no_records_to_export")
                  : t("messages.export_csv")
              }
              arrow
            >
              <Button
                ref={ref5}
                onClick={() => setIsExportReportsOpen(true)}
                style={{ width: "100%" }}
                shape="round"
                type="dashed"
                size="large"
                loading={isMerchantDataFetching}
                disabled={MerchantData?.total === 0 || MerchantDataError}
                icon={<FileAddOutlined style={{ fontSize: 22 }} />}
              >
                CSV
              </Button>
            </Tooltip>
          </Grid>
        )}
      </Grid>
      <Grid container style={{ marginTop: "15px" }}>
        <Grid item xs={12}>
          <CustomTable
            query={query}
            setCurrentItem={setCurrentItem}
            setQuery={setQuery}
            data={MerchantData}
            items={MerchantData?.items}
            error={MerchantDataError}
            columns={columns}
            loading={isMerchantDataFetching}
            label={[
              "name",
              "merchantConfig.cash_in_bank",
              "merchantConfig.cash_out_bank",
            ]}
            checkbox
            setSelectedRows={setSelectedItems}
            selectedKeys={selectedItems}
            actions={[
              permissions.register.merchant.merchant.merchant_list && {
                label: "details",
                icon: <EyeFilled style={{ fontSize: "20px" }} />,
                onClick: (item) => {
                  navigate("details", { state: item });
                },
              },
              permissions.register.merchant.merchant.merchant_update && {
                label: "edit",
                icon: <EditOutlined style={{ fontSize: "20px" }} />,
                onClick: (item) => {
                  UpdateReset();
                  navigate("update", { state: item });
                },
              },
              (permissions.register.merchant.merchant.merchant_config_banks ||
                permissions.register.merchant.merchant
                  .merchant_config_credentials ||
                permissions.register.merchant.merchant.merchant_config_fees ||
                permissions.register.merchant.merchant.merchant_config_ips ||
                permissions.register.merchant.merchant
                  .merchant_config_merchant ||
                permissions.register.merchant.merchant
                  .merchant_config_paybrokers) && {
                label: "configs",
                icon: <ToolOutlined style={{ fontSize: "20px" }} />,
                onClick: () => setIsConfigOpen(true),
              },
            ]}
          />
        </Grid>
      </Grid>

      {isUpdateModalOpen && (
        <MutateModal
          type="update"
          open={isUpdateModalOpen}
          setOpen={setIsUpdateModalOpen}
          fields={[
            { label: "name", required: false },
            { label: "domain", required: false },
            { label: "v3_id", required: false },
            { label: "partner_id", required: true },
            { label: "aggregator_id", required: false },
            { label: "operator_id", required: false },
            { label: "cnpj", required: false },
            { label: "cellphone", required: false },
            { label: "email", required: false },
          ]}
          body={updateBody}
          setBody={setUpdateBody}
          modalName={t("modal.modal_update_merchant")}
          submit={UpdateMutate}
          submitLoading={UpdateIsLoading}
          error={UpdateError}
          success={UpdateIsSuccess}
          clear={UpdateReset}
        />
      )}

      {isViewModalOpen && (
        <ViewMerchantModal
          item={currentItem}
          loading={isMerchantDataFetching}
          modalName={`${t("menus.merchant")}: ${currentItem?.name}`}
          open={isViewModalOpen}
          setOpen={setIsViewModalOpen}
        />
      )}

      {isUpdatebankOpen && (
        <UpdateBanks
          open={isUpdatebankOpen}
          setOpen={setIsUpdateBankOpen}
          items={selectedItems}
          setItems={setSelectedItems}
        />
      )}

      {isFiltersOpen && (
        <FiltersModal
          open={isFiltersOpen}
          setOpen={setIsFiltersOpen}
          query={query}
          setQuery={setQuery}
          filters={[
            "start_date",
            "end_date",
            "status",
            "aggregator_id",
            "operator_id",
            "partner_id",
            "cash_in_bank",
            "cash_out_bank",
          ]}
          refetch={refetchMerchantData}
          selectOptions={{}}
          startDateKeyName="start_date"
          endDateKeyName="end_date"
          initialQuery={INITIAL_QUERY}
        />
      )}
      {isNewMerchantModal && (
        <MutateModal
          type="create"
          open={isNewMerchantModal}
          setOpen={setIsNewMerchantModal}
          fields={[
            { label: "name", required: true },
            { label: "domain", required: true },
            { label: "v3_id", required: false },
            { label: "partner_id", required: true },
            { label: "aggregator_id", required: false },
            { label: "operator_id", required: false },
            { label: "cnpj", required: false },
            { label: "cellphone", required: false },
            { label: "email", required: false },
          ]}
          body={createBody}
          setBody={setCreateBody}
          modalName={t("modal.modal_create_merchant")}
          submit={CreateMutate}
          submitLoading={CreateIsLoading}
          error={CreateError}
          success={CreateIsSuccess}
          clear={ClearCreate}
        />
      )}

      <Toast
        actionSuccess={t("messages.updated")}
        actionError={t("messages.update")}
        error={UpdateError}
        success={UpdateIsSuccess}
      />

      <ExportCustomReportsModal
        open={isExportReportsOpen}
        setOpen={setIsExportReportsOpen}
        disabled={MerchantData?.total === 0 || MerchantDataError}
        mutateReport={() => MerchantReportsMutate()}
        error={MerchantReportsError}
        success={MerchantReportsIsSuccess}
        loading={MerchantReportsIsLoading}
        reportPath="/register/merchant/merchant_reports/merchant_merchants_reports"
        fields={fields}
        csvFields={csvFields}
        comma={comma}
        setIsComma={setIsComma}
        setCsvFields={setCsvFields}
        reportName="Merchant"
      />
      <TuorComponent
        open={isTuorOpen}
        setOpen={setIsTuorOpen}
        searchFilterStepRef={ref1}
        searchByNameStepRef={ref2}
        removeFiltersStepRef={ref3}
        createRegisterStep={
          permissions.register.operator.operator.operator_create && {
            title: t("wiki.register_operator"),
            description: t("wiki.register_operator_description"),
            target: () => ref4.current,
          }
        }
        exportCsvStep={
          permissions.register.operator.operator.operator_export_csv && {
            title: t("wiki.generate_reports"),
            description: (
              <Typography>
                {t("wiki.generate_reports_descriptions")}{" "}
                <Typography.Link
                  href="/register/operator/operator_reports/operator_operators_reports"
                  target="_blank"
                >
                  {t("menus.operator")} | {t("menus.reports")} |{" "}
                  {t("menus.operators")}
                </Typography.Link>
              </Typography>
            ),
            target: () => ref5.current,
            nextButtonProps: {
              onClick: () => setActiveTotalizer("total_banks"),
            },
          }
        }
        steps={[
          [1, 2].includes(user.type) && {
            title: t("wiki.totalizers_merchant_per_bank"),
            description: (
              <Typography>
                {t("wiki.totalizers_merchant_per_bank_description")}
                <Typography>
                  <span style={{ color: defaultTheme.colors.paid }}>
                    {t("wiki.deposit_bank")}:
                  </span>
                  {t("wiki.deposit_bank_description")}
                </Typography>
                <Typography>
                  <span style={{ color: defaultTheme.colors.error }}>
                    {t("wiki.withdraw_bank")}:
                  </span>
                  {t("wiki.withdraw_bank_description")}
                </Typography>
                <Typography>
                  <span style={{ color: defaultTheme.colors.info }}>
                    {t("wiki.fast_pix_bank")}:
                  </span>
                  {t("wiki.fast_pix_bank_description")}
                </Typography>
              </Typography>
            ),
            target: () => ref.current,
            style: { maxHeight: "100px" },
            nextButtonProps: {
              onClick: () => setActiveTotalizer("total_merchants"),
            },
          },
          !user.merchant_id && {
            title: t("wiki.totalizers"),
            description: (
              <Typography>
                {t("wiki.totalizers_description")}
                <Typography>
                  <span style={{ color: defaultTheme.colors.info }}>
                    {t("titles.total_registred", {
                      entity: t("menus.operators")?.toLowerCase(),
                    })}
                    :
                  </span>
                  {t("wiki.entity_total")}
                </Typography>
                <Typography>
                  <span style={{ color: defaultTheme.colors.success }}>
                    {t("titles.total_registred_active", {
                      entity: t("menus.operators")?.toLowerCase(),
                    })}
                    :
                  </span>
                  {t("wiki.entity_active")}
                </Typography>
                <Typography>
                  <span style={{ color: defaultTheme.colors.waiting }}>
                    {t("titles.total_registred_inactive", {
                      entity: t("menus.operators")?.toLowerCase(),
                    })}
                    :
                  </span>
                  {t("wiki.entity_inactive")}
                </Typography>
              </Typography>
            ),
            target: () => ref.current,
            style: { maxHeight: "120px" },
            prevButtonProps: {
              onClick: () => setActiveTotalizer("total_banks"),
            },
          },

          {
            title: t("table.id"),
            description: t("wiki.id_description"),
            target: () => refId.current,
          },
          {
            title: t("table.name"),
            description: t("wiki.aggregator_name_description"),
            target: () => refName.current,
          },
          {
            title: t("table.status"),
            description: t("wiki.status_description"),
            target: () => refStatus.current,
          },

          {
            title: t("table.createdAt"),
            description: t("wiki.created_at_description"),
            target: () => refCreatedAt.current,
          },
        ]}
        pageStep={{
          title: t("menus.operators"),
          description: t("wiki.operators_description"),
        }}
      />
      <Toast
        error={CreateError}
        success={CreateIsLoading}
        actionError={t("messages.create")}
        actionSuccess={t("messages.created")}
      />
    </Grid>
  );
};
