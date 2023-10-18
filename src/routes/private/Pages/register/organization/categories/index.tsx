/* eslint-disable react-hooks/exhaustive-deps */
import {
  EditOutlined,
  EyeFilled,
  InfoCircleOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { CustomTable } from "@components/CustomTable";
import { FiltersModal } from "@components/FiltersModal";
import { FilterChips } from "@components/FiltersModal/filterChips";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { Grid, Tooltip } from "@mui/material";
import { useGetOrganizationCategories } from "@services/register/organization/categories/getCategories";
import { ExportReportsModal } from "@src/components/Modals/exportReportsModal";
import { MutateModal } from "@src/components/Modals/mutateGenericModal";
import { ViewModal } from "@src/components/Modals/viewGenericModal";
import { Toast } from "@src/components/Toast";
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
import { Button, Input, Tour, TourProps, Typography } from "antd";
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

  useEffect(() => {
    refetchCategoriesData();
  }, [query]);

  useEffect(() => {
    setUpdateBody({
      ...currentItem,
      entry_account_category_id: currentItem?.id,
    });
  }, [currentItem]);

  const [isTuorOpen, setIsTuorOpen] = useState<boolean>(false);
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
  const steps: TourProps["steps"] = [
    {
      title: t("menus.categories"),
      description: t("wiki.categories_description")},
    {
      title: t("wiki.search_filter"),
      description: t("wiki.search_filter_description"),
      target: () => ref1.current,
    },
    {
      title: "Pesquisa por nome.",
      description: "Procure determinada categoria pelo nome.",
      target: () => ref2.current,
    },
    {
      title: "Remoção dos filtros.",
      description:
        "Remova os filtros aplicados e volte a busca para o estado inicial.",
      target: () => ref3.current,
    },
  ];

  if (
    permissions.register.paybrokers.release_category
      .paybrokers_release_category_create
  ) {
    steps.push({
      title: "Cadastre categorias.",
      description: "Cadastre novas categorias de lançamentos manuais.",
      target: () => ref4.current,
    });
  }
  if (
    permissions.register.paybrokers.release_category
      .paybrokers_release_category_export_csv
  ) {
    steps.push({
      title: "Gere relatórios",
      description: (
        <Typography>
          Gere relatórios das categorias de lançamento manual de acordo com os
          filtros selecionados. O relatório poderá ser baixado na pagina:{" "}
          <Typography.Link
            href="/register/organization/organization_reports/organization_reports_categories"
            target="_blank"
          >
            Organização | Relatórios | Usuários
          </Typography.Link>
        </Typography>
      ),
      target: () => ref5.current,
    });
  }

  steps.push(
    {
      title: "ID",
      description:
        "Número de identificação do usuário junto ao cadastro da Organização",
      target: () => refId.current,
    },
    {
      title: "Nome",
      description: "Nome da categoria de lançamento manual.",
      target: () => refName.current,
    },
    {
      title: "Descrição",
      description: "Descrição da categoria de lançamento manual.",
      target: () => refDescription.current,
    },
    {
      title: "Situação",
      description: "Situação do cadastro da categoria (ativa ou inativa).",
      target: () => refStatus.current,
    },
    {
      title: "Criado em",
      description: "Data de criação da categoria.",
      target: () => refCreatedAt.current,
    }
  );
  // TUOR -----------------------------------------------

  return (
    <Grid container style={{ padding: "25px" }}>
      <Tour
        open={isTuorOpen}
        onClose={() => setIsTuorOpen(false)}
        steps={steps}
        animated
      />
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
          xs={12}
          md={1}
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <Tooltip title="Ajuda">
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
        <Grid item xs={12} md={4} lg={4} ref={ref2}>
          <Input.Search
            size="large"
            value={search}
            placeholder={t("table.name") || ""}
            onChange={(event) => {
              setSearch(event.target.value);
            }}
            onSearch={() => setQuery((state) => ({ ...state, name: search }))}
          />
        </Grid>
        <Grid item xs={12} md={3} lg={2}>
          <Button
            ref={ref3}
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
            >
              <UserAddOutlined style={{ marginRight: 10, fontSize: 22 }} />{" "}
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
