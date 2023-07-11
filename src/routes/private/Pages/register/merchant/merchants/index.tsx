import { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { Button, Input } from "antd";
import { FilterChips } from "@components/FiltersModal/filterChips";
import { useTranslation } from "react-i18next";
import { useGetRowsMerchantRegister } from "@services/register/merchant/merchant/getMerchants";
import {
  MerchantsItem,
  MerchantsQuery,
} from "@services/types/register/merchants/merchantsRegister.interface";
import { FiltersModal } from "@components/FiltersModal";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { ColumnInterface, CustomTable } from "@components/CustomTable";
import { Toast } from "@components/Toast";
import useDebounce from "@utils/useDebounce";
import { UserAddOutlined } from "@ant-design/icons";
import { NewMerchantModal } from "./components/newMerchantModal";
import { EyeFilled, EditOutlined, ToolOutlined } from "@ant-design/icons";
import { ViewModal } from "@components/Modals/viewGenericModal";
import { MutateModal } from "@components/Modals/mutateGenericModal";
import { useUpdateMerchant } from "@services/register/merchant/merchant/updateMerchant";
import { useNavigate } from "react-router-dom";
import { ExportReportsModal } from "@src/components/Modals/exportReportsModal";
import { useCreateMerchantReports } from "@src/services/reports/register/merchant/createMerchantReports";
import { queryClient } from "@src/services/queryClient";
import { ValidateInterface } from "@src/services/types/validate.interface";

const INITIAL_QUERY: MerchantsQuery = {
  limit: 25,
  page: 1,
  sort_field: "created_at",
  sort_order: "DESC",
};

export const MerchantView = () => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState<MerchantsQuery>(INITIAL_QUERY);
  const {
    MerchantData,
    MerchantDataError,
    isMerchantDataFetching,
    refetchMerchantData,
  } = useGetRowsMerchantRegister(query);

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isNewMerchantModal, setIsNewMerchantModal] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<MerchantsItem | null>(null);
  const [updateBody, setUpdateBody] = useState<MerchantsItem>({
    ...currentItem,
    merchant_id: currentItem?.id,
  });

  const {
    UpdateError,
    UpdateIsLoading,
    UpdateIsSuccess,
    UpdateMutate,
    UpdateReset,
  } = useUpdateMerchant(updateBody);
  const {
    MerchantReportsError,
    MerchantReportsIsLoading,
    MerchantReportsIsSuccess,
    MerchantReportsMutate,
    MerchantReset,
  } = useCreateMerchantReports(query);
  const [search, setSearch] = useState<string>("");
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const debounceSearch = useDebounce(search);

  const columns: ColumnInterface[] = [
    { name: "id", type: "id" },
    { name: "name", type: "text" },
    { name: "domain", type: "text" },
    { name: ["partner", "name"], head: "partner", type: "text" },
    {
      name: ["merchantConfig", "cash_in_bank"],
      head: "bank",
      type: "bankNameToIcon",
    },
    { name: "status", type: "status" },
    { name: "created_at", type: "date" },
  ];

  useEffect(() => {
    const id = currentItem?.id;
    isConfigOpen && navigate(`${id}`);
  }, [isConfigOpen]);

  useEffect(() => {
    refetchMerchantData();
  }, [query]);

  useEffect(() => {
    setUpdateBody({
      ...currentItem,
      merchant_id: currentItem?.id,
    });
  }, [currentItem]);

  useEffect(() => {
    if (!debounceSearch) {
      const q = { ...query };
      delete q.name;
      return setQuery(q);
    }
    setQuery((state: any) => ({ ...state, name: debounceSearch }));
  }, [debounceSearch]);

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
            loading={isMerchantDataFetching}
            type="primary"
            onClick={() => setIsFiltersOpen(true)}
          >
            {t("table.filters")}
          </Button>
        </Grid>
        <Grid item xs={12} md={8} lg={10}>
          <FilterChips
            startDateKeyName="initial_date"
            endDateKeyName="final_date"
            query={query}
            setQuery={setQuery}
            haveInitialDate
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
            loading={isMerchantDataFetching}
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
        {permissions.register.merchant.merchant.merchant_create && (
          <Grid item xs={12} md={3} lg={2}>
            <Button
              type="primary"
              loading={isMerchantDataFetching}
              onClick={() => {
                MerchantReset();
                setIsNewMerchantModal(true);
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
              {`${t("buttons.create")} ${t("buttons.new_user")}`}
            </Button>
          </Grid>
        )}

        {permissions.register.merchant.merchant.merchant_export_csv && (
          <Grid item xs={12} md="auto">
            <ExportReportsModal
              mutateReport={() => MerchantReportsMutate()}
              error={MerchantReportsError}
              success={MerchantReportsIsSuccess}
              loading={MerchantReportsIsLoading}
              reportPath="/register/merchant/merchant_reports/merchant_merchants_reports"
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
            data={MerchantData}
            items={MerchantData?.items}
            error={MerchantDataError}
            columns={columns}
            loading={isMerchantDataFetching}
            label={["name", "username"]}
            actions={[
              {
                label: "details",
                icon: <EyeFilled style={{ fontSize: "20px" }} />,
                onClick: () => {
                  setIsViewModalOpen(true);
                },
              },
              permissions.register.merchant.merchant.merchant_update && {
                label: "edit",
                icon: <EditOutlined style={{ fontSize: "20px" }} />,
                onClick: () => {
                  UpdateReset();
                  setIsUpdateModalOpen(true);
                },
              },
              {
                label: "configs",
                icon: <ToolOutlined style={{ fontSize: "20px" }} />,
                onClick: () => setIsConfigOpen(true),
              },
            ]}
          />
        </Grid>
      </Grid>

      {isUpdateModalOpen && (
        <MutateModal
          type="update"
          open={isUpdateModalOpen}
          setOpen={setIsUpdateModalOpen}
          fields={[
            { label: "name", required: false },
            { label: "domain", required: false },
            { label: "partner_id", required: false },
            { label: "cellphone", required: false },
            { label: "email", required: false },
          ]}
          body={updateBody}
          setBody={setUpdateBody}
          modalName={t("modal.modal_update_merchant")}
          submit={UpdateMutate}
          submitLoading={UpdateIsLoading}
          error={UpdateError}
          success={UpdateIsSuccess}
        />
      )}

      {isViewModalOpen && (
        <ViewModal
          item={currentItem}
          loading={isMerchantDataFetching}
          modalName={`${t("menus.merchant")}: ${currentItem?.name}`}
          open={isViewModalOpen}
          setOpen={setIsViewModalOpen}
        />
      )}

      {isFiltersOpen && (
        <FiltersModal
          open={isFiltersOpen}
          setOpen={setIsFiltersOpen}
          query={query}
          setQuery={setQuery}
          haveInitialDate
          filters={[
            "start_date",
            "end_date",
            "status",
            "partner_id",
            "merchant_id",
          ]}
          refetch={refetchMerchantData}
          selectOptions={{}}
          startDateKeyName="start_date"
          endDateKeyName="end_date"
          initialQuery={INITIAL_QUERY}
        />
      )}
      {isNewMerchantModal && (
        <NewMerchantModal
          open={isNewMerchantModal}
          setOpen={setIsNewMerchantModal}
        />
      )}

      <Toast
        actionSuccess={t("messages.updated")}
        actionError={t("messages.update")}
        error={UpdateError}
        success={UpdateIsSuccess}
      />
    </Grid>
  );
};
