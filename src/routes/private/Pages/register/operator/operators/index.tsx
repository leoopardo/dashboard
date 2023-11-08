/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  EditOutlined,
  EyeFilled,
  FileAddOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { ColumnInterface, CustomTable } from "@components/CustomTable";
import { FiltersModal } from "@components/FiltersModal";
import { FilterChips } from "@components/FiltersModal/filterChips";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { Grid } from "@mui/material";
import { Search } from "@src/components/Inputs/search";
import { ExportCustomReportsModal } from "@src/components/Modals/exportCustomReportsModal";
import { MutateModal } from "@src/components/Modals/mutateGenericModal";
import { ViewModal } from "@src/components/Modals/viewGenericModal";
import { Toast } from "@src/components/Toast";
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
import { Button, Tooltip } from "antd";
import { useEffect, useState } from "react";
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
    fields: csvFields,
    comma_separate_value: comma,
  });

  const { fields } = useGetOperatorsReportFields();
  const [isExportReportsOpen, setIsExportReportsOpen] =
    useState<boolean>(false);

  const columns: ColumnInterface[] = [
    { name: "id", type: "id", sort: true },
    { name: "name", type: "text", sort: true },
    { name: "status", type: "status" },
    { name: "created_at", type: "date", sort: true },
  ];

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
      <TotalizersCards
        params={query}
        loading={isOperatorTotalDataFetching}
        data={OperatorTotalData || undefined}
      />
      <Grid
        container
        style={{ display: "flex", alignItems: "center" }}
        spacing={1}
        mt={!isMobile ? "-80px" : undefined}
      >
        <Grid item xs={12} md={4} lg={2}>
          <Button
            size="large"
            style={{ width: "100%" }}
            loading={isOperatorDataFetching}
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
        <Grid item xs={12} md={4} lg={4}>
          <Search query={query} setQuery={setQuery} searchOption="name" />
        </Grid>
        <Grid item xs={12} md={3} lg={2}>
          <Button
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
          >
            <FilterAltOffOutlinedIcon style={{ marginRight: 10 }} />{" "}
            {t("table.clear_filters")}
          </Button>
        </Grid>
        {permissions.register.operator.operator.operator_create && (
          <Grid item xs={12} md={3} lg={2}>
            <Button
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
            >
              <UserAddOutlined style={{ marginRight: 10, fontSize: 22 }} />{" "}
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
                onClick={() => setIsExportReportsOpen(true)}
                style={{ width: "100%" }}
                shape="round"
                type="dashed"
                size="large"
                loading={isOperatorDataFetching}
                disabled={OperatorData?.total === 0 || OperatorDataError}
              >
                <FileAddOutlined style={{ fontSize: 22 }} /> CSV
              </Button>
            </Tooltip>
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
            data={OperatorData}
            items={OperatorData?.items}
            error={OperatorDataError}
            columns={columns}
            loading={isOperatorDataFetching}
            label={["name", "description"]}
          />
        </Grid>
      </Grid>

      {isFiltersOpen && (
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
      )}

      {isNewCategorieModal && (
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
        />
      )}
      {isViewModalOpen && (
        <ViewModal
          item={currentItem}
          loading={isOperatorDataFetching}
          modalName={`${t("menus.operator")}: ${currentItem?.name}`}
          open={isViewModalOpen}
          setOpen={setIsViewModalOpen}
        />
      )}
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
    </Grid>
  );
};
