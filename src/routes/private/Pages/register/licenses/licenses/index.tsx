/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  EditOutlined,
  EyeFilled,
  FileAddOutlined,
  FilterOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { CustomTable } from "@components/CustomTable";
import { FiltersModal } from "@components/FiltersModal";
import { FilterChips } from "@components/FiltersModal/filterChips";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { Grid } from "@mui/material";
import { ViewModal } from "@src/components/Modals/viewGenericModal";
import { Button, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Search } from "@src/components/Inputs/search";
import { ExportCustomReportsModal } from "@src/components/Modals/exportCustomReportsModal";
import { MutateModal } from "@src/components/Modals/mutateGenericModal";
import { Toast } from "@src/components/Toast";
import { queryClient } from "@src/services/queryClient";
import { useGetLicenses } from "@src/services/register/licenses/getLicenses";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { useNavigate } from "react-router-dom";
import {
  LicenseItem,
  LicenseQuery,
} from "@src/services/types/register/licenses/licenses.interface";
import { useGetLicensesTotals } from "@src/services/register/licenses/getLicenseTotals";
import { TotalizersCards } from "./components/totalizersCards";
import { useGetLicenseReportFields } from "@src/services/reports/register/license/getLicenseReportFields";
import { useCreateLicense } from "@src/services/register/licenses/createLicense";
import { useCreateLicenseReports } from "@src/services/register/licenses/createLicenseReports";
import { useUpdateLicense } from "@src/services/register/licenses/updateLicense";

const INITIAL_QUERY: LicenseQuery = {
  limit: 25,
  page: 1,
  sort_field: "created_at",
  sort_order: "DESC",
};

