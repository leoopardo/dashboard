/* eslint-disable @typescript-eslint/no-explicit-any */
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
import useDebounce from "@utils/useDebounce";
import { Button } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Confirmation } from "@src/components/Modals/confirmation";
import { MutateModal } from "@src/components/Modals/mutateGenericModal";
import { Toast } from "@src/components/Toast";
import { useCreateAggregatorBlacklistReason } from "@src/services/register/aggregator/blacklist/createAggregatorBlacklistReason";
import { useDeleteAggregatorReason } from "@src/services/register/aggregator/blacklist/deleteMerchantBlacklist";
import { useGetRowsAggregatorBlacklistReasons } from "@src/services/register/aggregator/blacklist/getAggregatorBlacklistReason";
import { MerchantBlacklistItem } from "@src/services/types/register/merchants/merchantBlacklist.interface";
import {
  CreateMerchantBlacklistReasons,
  MerchantBlacklistReasonQuery,
} from "@src/services/types/register/merchants/merchantBlacklistReasons.interface";

const INITIAL_QUERY: MerchantBlacklistReasonQuery = {
  limit: 25,
  page: 1,
};

export const AggregatorBlacklistReasons = () => {
  const [query, setQuery] =
    useState<MerchantBlacklistReasonQuery>(INITIAL_QUERY);
  const { t } = useTranslation();
  const {
    AggregatorBlacklistData,
    AggregatorBlacklistDataError,
    isAggregatorBlacklistDataFetching,
    refetchAggregatorBlacklistData,
  } = useGetRowsAggregatorBlacklistReasons(query);

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateReasonOpen, setIsCreateReasonOpen] = useState(false);
  const [body, setBody] = useState<CreateMerchantBlacklistReasons | null>({
    reason_name: "",
  });
  const [currentItem, setCurrentItem] = useState<MerchantBlacklistItem | null>(
    null
  );
  const [deleteItem, setDeleteItem] = useState<any>({});
  const { error, isLoading, isSuccess, mutate } =
    useCreateAggregatorBlacklistReason(body);
  const { DeleteError, isDeleteSuccess, mutateDelete } =
    useDeleteAggregatorReason(deleteItem?._id);
  const [search, setSearch] = useState<string>("");
  const debounceSearch = useDebounce(search);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] =
    useState<boolean>(false);

  const columns: ColumnInterface[] = [
    { name: "_id", type: "id" },
    { name: "create_user_name", type: "text" },
    { name: "aggregator_name", type: "text" },
    { name: "reason_name", head: "reason", type: "text", sort: true },
    { name: "createdAt", type: "date", sort: true },
  ];

  useEffect(() => {
    refetchAggregatorBlacklistData();
  }, [query]);

  useEffect(() => {
    if (!debounceSearch) {
      const q = { ...query };
      return setQuery(q);
    }
    setQuery((state) => ({ ...state, cpf: debounceSearch }));
  }, [debounceSearch]);

  return (
    <Grid container style={{ padding: "25px" }}>
      <Grid
        container
        style={{ display: "flex", alignItems: "center" }}
        spacing={1}
      >
        <Grid item xs={12} md={2} lg={2}>
          <Button
            size="large"
            style={{ width: "100%" }}
            loading={isAggregatorBlacklistDataFetching}
            type="primary"
            onClick={() => setIsFiltersOpen(true)}
            icon={<FilterOutlined />}
          >
            {t("table.filters")}
          </Button>
        </Grid>
        <Grid item xs={12} md={4} lg={6}>
          <FilterChips
            initial_query={INITIAL_QUERY}
            startDateKeyName="initial_date"
            endDateKeyName="final_date"
            query={query}
            setQuery={setQuery}
          />
        </Grid>
        <Grid item xs={12} md={3} lg={2}>
          <Button
            type="dashed"
            loading={isAggregatorBlacklistDataFetching}
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
        <Grid item xs={12} md={3} lg={2}>
          <Button
            type="primary"
            loading={isAggregatorBlacklistDataFetching}
            onClick={() => setIsCreateReasonOpen(true)}
            style={{
              height: 40,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            icon={<PlusOutlined style={{ fontSize: 22 }} />}
          >
            {t("buttons.new_reason")}
          </Button>
        </Grid>
      </Grid>

      <Grid container style={{ marginTop: "15px" }}>
        <Grid item xs={12}>
          <CustomTable
            query={query}
            setCurrentItem={setCurrentItem}
            setQuery={setQuery}
            data={AggregatorBlacklistData}
            items={AggregatorBlacklistData?.items}
            error={AggregatorBlacklistDataError}
            columns={columns}
            refetch={refetchAggregatorBlacklistData}
            loading={isAggregatorBlacklistDataFetching}
            label={["aggregator_name", "reason_name"]}
            actions={[
              {
                label: "delete",
                onClick: (item) => {
                  setDeleteItem(item);
                  setIsConfirmDeleteOpen(true);
                },
                icon: <DeleteOutlined />,
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
        filters={["start_date", "end_date"]}
        refetch={refetchAggregatorBlacklistData}
        selectOptions={{}}
        startDateKeyName="start_date"
        endDateKeyName="end_date"
        initialQuery={INITIAL_QUERY}
      />

      <MutateModal
        type="create"
        open={isCreateReasonOpen}
        setOpen={setIsCreateReasonOpen}
        fields={[
          { label: "aggregator_id", required: false },
          { label: "reason_name", required: true },
        ]}
        body={body}
        setBody={setBody}
        modalName={t("modal.new_reason")}
        submit={mutate}
        submitLoading={isLoading}
        error={error}
        success={isSuccess}
      />
      <Confirmation
        open={isConfirmDeleteOpen}
        setOpen={setIsConfirmDeleteOpen}
        title={t("messages.confirm_action_title", {
          action: t("messages.delete"),
        })}
        submit={mutateDelete}
        description={
          t("messages.are_you_sure", {
            action: t("messages.delete").toLocaleLowerCase(),
            itens: deleteItem?.reason_name,
          }) || ""
        }
      />

      <ViewModal
        item={currentItem}
        loading={isAggregatorBlacklistDataFetching}
        modalName={`${t("table.document")}: ${currentItem?.document}`}
        open={isViewModalOpen}
        setOpen={setIsViewModalOpen}
      />
      <Toast
        actionError={t("messages.create")}
        actionSuccess={t("messages.created")}
        error={error}
        success={isSuccess}
      />
      <Toast
        actionError={t("messages.delete")}
        actionSuccess={t("messages.deleted")}
        error={DeleteError}
        success={isDeleteSuccess}
      />
    </Grid>
  );
};
