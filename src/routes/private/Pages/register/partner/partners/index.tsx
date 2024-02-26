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
import { ViewModal } from "@src/components/Modals/viewGenericModal";
import { useGetPartnersTotals } from "@src/services/register/partner/getPartnersTotals";
import { Button, Tooltip, Typography } from "antd";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { Search } from "@src/components/Inputs/search";
import { ExportCustomReportsModal } from "@src/components/Modals/exportCustomReportsModal";
import { MutateModal } from "@src/components/Modals/mutateGenericModal";
import { Toast } from "@src/components/Toast";
import { TuorComponent } from "@src/components/Tuor";
import { queryClient } from "@src/services/queryClient";
import { useCreatePartner } from "@src/services/register/partner/createPartner";
import { useGetPartners } from "@src/services/register/partner/getPartners";
import { useUpdatePartner } from "@src/services/register/partner/updatePartner";
import { useCreatePartnerReports } from "@src/services/reports/register/partner/createPartnerReports";
import { useGetPartnersReportFields } from "@src/services/reports/register/partner/getPartnerReportFields";
import {
  PartnerItem,
  PartnerQuery,
} from "@src/services/types/register/partners/partners.interface";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { defaultTheme } from "@src/styles/defaultTheme";
import { useNavigate } from "react-router-dom";
import { TotalizersCards } from "./components/totalizersCards";

const INITIAL_QUERY: PartnerQuery = {
  limit: 25,
  page: 1,
  sort_field: "created_at",
  sort_order: "DESC",
};

