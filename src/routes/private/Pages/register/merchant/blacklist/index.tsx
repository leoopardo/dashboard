/* eslint-disable react-hooks/exhaustive-deps */
import {
  DeleteOutlined,
  FilterOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { ColumnInterface, CustomTable } from "@components/CustomTable";
import { FiltersModal } from "@components/FiltersModal";
import { FilterChips } from "@components/FiltersModal/filterChips";
import { ViewModal } from "@components/Modals/viewGenericModal";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { Grid } from "@mui/material";
import { Confirmation } from "@src/components/Modals/confirmation";
import { ExportReportsModal } from "@src/components/Modals/exportReportsModal";
import { MutateModal } from "@src/components/Modals/mutateGenericModal";
import { ReasonSelect } from "@src/components/Selects/reasonSelect";
import { Toast } from "@src/components/Toast";
import { queryClient } from "@src/services/queryClient";
import { useCreateMerchantBlacklist } from "@src/services/register/merchant/blacklist/createMerchantBlacklist";
import { useDeleteMechantBlacklist } from "@src/services/register/merchant/blacklist/deleteMerchantBlacklist";
import { useGetRowsMerchantBlacklist } from "@src/services/register/merchant/blacklist/getMerchantBlacklist";
import { useCreateMerchantBlacklistReports } from "@src/services/reports/register/merchant/createMerchantBlacklistReports";
import {
  MerchantBlacklistItem,
  MerchantBlacklistQuery,
} from "@src/services/types/register/merchants/merchantBlacklist.interface";
import { ValidateInterface } from "@src/services/types/validate.interface";
import useDebounce from "@utils/useDebounce";
import { Button, Input } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ReactInputMask from "react-input-mask";

const INITIAL_QUERY: MerchantBlacklistQuery = {
  limit: 25,
  page: 1,
  sort_field: "createdAt",
  sort_order: "DESC",
};

export const MerchantBlacklist = () => {
  const { permissions, type, merchant_id } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const [query, setQuery] = useState<MerchantBlacklistQuery>(INITIAL_QUERY);
  const { t } = useTranslation();
  const {
    isMerchantBlacklistDataFetching,
    merchantBlacklistData,
    merchantBlacklistDataError,
    refetchMerchantBlacklistData,
  } = useGetRowsMerchantBlacklist(query);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [body, setBody] = useState<MerchantBlacklistItem | null>({
    cpf: "",
    description: "",
    can_be_deleted_only_by_organization: true,
  });
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<MerchantBlacklistItem | null>(
    null
  );
  const { error, isLoading, isSuccess, mutate } =
    useCreateMerchantBlacklist(body);
  const [search, setSearch] = useState<string>("");
  const debounceSearch = useDebounce(search);
  const {
    MerchantBlacklistReportsError,
    MerchantBlacklistReportsIsLoading,
    MerchantBlacklistReportsIsSuccess,
    MerchantBlacklistReportsMutate,
  } = useCreateMerchantBlacklistReports(query);

  const { isDeleteLoading, mutateDelete } = useDeleteMechantBlacklist({
    cpf: currentItem?.cpf,
  });

  const columns: ColumnInterface[] = [
    { name: "cpf", type: "cpf" },
    { name: "merchant_name", type: "text" },
    { name: "reason", type: "text", sort: true },
    { name: "description", type: "text" },
    { name: "create_user_name", type: "text" },
    { name: "createdAt", type: "date", sort: true },
  ];

  useEffect(() => {
    if (!isUpdateModalOpen) {
      setBody({
        cpf: "",
        description: "",
        can_be_deleted_only_by_organization: true,
      });
    }
  }, [isUpdateModalOpen]);

  useEffect(() => {
    refetchMerchantBlacklistData();
  }, [query]);

  useEffect(() => {
    if (!debounceSearch) {
      const q = { ...query };
      delete q.cpf;
      return setQuery(q);
    }
    setQuery((state) => ({ ...state, cpf: debounceSearch }));
  }, [debounceSearch]);

  return (
    <Grid container style={{ padding: "25px" }}>
      <Grid
        container
        style={{ marginTop: "20px", display: "flex", alignItems: "center" }}
        spacing={1}
      >
        <Grid item xs={12} md={4} lg={2}>
          <Button
            size="large"
            style={{ width: "100%" }}
            loading={isMerchantBlacklistDataFetching}
            type="primary"
            onClick={() => setIsFiltersOpen(true)}
            icon={<FilterOutlined />}
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
          />
        </Grid>
      </Grid>

      <Grid container style={{ marginTop: "5px" }} spacing={1}>
        <Grid item xs={12} md={2} lg={2}>
          <ReasonSelect queryOptions={query} setQueryFunction={setQuery} />
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <ReactInputMask
            value={search}
            mask="999.999.999-99"
            onChange={(event) => {
              const value = event.target.value.replace(/[^\d]/g, "");
              setSearch(value);
            }}
          >
            <Input size="large" />
          </ReactInputMask>
        </Grid>
        <Grid item xs={12} md={3} lg={2}>
          <Button
            type="dashed"
            loading={isMerchantBlacklistDataFetching}
            danger
            onClick={() => {
              setQuery(() => ({
                ...INITIAL_QUERY,
              }));
              setSearch("");
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
        {permissions.register.merchant.blacklist.merchant_blacklist_create && (
          <Grid item xs={12} md={3} lg={2}>
            <Button
              type="primary"
              loading={isMerchantBlacklistDataFetching}
              onClick={() => setIsUpdateModalOpen(true)}
              style={{
                height: 40,
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              icon={<PlusOutlined style={{ fontSize: 22 }} />}
            >
              {t("buttons.create_bank_blacklist")}
            </Button>
          </Grid>
        )}

        {permissions.register.merchant.blacklist
          .merchant_blacklist_export_csv && (
          <Grid item xs={12} md={"auto"}>
            <ExportReportsModal
              disabled={
                !merchantBlacklistData?.total || merchantBlacklistDataError
              }
              mutateReport={() => MerchantBlacklistReportsMutate()}
              error={MerchantBlacklistReportsError}
              success={MerchantBlacklistReportsIsSuccess}
              loading={MerchantBlacklistReportsIsLoading}
              reportPath="/register/merchant/merchant_reports/merchant_blacklist_reports"
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
            data={merchantBlacklistData}
            items={merchantBlacklistData?.items}
            error={merchantBlacklistDataError}
            columns={columns}
            loading={isMerchantBlacklistDataFetching}
            label={["cpf", "merchant_name"]}
            actions={[
              {
                label: "delete",
                icon: <DeleteOutlined style={{ fontSize: "18px" }} />,
                onClick: () => setIsDeleteOpen(true),
                disabled: (item) =>
                  !permissions?.register?.merchant?.blacklist
                    ?.merchant_blacklist_delete &&
                  !item?.can_be_deleted_only_by_organization &&
                  type !== 1 &&
                  type !== 2,
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
          filters={["start_date", "end_date", "merchant_id"]}
          refetch={refetchMerchantBlacklistData}
          selectOptions={{}}
          startDateKeyName="start_date"
          endDateKeyName="end_date"
          initialQuery={INITIAL_QUERY}
        />
      )}

      {isDeleteOpen && (
        <Confirmation
          open={isDeleteOpen}
          setOpen={setIsDeleteOpen}
          submit={mutateDelete}
          title={t("actions.delete")}
          description={`${t("messages.are_you_sure", {
            action: t("actions.delete").toLocaleLowerCase(),
            itens: currentItem?.cpf,
          })}`}
          loading={isDeleteLoading}
        />
      )}

      {isUpdateModalOpen && (
        <MutateModal
          type="update"
          open={isUpdateModalOpen}
          setOpen={setIsUpdateModalOpen}
          fields={[
            type == 1 || type === 2
              ? {
                  label: "can_be_deleted_only_by_organization",
                  required: true,
                }
              : undefined,
            { label: "cpf", required: true },
            { label: "reason", required: true },
            { label: "description", required: true },
            !merchant_id
              ? {
                  label: "merchant_id",
                  required: true,
                  selectOption: true,
                }
              : undefined,
          ]}
          body={body}
          setBody={setBody}
          modalName={t("modal.new_bank_blacklist")}
          submit={mutate}
          submitLoading={isLoading}
          selectOptions={{}}
          error={error}
          success={isSuccess}
          submitText={`${t("buttons.create")}`}
        />
      )}

      {isViewModalOpen && (
        <ViewModal
          item={currentItem}
          loading={isMerchantBlacklistDataFetching}
          modalName={`CPF: ${currentItem?.cpf}`}
          open={isViewModalOpen}
          setOpen={setIsViewModalOpen}
        />
      )}
      <Toast
        actionError={t("messages.create")}
        actionSuccess={t("messages.created")}
        error={error}
        success={isSuccess}
      />
    </Grid>
  );
};