export const Licenses = () => {
  const { t } = useTranslation();
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const user = queryClient.getQueryData("validate") as ValidateInterface;
  const [currentItem, setCurrentItem] = useState<LicenseItem | null>(null);
  const { UpdateMutate } = useUpdateLicense({
    status: !currentItem?.status,
    license_id: currentItem?.id,
  });
  const navigate = useNavigate();
  const [query, setQuery] = useState<LicenseQuery>(INITIAL_QUERY);

  const {
    LicenseData,
    LicenseDataError,
    isLicenseDataFetching,
    refetchLicenseData,
  } = useGetLicenses(query);

  /*  const LicenseData = {
    total: 20,
    items: [
      {
        country: "Brazil",
        created_at: "2024-03-18T14:27:39.070Z",
        end_validity_date: "2024-06-30T17:26:00.000Z",
        id: 36,
        indeterminate_validity: null,
        linked_merchants_total: 1,
        name: "LICENÇA HEITOR",
        start_validity_date: "2024-03-18T11:26:28.000Z",
        status: "CANCELED",
      },
    ],
  }; */

  const {
    LicenseDataTotal,
    isLicenseDataTotalDataFetching,
    isSuccessLicenseDataTotalData,
    refetchLicenseDataTotalData,
  } = useGetLicensesTotals(query);

  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [isNewLicenseModal, setIsNewLicenseModal] = useState<boolean>(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const [createBody, setCreateBody] = useState<LicenseItem>({
    name: "",
    country: "",
  });

  const [csvFields, setCsvFields] = useState<any>();
  const [comma, setIsComma] = useState<boolean>(false);
  const {
    LicenseReportsError,
    LicenseReportsIsLoading,
    LicenseReportsIsSuccess,
    LicenseReportsMutate,
    LicenseReportsData,
  } = useCreateLicenseReports({
    ...query,
    fields: csvFields,
    comma_separate_value: comma,
  });

  const { fields } = useGetLicenseReportFields();
  const [isExportReportsOpen, setIsExportReportsOpen] =
    useState<boolean>(false);

  const {
    LicenseError,
    LicenseIsLoading,
    LicenseIsSuccess,
    LicenseMutate,
    reset,
  } = useCreateLicense(createBody);

  useEffect(() => {
    isSuccessLicenseDataTotalData && refetchLicenseDataTotalData();
    isLicenseDataFetching && refetchLicenseData();
  }, [query]);

  return (
    <Grid container style={{ padding: "25px" }}>
      <Grid
        item
        xs={12}
        md={12}
        style={{ display: "flex", justifyContent: "flex-end" }}
      ></Grid>
      <Grid item xs={12}>
        <TotalizersCards
          params={query}
          loading={isLicenseDataTotalDataFetching}
          data={LicenseDataTotal || undefined}
        />
      </Grid>

      <Grid
        container
        style={{ display: "flex", alignItems: "center" }}
        spacing={1}
        mt={user.partner_id ? "-40px" : undefined}
      >
        <Grid item xs={12} md={4} lg={2}>
          <Button
            size="large"
            style={{ width: "100%" }}
            loading={isLicenseDataFetching}
            type="primary"
            onClick={() => setIsFiltersOpen(true)}
            icon={<FilterOutlined />}
          >
            {t("table.filters")}
          </Button>
        </Grid>
        <Grid item xs={12} md={8} lg={10}>
          <FilterChips
            initial_query={INITIAL_QUERY}
            startDateKeyName="start_date"
            endDateKeyName="end_date"
            query={query}
            setQuery={setQuery}
          />
        </Grid>
      </Grid>
      <Grid container style={{ marginTop: "5px" }} spacing={1}>
        <Grid item xs={12} md={4} lg={4}>
          <Search query={query} setQuery={setQuery} searchOption="search" />
        </Grid>
        <Grid item xs={12} md={2} lg={2}>
          <Button
            type="dashed"
            loading={isLicenseDataFetching}
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
        {permissions?.register?.licenses?.licenses?.license_create && (
          <Grid item xs={12} md={3} lg={2}>
            <Button
              type="primary"
              loading={isLicenseDataFetching}
              onClick={() => {
                setIsNewLicenseModal(true);
              }}
              style={{
                height: 40,
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              icon={<PlusOutlined style={{ fontSize: "20px" }} />}
            >
              {`${t("buttons.create")} ${t("buttons.new_license")}`}
            </Button>
          </Grid>
        )}

        {permissions?.register?.licenses?.licenses?.license_export_csv && (
          <Grid item xs={12} md="auto">
            <Tooltip
              placement="topRight"
              title={
                LicenseData?.total === 0 || LicenseDataError
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
                loading={isLicenseDataFetching}
                disabled={LicenseData?.total === 0 || LicenseDataError}
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
            currentItem={currentItem}
            setCurrentItem={setCurrentItem}
            setQuery={setQuery}
            actions={[
              {
                id: "table-details-button",
                label: "details",
                icon: <EyeFilled style={{ fontSize: "20px" }} />,
                onClick: () => {
                  setIsViewModalOpen(true);
                },
              },
              permissions?.register?.licenses?.licenses?.license_update && {
                id: "table-edit-button",
                label: "edit",
                icon: <EditOutlined style={{ fontSize: "20px" }} />,
                onClick: (item) => {
                  navigate("update", { state: item });
                },
              },
            ]}
            isConfirmUpdateOpen={confirmDelete}
            setIsConfirmUpdateOpen={setConfirmDelete}
            refetch={refetchLicenseData}
            update={UpdateMutate}
            data={LicenseData}
            items={LicenseData?.items}
            error={LicenseDataError}
            columns={[
              {
                name: "status",
                type: "switch",
                head: "registration_status",
                sort: true,
              },
              { name: "id", type: "id", sort: true },
              { name: "license_number", type: "text", sort: true },
              { name: "name", type: "text", sort: true },
              {
                name: "country",
                type: "country",
                sort: true,
              },
              {
                name: "indeterminate_validity",
                type: "boolean",
                sort: true,
              },
              {
                name: "linked_merchants_total",
                type: "text",
                sort: true,
              },
              {
                name: "start_validity_date",
                type: "date",
                sort: true,
              },
              {
                name: "end_validity_date",
                type: "date",
                sort: true,
              },
              { name: "validity_status", head: 'validity_date', type: "status_color" },
            ]}
            loading={isLicenseDataFetching}
            label={["name"]}
          />
        </Grid>
      </Grid>

      <FiltersModal
        open={isFiltersOpen}
        setOpen={setIsFiltersOpen}
        query={query}
        setQuery={setQuery}
        filters={["start_date", "end_date", "status"]}
        refetch={refetchLicenseData}
        selectOptions={{}}
        startDateKeyName="start_date"
        endDateKeyName="end_date"
        initialQuery={INITIAL_QUERY}
      />

      <MutateModal
        type="create"
        open={isNewLicenseModal}
        setOpen={setIsNewLicenseModal}
        fields={[
          {
            label: "validity_date",
            required: !createBody?.indeterminate_validity,
          },
          { label: "name", required: true },
          { label: "number", required: true, head: "license_number" },
          { label: "corporate_reason", head: "business_name", required: true },
          { label: "country", required: true },
          { label: "status", required: false },
          { label: "indeterminate_validity", required: false },
        ]}
        body={createBody}
        setBody={setCreateBody}
        modalName={t("modal.new_license")}
        submit={LicenseMutate}
        submitLoading={LicenseIsLoading}
        error={LicenseError}
        success={LicenseIsSuccess}
        clear={reset}
      />

      <ViewModal
        item={currentItem}
        loading={isLicenseDataFetching}
        modalName={`${t("menus.licenses")}: ${currentItem?.name}`}
        open={isViewModalOpen}
        setOpen={setIsViewModalOpen}
      />

      <Toast
        actionSuccess={t("messages.created")}
        actionError={t("messages.create")}
        error={LicenseError}
        success={LicenseIsSuccess}
      />

      <ExportCustomReportsModal
        open={isExportReportsOpen}
        setOpen={setIsExportReportsOpen}
        disabled={LicenseData?.total === 0 || LicenseDataError}
        mutateReport={() => LicenseReportsMutate()}
        error={LicenseReportsError}
        success={LicenseReportsIsSuccess}
        loading={LicenseReportsIsLoading}
        reportPath="/register/licenses/reports"
        fields={fields}
        csvFields={csvFields}
        comma={comma}
        setIsComma={setIsComma}
        setCsvFields={setCsvFields}
        reportName="License"
        url={LicenseReportsData?.url}
      />
    </Grid>
  );
};
