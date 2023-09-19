/* eslint-disable react-hooks/exhaustive-deps */
import { PlusOutlined } from "@ant-design/icons";
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

import { MutateModal } from "@src/components/Modals/mutateGenericModal";
import { useCreateMerchantBlacklistReason } from "@src/services/register/merchant/blacklist/createMerchantBlacklistReason";
import { useGetRowsMerchantBlacklistReasons } from "@src/services/register/merchant/blacklist/getMerchantBlacklistReason";
import { MerchantBlacklistItem } from "@src/services/types/register/merchants/merchantBlacklist.interface";
import {
  CreateMerchantBlacklistReasons,
  MerchantBlacklistReasonQuery
} from "@src/services/types/register/merchants/merchantBlacklistReasons.interface";

const INITIAL_QUERY: MerchantBlacklistReasonQuery = {
  limit: 25,
  page: 1,
};

export const MerchantBlacklistReasons = () => {
  const [query, setQuery] =
    useState<MerchantBlacklistReasonQuery>(INITIAL_QUERY);
  const { t } = useTranslation();
  const {
    isMerchantBlacklistDataFetching,
    merchantBlacklistData,
    merchantBlacklistDataError,
    refetchMerchantBlacklistData,
  } = useGetRowsMerchantBlacklistReasons(query);

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateReasonOpen, setIsCreateReasonOpen] = useState(false);
  const [body, setBody] = useState<CreateMerchantBlacklistReasons | null>({
    reason_name : "",
  });
  const [currentItem, setCurrentItem] = useState<MerchantBlacklistItem | null>(
    null
  );

  const { error, isLoading, isSuccess, mutate } =
    useCreateMerchantBlacklistReason(body);
  const [search, setSearch] = useState<string>("");
  const debounceSearch = useDebounce(search);

  const columns: ColumnInterface[] = [
    { name: "_id", type: "id" },
    { name: "create_user_name", type: "text" },
    { name: "merchant_name", type: "text" },
    { name: "reason_name", head: "reason", type: "text", sort: true },
    { name: "create_user_name", type: "text" },
    { name: "createdAt", type: "date", sort: true },
  ];

  useEffect(() => {
    refetchMerchantBlacklistData();
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
            style={{ width: "100%", height: 40 }}
            loading={isMerchantBlacklistDataFetching}
            type="primary"
            onClick={() => setIsFiltersOpen(true)}
          >
            {t("table.filters")}
          </Button>
        </Grid>
        <Grid item xs={12} md={4} lg={6}>
          <FilterChips
            startDateKeyName="initial_date"
            endDateKeyName="final_date"
            query={query}
            setQuery={setQuery}
             
          />
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
          >
            <FilterAltOffOutlinedIcon style={{ marginRight: 10 }} />{" "}
            {t("table.clear_filters")}
          </Button>
        </Grid>
        <Grid item xs={12} md={3} lg={2}>
          <Button
            type="primary"
            loading={isMerchantBlacklistDataFetching}
            onClick={() => setIsCreateReasonOpen(true)}
            style={{
              height: 40,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PlusOutlined style={{ marginRight: 10, fontSize: 22 }} />{" "}
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
            data={merchantBlacklistData}
            items={merchantBlacklistData?.items}
            error={merchantBlacklistDataError}
            columns={columns}
            loading={isMerchantBlacklistDataFetching}
            label={["cpf", "merchant_name"]}
            actions={[]}
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

      {isCreateReasonOpen && (
        <MutateModal
          type="create"
          open={isCreateReasonOpen}
          setOpen={setIsCreateReasonOpen}
          fields={[
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
    </Grid>
  );
};
