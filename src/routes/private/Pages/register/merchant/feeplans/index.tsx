import { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { Button } from "antd";
import { FilterChips } from "@components/FiltersModal/filterChips";
import { useTranslation } from "react-i18next";
import { FiltersModal } from "@components/FiltersModal";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { MerchantManualEntryCategoryQuery } from "@src/services/types/register/merchants/merchantManualEntryCategory.interface";
import { ColumnInterface, CustomTable } from "@components/CustomTable";
import { useGetFeePlansRegister } from "@src/services/register/merchant/feePlans/getFeePlans";
import { useCreateMerchantFeePlans } from "@src/services/register/merchant/feePlans/createFeePlans";
import { useUpdateMerchantFeePlan } from "@src/services/register/merchant/feePlans/updateFeePlans";
import { UpdateFeePlanModal } from "./components/UpdateFeePlanModal";
import { IDepositFeeItem } from "@src/services/types/register/merchants/merchantFeePlans.interface";
import { Toast } from "@src/components/Toast";

const INITIAL_QUERY: MerchantManualEntryCategoryQuery = {
  limit: 25,
  page: 1,
  sort_field: "created_at",
  sort_order: "DESC",
};

export const MerchantFeePlans = () => {
  const [query, setQuery] =
    useState<MerchantManualEntryCategoryQuery>(INITIAL_QUERY);
  const { t } = useTranslation();
  const [body, setBody] = useState<IDepositFeeItem | null>({
    name: "",
  });
  const [updateBody, setUpdateBody] = useState<IDepositFeeItem | null>(null);
  const [currentItem, setCurrentItem] = useState<IDepositFeeItem | null>(null);
  const {
    depositFeePlansData,
    depositFeePlansDataError,
    isDepositFeePlansDataFetching,
    refetchDepositFeePlansData,
  } = useGetFeePlansRegister(query);
  const { error, isLoading, isSuccess, mutate } =
    useCreateMerchantFeePlans(body);
  const { updateError, updateIsLoading, updateIsSuccess, updateMutate } =
    useUpdateMerchantFeePlan(currentItem?.id, updateBody);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const columns: ColumnInterface[] = [
    { name: "id", type: "id" },
    { name: "name", type: "text" },
    { name: "plan_type", type: "text" },
    { name: "transaction_type", type: "text" },
    { name: "status", type: "status" },
  ];

  useEffect(() => {
    refetchDepositFeePlansData();
  }, [query]);

  useEffect(() => {
    setUpdateBody(currentItem);
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
            loading={isDepositFeePlansDataFetching}
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
            loading={isDepositFeePlansDataFetching}
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
            {`${t("buttons.create")} ${t("table.fee_plan")}`}
          </Button>
        </Grid>
      </Grid>

      <Grid container style={{ marginTop: "15px" }}>
        <Grid item xs={12}>
          <CustomTable
            query={query}
            setCurrentItem={setCurrentItem}
            setQuery={setQuery}
            data={depositFeePlansData}
            items={depositFeePlansData?.merchant_fee_plans}
            error={depositFeePlansDataError}
            columns={columns}
            loading={isDepositFeePlansDataFetching}
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
          refetch={refetchDepositFeePlansData}
          selectOptions={{ status: ["true", "false"] }}
          startDateKeyName="start_date"
          endDateKeyName="end_date"
          initialQuery={INITIAL_QUERY}
        />
      )}

      {isCreateModalOpen && (
        <UpdateFeePlanModal
          action="create"
          open={isCreateModalOpen}
          setOpen={setIsCreateModalOpen}
        />
      )}

      {isUpdateModalOpen && (
        <UpdateFeePlanModal
          action="update"
          open={isUpdateModalOpen}
          setOpen={setIsUpdateModalOpen}
          setCurrentUser={setCurrentItem}
          currentUser={currentItem}
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
