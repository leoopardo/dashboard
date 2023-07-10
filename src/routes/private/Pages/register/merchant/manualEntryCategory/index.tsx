import { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { Button, Input } from "antd";
import { FilterChips } from "@components/FiltersModal/filterChips";
import { useTranslation } from "react-i18next";
import { FiltersModal } from "@components/FiltersModal";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  MerchantManualEntryCategoryQuery,
  MerchantManualEntryCategoryItem,
} from "@src/services/types/register/merchants/merchantManualEntryCategory.interface";
import { ColumnInterface, CustomTable } from "@components/CustomTable";
import { UserAddOutlined } from "@ant-design/icons";
import { useGetRowsMerchantManualEntryCategory } from "@src/services/register/merchant/manualEntryCategory/getManualEntryCategory";
import { useCreateManualEntryCategory } from "@src/services/register/merchant/manualEntryCategory/createManualEntryCategory";
import { useUpdateManualEntryCategory } from "@src/services/register/merchant/manualEntryCategory/updateManualEntryCategory";
import { MutateModal } from "@src/components/Modals/mutateGenericModal";
import { Toast } from "@src/components/Toast";

const INITIAL_QUERY: MerchantManualEntryCategoryQuery = {
  limit: 25,
  page: 1,
  sort_field: "created_at",
  sort_order: "DESC",
};

export const MerchantManualEntryCategory = () => {
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
  /*   const { updateError, updateIsLoading, updateIsSuccess, updateMutate } =
  useUpdateMerchant({
    ...updateUserBody,
    validation_token: tokenState,
  }); */

  const columns: ColumnInterface[] = [
    { name: "id", type: "id" },
    { name: "name", type: "text" },
    { name: "description", type: "text" },
    { name: "organization_id", type: "text" },
    { name: "status", type: "status" },
    { name: "created_at", type: "date" },
  ];

  useEffect(() => {
    refetchCategoryData();
  }, [query]);

  useEffect(() => {
    setUpdateBody({...currentItem, entry_account_category_id: currentItem?.id});
  }, [currentItem]);

  return (
    <Grid container style={{ padding: "25px" }}>
      <Grid
        container
        style={{ marginTop: "20px", display: "flex", alignItems: "center" }}
        spacing={1}
      >
        <Grid item xs={12} md={3} lg={2}>
          <Button
            style={{ width: "100%", height: 40 }}
            loading={isCategoryDataFetching}
            type="primary"
            onClick={() => setIsFiltersOpen(true)}
          >
            {t("table.filters")}
          </Button>
        </Grid>
        <Grid item xs={12} md={6} lg={8}>
          <FilterChips
            startDateKeyName="initial_date"
            endDateKeyName="final_date"
            query={query}
            setQuery={setQuery}
            haveInitialDate
          />
        </Grid>

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
            label={["name", "username"]}
            actions={[
              {
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

      {isFiltersOpen && (
        <FiltersModal
          open={isFiltersOpen}
          setOpen={setIsFiltersOpen}
          query={query}
          setQuery={setQuery}
          haveInitialDate
          filters={["start_date", "end_date", "status"]}
          refetch={refetchCategoryData}
          selectOptions={{ status: ["true", "false"] }}
          startDateKeyName="start_date"
          endDateKeyName="end_date"
          initialQuery={INITIAL_QUERY}
        />
      )}

      {isCreateModalOpen && (
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
          modalName={t("modal.modal_create_merchant")}
          submit={mutate}
          submitLoading={isLoading}
          error={error}
          success={isSuccess}
        />
      )}

      {isUpdateModalOpen && (
        <MutateModal
          type="update"
          open={isUpdateModalOpen}
          setOpen={setIsUpdateModalOpen}
          fields={[
            { label: "name", required: true },
            { label: "description", required: true },
          ]}
          body={updateBody}
          setBody={setUpdateBody}
          modalName={t("modal.modal_update_merchant")}
          submit={updateMutate}
          submitLoading={updateIsLoading}
          error={updateError}
          success={updateIsSuccess}
        />
      )}

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