export const Partners = () => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const user = queryClient.getQueryData("validate") as ValidateInterface;
  const navigate = useNavigate();
  const [query, setQuery] = useState<PartnerQuery>(INITIAL_QUERY);
  const { t } = useTranslation();

  const {
    PartnersData,
    PartnersDataError,
    isPartnersDataFetching,
    isSuccessPartnersData,
    refetchPartnersData,
  } = useGetPartners(query);

  const {
    PartnersTotalsData,
    isPartnersTotalsDataFetching,
    isSuccessPartnersTotalsData,
    refetchPartnersTotalsData,
  } = useGetPartnersTotals(query);
  const [isTuorOpen, setIsTuorOpen] = useState<boolean>(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [isNewCategorieModal, setIsNewCategorieModal] =
    useState<boolean>(false);
  const [isUpdateCategorieModalOpen, setIsUpdateCategorieModalOpen] =
    useState<boolean>(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<PartnerItem | null>(null);
  const [createBody, setCreateBody] = useState<PartnerItem>({
    name: "",
    cnpj: "",
    country: "",
    responsible_name: "",
  });
  const [updateBody, setUpdateBody] = useState<PartnerItem>({
    ...currentItem,
    partner_id: currentItem?.id,
  });

  const [csvFields, setCsvFields] = useState<any>();
  const [comma, setIsComma] = useState<boolean>(false);
  const {
    PartnerReportsError,
    PartnerReportsIsLoading,
    PartnerReportsIsSuccess,
    PartnerReportsMutate,
  } = useCreatePartnerReports({
    ...query,
    fields: csvFields,
    comma_separate_value: comma,
  });

  const { fields } = useGetPartnersReportFields();
  const [isExportReportsOpen, setIsExportReportsOpen] =
    useState<boolean>(false);

  const {
    PartnerIsLoading,
    PartnerMutate,
    PartnerError,
    PartnerIsSuccess,
    reset,
  } = useCreatePartner(createBody);

  const {
    UpdateError,
    UpdateIsLoading,
    UpdateMutate,
    UpdateIsSuccess,
    UpdateReset,
  } = useUpdatePartner(updateBody);

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
    isSuccessPartnersTotalsData && refetchPartnersTotalsData();
    isSuccessPartnersData && refetchPartnersData();
  }, [query]);

  useEffect(() => {
    setUpdateBody({
      ...currentItem,
      partner_id: currentItem?.id,
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
      {!user.partner_id && (
        <Grid item xs={12} ref={ref}>
          <TotalizersCards
            params={query}
            loading={isPartnersTotalsDataFetching}
            data={PartnersTotalsData || undefined}
          />
        </Grid>
      )}

      <Grid
        container
        style={{ display: "flex", alignItems: "center" }}
        spacing={1}
        mt={user.partner_id ? "-40px" : undefined}
      >
        <Grid item xs={12} md={4} lg={2}>
          <Button
            ref={ref1}
            size="large"
            style={{ width: "100%" }}
            loading={isPartnersDataFetching}
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
        <Grid item xs={12} md={4} lg={4} ref={ref2}>
          <Search query={query} setQuery={setQuery} searchOption="name" />
        </Grid>
        <Grid item xs={12} md={2} lg={2}>
          <Button
            ref={ref3}
            type="dashed"
            loading={isPartnersDataFetching}
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
        {permissions.register.partner.partner.partner_create && (
          <Grid item xs={12} md={3} lg={2}>
            <Button
              ref={ref4}
              type="primary"
              loading={isPartnersDataFetching}
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
              icon={<PlusOutlined style={{ fontSize: "20px" }} />}
            >
              {`${t("buttons.create")} ${t("buttons.new_partner")}`}
            </Button>
          </Grid>
        )}

        {permissions.register.partner.partner.partner_export_csv && (
          <Grid item xs={12} md="auto" ref={ref5}>
            <Tooltip
              placement="topRight"
              title={
                PartnersData?.total === 0 || PartnersDataError
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
                loading={isPartnersDataFetching}
                disabled={PartnersData?.total === 0 || PartnersDataError}
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
                id: "table-details-button",
                label: "details",
                icon: <EyeFilled style={{ fontSize: "20px" }} />,
                onClick: (item) => {
                  navigate("details", { state: item });
                },
              },
              permissions.register.partner.partner.partner_update && {
                id: "table-edit-button",
                label: "edit",
                icon: <EditOutlined style={{ fontSize: "20px" }} />,
                onClick: (item) => {
                  navigate("update", { state: item });
                },
              },
            ]}
            refetch={refetchPartnersData}
            data={PartnersData}
            items={PartnersData?.items}
            error={PartnersDataError}
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
            loading={isPartnersDataFetching}
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
        refetch={refetchPartnersData}
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
          { label: "cnpj", required: false },
          { label: "cellphone", required: false },
          { label: "email", required: false },
          { label: "country", required: true },
        ]}
        body={createBody}
        setBody={setCreateBody}
        modalName={t("modal.new_partner")}
        submit={PartnerMutate}
        submitLoading={PartnerIsLoading}
        error={PartnerError}
        success={PartnerIsSuccess}
        clear={reset}
      />
      <MutateModal
        type="update"
        open={isUpdateCategorieModalOpen}
        setOpen={setIsUpdateCategorieModalOpen}
        fields={[
          { label: "name", required: false },
          { label: "cnpj", required: false },
          { label: "cellphone", required: false },
          { label: "email", required: false },
          { label: "country", required: false },
        ]}
        body={updateBody}
        setBody={setUpdateBody}
        modalName={t("modal.update_category")}
        submit={UpdateMutate}
        submitLoading={UpdateIsLoading}
        error={UpdateError}
        success={UpdateIsSuccess}
        clear={UpdateReset}
      />

      <ViewModal
        item={currentItem}
        loading={isPartnersDataFetching}
        modalName={`${t("menus.partner")}: ${currentItem?.name}`}
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
        error={PartnerError}
        success={PartnerIsSuccess}
      />
      <TuorComponent
        open={isTuorOpen}
        setOpen={setIsTuorOpen}
        searchFilterStepRef={ref1}
        searchByNameStepRef={ref2}
        removeFiltersStepRef={ref3}
        createRegisterStep={
          permissions.register.paybrokers.release_category
            .paybrokers_release_category_create && {
            title: t("wiki.register_categories"),
            description: t("wiki.register_categories_description"),
            target: () => ref4.current,
          }
        }
        exportCsvStep={
          permissions.register.paybrokers.release_category
            .paybrokers_release_category_export_csv && {
            title: t("wiki.generate_reports"),
            description: (
              <Typography>
                {t("wiki.generate_reports_descriptions")}{" "}
                <Typography.Link
                  href="/register/partner/partner_reports/partner_partners_reports"
                  target="_blank"
                >
                  {t("menus.partner")} | {t("menus.reports")} |{" "}
                  {t("menus.partner_partners_reports")}
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
                      entity: t("menus.partners")?.toLowerCase(),
                    })}
                    :
                  </span>
                  {t("wiki.entity_total")}
                </Typography>
                <Typography>
                  <span style={{ color: defaultTheme.colors.success }}>
                    {t("titles.total_registred_active", {
                      entity: t("menus.partners")?.toLowerCase(),
                    })}
                    :
                  </span>
                  {t("wiki.entity_active")}
                </Typography>
                <Typography>
                  <span style={{ color: defaultTheme.colors.waiting }}>
                    {t("titles.total_registred_inactive", {
                      entity: t("menus.partners")?.toLowerCase(),
                    })}
                    :
                  </span>
                  {t("wiki.entity_inactive")}
                </Typography>
              </Typography>
            ),
            target: () => ref.current,
          },

          {
            title: t("table.id"),
            description: t("wiki.id_description"),
            target: () => refId.current,
          },
          {
            title: t("table.name"),
            description: t("wiki.partner_name_description"),
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
          title: t("menus.partners"),
          description: t("wiki.partners_description"),
        }}
      />
      <ExportCustomReportsModal
        open={isExportReportsOpen}
        setOpen={setIsExportReportsOpen}
        disabled={PartnersData?.total === 0 || PartnersDataError}
        mutateReport={() => PartnerReportsMutate()}
        error={PartnerReportsError}
        success={PartnerReportsIsSuccess}
        loading={PartnerReportsIsLoading}
        reportPath="/register/partner/partner_reports/partner_partners_reports"
        fields={fields}
        csvFields={csvFields}
        comma={comma}
        setIsComma={setIsComma}
        setCsvFields={setCsvFields}
        reportName="Partner"
      />
    </Grid>
  );
};
