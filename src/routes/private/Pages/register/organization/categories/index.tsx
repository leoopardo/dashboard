/* eslint-disable react-hooks/exhaustive-deps */
import {
  EditOutlined,
  EyeFilled,
  FilterOutlined,
  InfoCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { CustomTable } from "@components/CustomTable";
import { FiltersModal } from "@components/FiltersModal";
import { FilterChips } from "@components/FiltersModal/filterChips";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { Grid } from "@mui/material";
import { useGetOrganizationCategories } from "@services/register/organization/categories/getCategories";
import { Search } from "@src/components/Inputs/search";
import { ExportReportsModal } from "@src/components/Modals/exportReportsModal";
import { MutateModal } from "@src/components/Modals/mutateGenericModal";
import { ViewModal } from "@src/components/Modals/viewGenericModal";
import { Toast } from "@src/components/Toast";
import { TuorComponent } from "@src/components/Tuor";
import { queryClient } from "@src/services/queryClient";
import { useCreateOrganizationCategory } from "@src/services/register/organization/categories/createCategorie";
import {
  UpdateCategoryInterface,
  useUpdateOrganizationCategory,
} from "@src/services/register/organization/categories/updateCategorie";
import { useCreateOrganizationCategoryReports } from "@src/services/reports/register/organization/createCategoryReport";
import {
  OrganizationCategoriesItem,
  OrganizationCategoriesQuery,
} from "@src/services/types/register/organization/organizationCategories.interface";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { Button, Tooltip, Typography } from "antd";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const INITIAL_QUERY: OrganizationCategoriesQuery = {
  limit: 25,
  page: 1,
  sort_field: "created_at",
  sort_order: "DESC",
};

export const OrganizationCategories = () => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const { t } = useTranslation();

  const [query, setQuery] =
    useState<OrganizationCategoriesQuery>(INITIAL_QUERY);

  const {
    CategoriesData,
    CategoriesDataError,
    isCategoriesDataFetching,
    refetchCategoriesData,
  } = useGetOrganizationCategories(query);

  const [isTuorOpen, setIsTuorOpen] = useState<boolean>(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [isNewCategorieModal, setIsNewCategorieModal] =
    useState<boolean>(false);
  const [isUpdateCategorieModalOpen, setIsUpdateCategorieModalOpen] =
    useState<boolean>(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [currentItem, setCurrentItem] =
    useState<OrganizationCategoriesItem | null>(null);
  const [createBody, setCreateBody] = useState<{
    name: string;
    description: string;
  }>({ name: "", description: "" });
  const [updateBody, setUpdateBody] = useState<UpdateCategoryInterface>({
    ...currentItem,
    status: currentItem?.status,
    entry_account_category_id: currentItem?.id,
  });
  const { isLoading, mutate, error, isSuccess, reset } =
    useCreateOrganizationCategory(createBody);

  const {
    updateError,
    updateIsLoading,
    updateMutate,
    updateSuccess,
    updateReset,
  } = useUpdateOrganizationCategory(updateBody);

  const {
    CategoryReportsError,
    CategoryReportsIsLoading,
    CategoryReportsIsSuccess,
    CategoryReportsMutate,
  } = useCreateOrganizationCategoryReports(query);

  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const ref5 = useRef(null);
  const refId = useRef(null);
  const refName = useRef(null);
  const refDescription = useRef(null);
  const refStatus = useRef(null);
  const refCreatedAt = useRef(null);

  useEffect(() => {
    refetchCategoriesData();
  }, [query]);

  useEffect(() => {
    setUpdateBody({
      ...currentItem,
      entry_account_category_id: currentItem?.id,
    });
  }, [currentItem]);

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
            loading={isCategoriesDataFetching}
            type="primary"
            onClick={() => setIsFiltersOpen(true)}
            icon={<FilterOutlined />}
          >
            {t("table.filters")}
          </Button>
        </Grid>
        <Grid item xs={12} md={7} lg={9}>
          <FilterChips
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
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <Tooltip title={t("buttons.help")}>
            <Button
              type="link"
              onClick={() => setIsTuorOpen((state) => !state)}
              icon={<InfoCircleOutlined />}
            ></Button>
          </Tooltip>
        </Grid>
      </Grid>

      <Grid container style={{ marginTop: "5px" }} spacing={1}>
        <Grid item xs={12} md={5} lg={5} ref={ref2}>
          <Search query={query} setQuery={setQuery} searchOption="name"  />
        </Grid>
        <Grid item xs={12} md={2} lg={2}>
          <Button
            ref={ref3}
            type="dashed"
            loading={isCategoriesDataFetching}
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
        {permissions.register.paybrokers.release_category
          .paybrokers_release_category_create && (
          <Grid item xs={12} md={3} lg={2}>
            <Button
              ref={ref4}
              type="primary"
              loading={isCategoriesDataFetching}
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
              {`${t("buttons.create")} ${t("buttons.new_categorie")}`}
            </Button>
          </Grid>
        )}

        {permissions.register.paybrokers.release_category
          .paybrokers_release_category_export_csv && (
          <Grid item xs={12} md="auto" ref={ref5}>
            <ExportReportsModal
              disabled={!CategoriesData?.total || CategoriesDataError}
              mutateReport={() => CategoryReportsMutate()}
              error={CategoryReportsError}
              success={CategoryReportsIsSuccess}
              loading={CategoryReportsIsLoading}
              reportPath="/register/organization/organization_reports/organization_reports_categories"
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
            actions={[
              {
                label: "details",
                icon: <EyeFilled style={{ fontSize: "20px" }} />,
                onClick: () => {
                  setIsViewModalOpen(true);
                },
              },
              permissions.register.paybrokers.release_category
                .paybrokers_release_category_update && {
                label: "edit",
                icon: <EditOutlined style={{ fontSize: "20px" }} />,
                onClick: () => {
                  setIsUpdateCategorieModalOpen(true);
                },
              },
            ]}
            refetch={refetchCategoriesData}
            data={CategoriesData}
            items={CategoriesData?.items}
            error={CategoriesDataError}
            columns={[
              { name: "id", type: "id", sort: true, key: refId },
              { name: "name", type: "text", sort: true, key: refName },
              {
                name: "description",
                type: "text",
                sort: true,
                key: refDescription,
              },
              { name: "status", type: "status", sort: true, key: refStatus },
              {
                name: "created_at",
                type: "date",
                sort: true,
                key: refCreatedAt,
              },
            ]}
            loading={isCategoriesDataFetching}
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
        refetch={refetchCategoriesData}
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
          { label: "description", required: true },
        ]}
        body={createBody}
        setBody={setCreateBody}
        modalName={t("modal.new_category")}
        submit={mutate}
        submitLoading={isLoading}
        error={error}
        success={isSuccess}
        clear={reset}
      />

      <MutateModal
        type="update"
        open={isUpdateCategorieModalOpen}
        setOpen={setIsUpdateCategorieModalOpen}
        fields={[
          { label: "name", required: true },
          { label: "description", required: true },
          { label: "status", required: false },
        ]}
        body={updateBody}
        setBody={setUpdateBody}
        modalName={t("modal.update_category")}
        submit={updateMutate}
        submitLoading={updateIsLoading}
        error={updateError}
        success={updateSuccess}
        clear={updateReset}
      />

      <ViewModal
        item={currentItem}
        loading={isCategoriesDataFetching}
        modalName={`${t("modal.category")}: ${currentItem?.name}`}
        open={isViewModalOpen}
        setOpen={setIsViewModalOpen}
      />

      <Toast
        actionSuccess={t("messages.updated")}
        actionError={t("messages.update")}
        error={updateError}
        success={updateSuccess}
      />
      <Toast
        actionSuccess={t("messages.created")}
        actionError={t("messages.create")}
        error={error}
        success={isSuccess}
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
                  href="/register/organization/organization_reports/organization_reports_categories"
                  target="_blank"
                >
                  {t("menus.organization")} | {t("menus.reports")} |{" "}
                  {t("menus.categories")}
                </Typography.Link>
              </Typography>
            ),
            target: () => ref5.current,
          }
        }
        steps={[
          {
            title: t("table.id"),
            description: t("wiki.id_description"),
            target: () => refId.current,
          },
          {
            title: t("table.name"),
            description: t("wiki.category_name_description"),
            target: () => refName.current,
          },
          {
            title: t("table.description"),
            description: t("wiki.description_description"),
            target: () => refDescription.current,
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
          title: t("menus.categories"),
          description: t("wiki.organization_categories_description"),
        }}
      />
    </Grid>
  );
};
