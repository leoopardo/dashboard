/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  EditOutlined,
  EyeFilled,
  FileAddOutlined,
  FilterOutlined,
  InfoCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { CustomTable } from "@components/CustomTable";
import { FiltersModal } from "@components/FiltersModal";
import { FilterChips } from "@components/FiltersModal/filterChips";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { Grid } from "@mui/material";
import { Search } from "@src/components/Inputs/search";
import { ExportCustomReportsModal } from "@src/components/Modals/exportCustomReportsModal";
import { MutateModal } from "@src/components/Modals/mutateGenericModal";
import { ViewModal } from "@src/components/Modals/viewGenericModal";
import { Toast } from "@src/components/Toast";
import { TuorComponent } from "@src/components/Tuor";
import { queryClient } from "@src/services/queryClient";
import { useCreateOperator } from "@src/services/register/operator/createOperator";
import { useGetOperator } from "@src/services/register/operator/getOperators";
import { useGetOperatorTotal } from "@src/services/register/operator/getOperatorsTotal";
import { useUpdateOperator } from "@src/services/register/operator/updateOperator";
import { useCreateOperatorReports } from "@src/services/reports/register/operator/createOperatorReports";
import { useGetOperatorsReportFields } from "@src/services/reports/register/operator/getOperatorReportFields";
import {
  OperatorItem,
  OperatorQuery,
} from "@src/services/types/register/operators/operators.interface";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { defaultTheme } from "@src/styles/defaultTheme";
import { Button, Tooltip, Typography } from "antd";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import { TotalizersCards } from "./components/totalizersCards";

const INITIAL_QUERY: OperatorQuery = {
  limit: 25,
  page: 1,
  sort_field: "created_at",
  sort_order: "DESC",
};

