import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { ColumnInterface, CustomTable } from "@components/CustomTable";
import { FiltersModal } from "@components/FiltersModal";
import { FilterChips } from "@components/FiltersModal/filterChips";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { Grid } from "@mui/material";
import { Search } from "@src/components/Inputs/search";
import { MutateModal } from "@src/components/Modals/mutateGenericModal";
import { Toast } from "@src/components/Toast";
import { queryClient } from "@src/services/queryClient";
import { useCreateManualEntryCategory } from "@src/services/register/merchant/manualEntryCategory/createManualEntryCategory";
import { useGetRowsMerchantManualEntryCategory } from "@src/services/register/merchant/manualEntryCategory/getManualEntryCategory";
import { useUpdateManualEntryCategory } from "@src/services/register/merchant/manualEntryCategory/updateManualEntryCategory";
import {
  MerchantManualEntryCategoryItem,
  MerchantManualEntryCategoryQuery,
} from "@src/services/types/register/merchants/merchantManualEntryCategory.interface";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { Button } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const INITIAL_QUERY: MerchantManualEntryCategoryQuery = {
  limit: 25,
  page: 1,
  sort_field: "created_at",
  sort_order: "DESC",
};

export const MerchantManualEntryCategory = () => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;

  const [query, setQuery] =
    useState<MerchantManualEntryCategoryQuery>(INITIAL_QUERY);
  const { t } = useTranslation();
  const [body, setBody] = useState<MerchantManualEntryCategoryItem | null>({
    name: "",
    description: "",
  });
  const [updateBody, setUpdateBody] =
    useState<MerchantManualEntryCategoryItem | null>(null);
  const {
    categoryData,
    categoryDataError,
    isCategoryDataFetching,
    refetchCategoryData,
  } = useGetRowsMerchantManualEntryCategory(query);
  const { error, isLoading, isSuccess, mutate } =
    useCreateManualEntryCategory(body);
  const { updateError, updateIsLoading, updateIsSuccess, updateMutate } =
    useUpdateManualEntryCategory(updateBody);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [currentItem, setCurrentItem] =
    useState<MerchantManualEntryCategoryItem | null>(null);

  const columns: ColumnInterface[] = [
    { name: "id", type: "id", sort: true },
    { name: "name", type: "text", sort: true },
    { name: "description", type: "text", sort: true },
    { name: "organization_id", type: "text" },
    { name: "status", type: "status" },
    { name: "created_at", type: "date", sort: true },
  ];

  useEffect(() => {
    refetchCategoryData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <Grid item xs={12} md={3} lg={2}>
          <Button
            size="large"
            style={{ width: "100%" }}
            loading={isCategoryDataFetching}
            type="primary"
            onClick={() => setIsFiltersOpen(true)}
          >
            {t("table.filters")}
          </Button>
        </Grid>
        <Grid item xs={12} md={6} lg={8}>
          <FilterChips initial_query={INITIAL_QUERY}
            startDateKeyName="start_date"
            endDateKeyName="end_date"
            query={query}
            setQuery={setQuery}
          />
        </Grid>
      </Grid>

      <Grid container style={{ marginTop: "8px" }} spacing={1}>
        <Grid item xs={12} md={3} lg={3}>
          <Search query={query} setQuery={setQuery} searchOption={"name"} />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <Button
            type="dashed"
            loading={isCategoryDataFetching}
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

        {permissions?.register?.merchant?.release_category
          ?.merchant_release_category_create && (
          <Grid item xs={12} md={3} lg={2}>
            <Button
              type="primary"
              loading={isCategoryDataFetching}
              onClick={() => {
                setIsCreateModalOpen(true);
              }}
              style={{
                height: 40,
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PlusOutlined style={{ marginRight: 10, fontSize: 22 }} />{" "}
              {`${t("buttons.create")} ${t("buttons.new_categorie")}`}
            </Button>
          </Grid>
        )}
      </Grid>

      <Grid container style={{ marginTop: "15px" }}>
        <Grid item xs={12}>
          <CustomTable
            query={query}
            setCurrentItem={setCurrentItem}
            setQuery={setQuery}
            data={categoryData}
            items={categoryData?.items}
            error={categoryDataError}
            columns={columns}
            loading={isCategoryDataFetching}
            label={["name", "description"]}
            refetch={refetchCategoryData}
            actions={[
              permissions?.register?.merchant?.release_category
                ?.merchant_release_category_update && {
                label: "edit",
                icon: <EditOutlined style={{ fontSize: "20px" }} />,
                onClick: () => {
                  setIsUpdateModalOpen(true);
                },
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
          filters={["start_date", "end_date", "status"]}
          refetch={refetchCategoryData}
          selectOptions={{ status: ["true", "false"] }}
          startDateKeyName="start_date"
          endDateKeyName="end_date"
          initialQuery={INITIAL_QUERY}
        />

        <MutateModal
          type="create"
          open={isCreateModalOpen}
          setOpen={setIsCreateModalOpen}
          fields={[
            { label: "name", required: true },
            { label: "description", required: true },
          ]}
          body={body}
          setBody={setBody}
          modalName={t("modal.new_category")}
          submit={mutate}
          submitLoading={isLoading}
          error={error}
          success={isSuccess}
        />

        <MutateModal
          type="update"
          open={isUpdateModalOpen}
          setOpen={setIsUpdateModalOpen}
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
          success={updateIsSuccess}
        />

      <Toast
        actionSuccess={t("messages.created")}
        actionError={t("messages.create")}
        error={error}
        success={isSuccess}
      />

      <Toast
        actionSuccess={t("messages.updated")}
        actionError={t("messages.update")}
        error={updateError}
        success={updateIsSuccess}
      />
    </Grid>
  );
};
