/* eslint-disable react-hooks/exhaustive-deps */
import {
  DeleteOutlined,
  EditOutlined,
  EyeFilled,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { ColumnInterface, CustomTable } from "@components/CustomTable";
import { FiltersModal } from "@components/FiltersModal";
import { FilterChips } from "@components/FiltersModal/filterChips";
import { Grid } from "@mui/material";
import { useCreateMerchantFeePlans } from "@services/register/merchant/feePlans/createFeePlans";
import { useDeleteMerchantFeePlan } from "@services/register/merchant/feePlans/deleteFeePlans";
import { useGetFeePlansRegister } from "@services/register/merchant/feePlans/getFeePlans";
import { useUpdateMerchantFeePlan } from "@services/register/merchant/feePlans/updateFeePlans";
import {
  IDepositFeeItem,
  IDepositFeePlansDetails,
} from "@services/types/register/merchants/merchantFeePlans.interface";
import { MerchantManualEntryCategoryQuery } from "@services/types/register/merchants/merchantManualEntryCategory.interface";
import { ViewModal } from "@src/components/Modals/viewGenericModal";
import { Toast } from "@src/components/Toast";
import { useGetFeePlansDetails } from "@src/services/register/merchant/feePlans/getFeePlansDetails";
import { Button } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { UpdateFeePlanModal } from "./components/UpdateFeePlanModal";

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
    name: null,
    plan_type: null,
    transaction_type: null,
    range_type: null,
  });
  const [fees, setFees] = useState<IDepositFeePlansDetails[] | null>([]);
  const [, setUpdateBody] = useState<IDepositFeeItem | null>(null);
  const [currentItem, setCurrentItem] = useState<IDepositFeeItem | null>(null);
  const {
    feePlansData,
    feePlansDataError,
    isFeePlansDataFetching,
    refetchFeePlansData,
  } = useGetFeePlansRegister(query);
  const {
    deleteMerchantFeePlanError,
    deleteMerchantFeePlanIsSuccess,
    deleteMerchantFeePlanMutate,
  } = useDeleteMerchantFeePlan(currentItem?.id);
  const { mutate, error, isLoading, isSuccess } = useCreateMerchantFeePlans({
    ...body,
  });
  const { updateError, updateIsLoading, updateIsSuccess, updateMutate } =
    useUpdateMerchantFeePlan({
      ...body,
      fee_plan_id: currentItem?.id,
    });
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { feePlansDetailsData, refetchFeePlansDetailsData } =
    useGetFeePlansDetails({ fee_plans_id: currentItem?.id });

  const columns: ColumnInterface[] = [
    { name: "id", type: "id", sort: true },
    { name: "name", type: "text", sort: true },
    { name: "plan_type", type: "translate" },
    { name: "transaction_type", type: "translate" },
    { name: "status", type: "status", sort: true },
  ];

  useEffect(() => {
    refetchFeePlansData();
  }, [query]);

  useEffect(() => {
    setUpdateBody(currentItem);
    refetchFeePlansDetailsData();
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
            size="large"
            style={{ width: "100%" }}
            loading={isFeePlansDataFetching}
            type="primary"
            onClick={() => setIsFiltersOpen(true)}
          >
            {t("table.filters")}
          </Button>
        </Grid>
        <Grid item xs={12} md={5} lg={7}>
          <FilterChips
            startDateKeyName="start_date"
            endDateKeyName="end_date"
            query={query}
            setQuery={setQuery}
          />
        </Grid>

        <Grid item xs={12} md={3} lg={2}>
          <Button
            type="primary"
            loading={isFeePlansDataFetching}
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
            {`${t("buttons.create")} ${t("menus.fee_plans")
              .toString()
              .toLocaleLowerCase()}`}
          </Button>
        </Grid>

        <Grid
          container
          item
          xs={12}
          md="auto"
          lg={1}
          style={{ marginLeft: "auto" }}
        >
          <Button
            style={{
              width: "100%",
              height: 40,
            }}
            loading={isFeePlansDataFetching}
            shape="round"
            type="dashed"
            onClick={refetchFeePlansData}
          >
            {!isFeePlansDataFetching && <ReloadOutlined />}
          </Button>
        </Grid>
      </Grid>

      <Grid container style={{ marginTop: "15px" }}>
        <Grid item xs={12}>
          <CustomTable
            query={query}
            setCurrentItem={setCurrentItem}
            setQuery={setQuery}
            data={feePlansData}
            items={feePlansData?.items}
            error={feePlansDataError}
            columns={columns}
            loading={isFeePlansDataFetching}
            label={["name", "username"]}
            actions={[
              {
                label: "details",
                icon: <EyeFilled style={{ fontSize: "20px" }} />,
                onClick: () => {
                  setIsViewModalOpen(true);
                },
              },
              {
                label: "edit",
                icon: <EditOutlined style={{ fontSize: "20px" }} />,
                onClick: () => {
                  setIsUpdateModalOpen(true);
                },
              },
              {
                label: "delete",
                icon: <DeleteOutlined style={{ fontSize: "20px" }} />,
                onClick: () => setIsConfirmOpen(true),
              },
            ]}
            isConfirmOpen={isConfirmOpen}
            setIsConfirmOpen={setIsConfirmOpen}
            itemToAction={currentItem?.name}
            onConfirmAction={() => deleteMerchantFeePlanMutate()}
          />
        </Grid>
      </Grid>

      {isFiltersOpen && (
        <FiltersModal
          open={isFiltersOpen}
          setOpen={setIsFiltersOpen}
          query={query}
          setQuery={setQuery}
          filters={[
            "start_date",
            "end_date",
            "status",
            "plan_type",
            "transaction_type",
            "range_type",
          ]}
          refetch={refetchFeePlansData}
          selectOptions={{
            status: ["true", "false"],
            plan_type: ["MONTHLY", "CONTINUOS"],
            transaction_type: ["CASHIN", "CASHOUT"],
            range_type: ["VALUE", "TRANSACTIONS"],
          }}
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
          setFees={setFees}
          fees={fees}
          body={body}
          setBody={setBody}
          loading={isLoading}
          mutate={mutate}
        />
      )}

      {isUpdateModalOpen && (
        <UpdateFeePlanModal
          action="update"
          open={isUpdateModalOpen}
          setOpen={setIsUpdateModalOpen}
          setCurrentUser={setCurrentItem}
          currentUser={currentItem}
          setFees={setFees}
          body={body}
          setBody={setBody}
          setUpdateBody={setBody}
          fees={fees}
          loading={updateIsLoading}
          mutate={updateMutate}
        />
      )}

      {isViewModalOpen && (
        <ViewModal
          open={isViewModalOpen}
          setOpen={setIsViewModalOpen}
          item={{
            ...currentItem,
            merchant_fee_plans_details: feePlansDetailsData?.items,
          }}
          loading={isFeePlansDataFetching}
          modalName={`${t("menus.fee_plans")}: ${currentItem?.name}`}
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

      <Toast
        actionSuccess={t("messages.deleted")}
        actionError={t("messages.delete")}
        error={deleteMerchantFeePlanError}
        success={deleteMerchantFeePlanIsSuccess}
      />
    </Grid>
  );
};