export const Operators = () => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const user = queryClient.getQueryData("validate") as ValidateInterface;
  const isMobile = useMediaQuery({ maxWidth: "950px" });
  const [query, setQuery] = useState<OperatorQuery>(INITIAL_QUERY);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    OperatorData,
    OperatorDataError,
    isOperatorDataFetching,
    refetchOperatorData,
    isSuccessOperatorData,
  } = useGetOperator(query);

  const {
    OperatorTotalData,
    isOperatorTotalDataFetching,
    isSuccessOperatorTotalData,
    refetchOperatorTotalData,
  } = useGetOperatorTotal(query);

  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [isNewCategorieModal, setIsNewCategorieModal] =
    useState<boolean>(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<OperatorItem | null>(null);
  const [createBody, setCreateBody] = useState<OperatorItem>({
    name: "",
    cnpj: "",
    country: "",
    responsible_name: "",
  });
  const [updateBody, setUpdateBody] = useState<OperatorItem>({
    ...currentItem,
    operator_id: currentItem?.id,
  });

  const {
    OperatorIsLoading,
    OperatorMutate,
    OperatorError,
    OperatorIsSuccess,
    reset,
  } = useCreateOperator(createBody);

  const { UpdateError, UpdateIsSuccess } = useUpdateOperator(updateBody);

  const [csvFields, setCsvFields] = useState<any>();
  const [comma, setIsComma] = useState<boolean>(false);
  const {
    OperatorReportsError,
    OperatorReportsIsLoading,
    OperatorReportsIsSuccess,
    OperatorReportsMutate,
  } = useCreateOperatorReports({
    ...query,
    fields: csvFields,
    comma_separate_value: comma,
  });

  const { fields } = useGetOperatorsReportFields();
  const [isExportReportsOpen, setIsExportReportsOpen] =
    useState<boolean>(false);

  const [isTuorOpen, setIsTuorOpen] = useState<boolean>(false);
  const ref = useRef(null);
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const ref5 = useRef(null);
  const refId = useRef(null);
  const refName = useRef(null);
  const refStatus = useRef(null);
  const refCreatedAt = useRef(null);

  useEffect(() => {
    if (isSuccessOperatorData) {
      refetchOperatorData();
    }
    if (isSuccessOperatorTotalData) {
      refetchOperatorTotalData();
    }
  }, [query]);

  useEffect(() => {
    setUpdateBody({
      ...currentItem,
      operator_id: currentItem?.id,
    });
  }, [currentItem]);

  return (
    <Grid container style={{ padding: "25px" }}>
      <Grid
        item
        xs={12}
        md={12}
        style={{ display: "flex", justifyContent: "flex-end" }}
      >
        <Tooltip title={t("buttons.help")}>
          <Button type="link" onClick={() => setIsTuorOpen((state) => !state)}>
            <InfoCircleOutlined />
          </Button>
        </Tooltip>
      </Grid>
      <Grid item xs={12} ref={ref}>
        {!user.operator_id && (
          <TotalizersCards
            params={query}
            loading={isOperatorTotalDataFetching}
            data={OperatorTotalData || undefined}
          />
        )}
      </Grid>

      <Grid
        container
        style={{ display: "flex", alignItems: "center" }}
        spacing={1}
        mt={!isMobile ? "-80px" : undefined}
      >
        <Grid item xs={12} md={4} lg={2}>
          <Button
            ref={ref1}
            size="large"
            style={{ width: "100%" }}
            loading={isOperatorDataFetching}
            type="primary"
            onClick={() => setIsFiltersOpen(true)}
            icon={<FilterOutlined />}
          >
            {t("table.filters")}
          </Button>
        </Grid>
        <Grid item xs={12} md={8} lg={9}>
          <FilterChips initial_query={INITIAL_QUERY}
            startDateKeyName="start_date"
            endDateKeyName="end_date"
            query={query}
            setQuery={setQuery}
          />
        </Grid>
      </Grid>

      <Grid container style={{ marginTop: "5px" }} spacing={1}>
        <Grid item xs={12} md={4} lg={4} ref={ref2}>
          <Search query={query} setQuery={setQuery} searchOption="search"  />
        </Grid>
        <Grid item xs={12} md={3} lg={2}>
          <Button
            ref={ref3}
            type="dashed"
            loading={isOperatorDataFetching}
            danger
            onClick={() => {
              setQuery(INITIAL_QUERY);
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
        {permissions.register.operator.operator.operator_create && (
          <Grid item xs={12} md={3} lg={2}>
            <Button
              ref={ref4}
              type="primary"
              loading={isOperatorDataFetching}
              onClick={() => {
                setIsNewCategorieModal(true);
              }}
              style={{
                height: 40,
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              icon={<PlusOutlined style={{ fontSize: 20 }} />}
            >
              {`${t("buttons.create")} ${t("buttons.new_operator")}`}
            </Button>
          </Grid>
        )}
        {permissions.register.paybrokers.users.paybrokers_user_export_csv && (
          <Grid item xs={12} md="auto">
            <Tooltip
              placement="topRight"
              title={
                OperatorData?.total === 0 || OperatorDataError
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
                loading={isOperatorDataFetching}
                disabled={OperatorData?.total === 0 || OperatorDataError}
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
            actions={[
              {
                label: "details",
                icon: <EyeFilled style={{ fontSize: "20px" }} />,
                onClick: (item) => {
                  navigate("details", { state: item });
                },
              },
              permissions.register.operator.operator.operator_update && {
                label: "edit",
                icon: <EditOutlined style={{ fontSize: "20px" }} />,
                onClick: (item) => {
                  navigate("update", { state: item });
                },
              },
            ]}
            refetch={refetchOperatorData}
            data={OperatorData}
            items={OperatorData?.items}
            error={OperatorDataError}
            columns={[
              { name: "id", type: "id", sort: true, key: refId },
              { name: "name", type: "text", sort: true, key: refName },
              { name: "status", type: "status", key: refStatus },
              {
                name: "created_at",
                type: "date",
                sort: true,
                key: refCreatedAt,
              },
            ]}
            loading={isOperatorDataFetching}
            label={["name", "description"]}
          />
        </Grid>
      </Grid>

      <FiltersModal
        open={isFiltersOpen}
        setOpen={setIsFiltersOpen}
        query={query}
        setQuery={setQuery}
        filters={["start_date", "end_date", "status"]}
        refetch={refetchOperatorData}
        selectOptions={{}}
        startDateKeyName="start_date"
        endDateKeyName="end_date"
        initialQuery={INITIAL_QUERY}
      />

      <MutateModal
        type="create"
        open={isNewCategorieModal}
        setOpen={setIsNewCategorieModal}
        fields={[
          { label: "name", required: true },
          { label: "cnpj", required: true },
          { label: "cellphone", required: false },
          { label: "email", required: false },
          { label: "country", required: true },
          { label: "aggregator_id", required: false },
        ]}
        body={createBody}
        setBody={setCreateBody}
        modalName={t("modal.new_operator")}
        submit={OperatorMutate}
        submitLoading={OperatorIsLoading}
        error={OperatorError}
        success={OperatorIsSuccess}
        clear={reset}
      />

      <ViewModal
        item={currentItem}
        loading={isOperatorDataFetching}
        modalName={`${t("menus.operator")}: ${currentItem?.name}`}
        open={isViewModalOpen}
        setOpen={setIsViewModalOpen}
      />

      <Toast
        actionSuccess={t("messages.updated")}
        actionError={t("messages.update")}
        error={UpdateError}
        success={UpdateIsSuccess}
      />
      <Toast
        actionSuccess={t("messages.created")}
        actionError={t("messages.create")}
        error={OperatorError}
        success={OperatorIsSuccess}
      />
      <ExportCustomReportsModal
        open={isExportReportsOpen}
        setOpen={setIsExportReportsOpen}
        disabled={OperatorData?.total === 0 || OperatorDataError}
        mutateReport={() => OperatorReportsMutate()}
        error={OperatorReportsError}
        success={OperatorReportsIsSuccess}
        loading={OperatorReportsIsLoading}
        reportPath="/register/operator/operator_reports/operator_operators_reports"
        fields={fields}
        csvFields={csvFields}
        comma={comma}
        setIsComma={setIsComma}
        setCsvFields={setCsvFields}
        reportName="Operators"
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
          }
        }
        steps={[
          {
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
    </Grid>
  );
};
