/* eslint-disable react-hooks/exhaustive-deps */
import { Grid } from "@mui/material";
import { Button, Input } from "antd";
import { useEffect, useState } from "react";
import { FilterChips } from "@components/FiltersModal/filterChips";
import { useTranslation } from "react-i18next";
import { FiltersModal } from "@components/FiltersModal";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { ColumnInterface, CustomTable } from "@components/CustomTable";
import useDebounce from "@utils/useDebounce";
import { EditOutlined, EyeFilled, UserAddOutlined } from "@ant-design/icons";
import { useGetOrganizationCategories } from "@services/register/organization/categories/getCategories";
import {
  OrganizationCategoriesItem,
  OrganizationCategoriesQuery,
} from "@src/services/types/register/organization/organizationCategories.interface";
import { MutateModal } from "@src/components/Modals/mutateGenericModal";
import { useCreateOrganizationCategory } from "@src/services/register/organization/categories/createCategorie";
import { ViewModal } from "@src/components/Modals/viewGenericModal";
import {
  UpdateCategoryInterface,
  useUpdateOrganizationCategory,
} from "@src/services/register/organization/categories/updateCategorie";
import { Toast } from "@src/components/Toast";
import { ExportReportsModal } from "@src/components/Modals/exportReportsModal";
import { useCreateOrganizationCategoryReports } from "@src/services/reports/register/organization/createCategoryReport";
import { queryClient } from "@src/services/queryClient";
import { ValidateInterface } from "@src/services/types/validate.interface";

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

  const [query, setQuery] =
    useState<OrganizationCategoriesQuery>(INITIAL_QUERY);
  const { t } = useTranslation();

  const {
    CategoriesData,
    CategoriesDataError,
    isCategoriesDataFetching,
    refetchCategoriesData,
  } = useGetOrganizationCategories(query);

  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [isNewCategorieModal, setIsNewCategorieModal] =
    useState<boolean>(false);
  const [isUpdateCategorieModalOpen, setIsUpdateCategorieModalOpen] =
    useState<boolean>(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [currentItem, setCurrentItem] =
    useState<OrganizationCategoriesItem | null>(null);
  const [search, setSearch] = useState<string>("");
  const debounceSearch = useDebounce(search);
  const [createBody, setCreateBody] = useState<{
    name: string;
    description: string;
  }>({ name: "", description: "" });
  const [updateBody, setUpdateBody] = useState<UpdateCategoryInterface>({
    ...currentItem,
    status: currentItem?.status,
    entry_account_category_id: currentItem?.id,
  });
  const { isLoading, mutate, error, isSuccess } =
    useCreateOrganizationCategory(createBody);

  const { updateError, updateIsLoading, updateMutate, updateSuccess } =
    useUpdateOrganizationCategory(updateBody);

  const {
    CategoryReportsError,
    CategoryReportsIsLoading,
    CategoryReportsIsSuccess,
    CategoryReportsMutate,
  } = useCreateOrganizationCategoryReports(query);

  const columns: ColumnInterface[] = [
    { name: "id", type: "id" },
    { name: "name", type: "text" },
    { name: "description", type: "text" },
    { name: "status", type: "boolean" },
    { name: "created_at", type: "date" },
  ];

  useEffect(() => {
    refetchCategoriesData();
  }, [query]);

  useEffect(() => {
    if (!debounceSearch) {
      const q = { ...query };
      delete q.name;
      return setQuery(q);
    }
    setQuery((state) => ({ ...state, name: debounceSearch }));
  }, [debounceSearch]);

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
            style={{ width: "100%", height: 40 }}
            loading={isCategoriesDataFetching}
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
          <Input
            size="large"
            placeholder={t("table.name") || ""}
            onChange={(event) => {
              setSearch(event.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12} md={3} lg={2}>
          <Button
            type="dashed"
            loading={isCategoriesDataFetching}
            danger
            onClick={() => {
              setQuery(INITIAL_QUERY);
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
        {permissions.register.paybrokers.release_category
          .paybrokers_release_category_create && (
          <Grid item xs={12} md={3} lg={2}>
            <Button
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
            >
              <UserAddOutlined style={{ marginRight: 10, fontSize: 22 }} />{" "}
              {`${t("buttons.create")} ${t("buttons.new_categorie")}`}
            </Button>
          </Grid>
        )}

        {permissions.register.paybrokers.release_category
          .paybrokers_release_category_export_csv && (
          <Grid item xs={12} md="auto">
            <ExportReportsModal
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
          {" "}
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
            data={CategoriesData}
            items={CategoriesData?.items}
            error={CategoriesDataError}
            columns={columns}
            loading={isCategoriesDataFetching}
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
          refetch={refetchCategoriesData}
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
            { label: "description", required: true },
          ]}
          body={createBody}
          setBody={setCreateBody}
          modalName={t("modal.new_category")}
          submit={mutate}
          submitLoading={isLoading}
          error={error}
          success={isSuccess}
        />
      )}
      {isUpdateCategorieModalOpen && (
        <MutateModal
          type="update"
          open={isUpdateCategorieModalOpen}
          setOpen={setIsUpdateCategorieModalOpen}
          fields={[
            { label: "name", required: false },
            { label: "description", required: false },
            { label: "status", required: false },
          ]}
          body={updateBody}
          setBody={setUpdateBody}
          modalName={t("modal.update_category")}
          submit={updateMutate}
          submitLoading={updateIsLoading}
          error={updateError}
          success={updateSuccess}
        />
      )}
      {isViewModalOpen && (
        <ViewModal
          item={currentItem}
          loading={isCategoriesDataFetching}
          modalName={`${t("modal.category")}: ${currentItem?.name}`}
          open={isViewModalOpen}
          setOpen={setIsViewModalOpen}
        />
      )}
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
    </Grid>
  );
};
