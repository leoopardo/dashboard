/* eslint-disable react-hooks/exhaustive-deps */
import { PlusOutlined } from "@ant-design/icons";
import { ColumnInterface, CustomTable } from "@components/CustomTable";
import { FiltersModal } from "@components/FiltersModal";
import { FilterChips } from "@components/FiltersModal/filterChips";
import { ViewModal } from "@components/Modals/viewGenericModal";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { Grid } from "@mui/material";
import useDebounce from "@utils/useDebounce";
import { Button, Input } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { MutateModal } from "@src/components/Modals/mutateGenericModal";
import { ReasonSelect } from "@src/components/Selects/reasonSelect";
import { useCreateMerchantBlacklist } from "@src/services/register/merchant/blacklist/createMerchantBlacklist";
import { useGetRowsMerchantBlacklist } from "@src/services/register/merchant/blacklist/getMerchantBlacklist";
import {
  MerchantBlacklistItem,
  MerchantBlacklistQuery,
} from "@src/services/types/register/merchants/merchantBlacklist.interface";

const INITIAL_QUERY: MerchantBlacklistQuery = {
  limit: 25,
  page: 1,
  sort_field: "createdAt",
  sort_order: "DESC",
};

export const MerchantBlacklist = () => {
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
    reason: "",
    description: "",
  });
  const [currentItem, setCurrentItem] = useState<MerchantBlacklistItem | null>(
    null
  );

  const { error, isLoading, isSuccess, mutate } =
    useCreateMerchantBlacklist(body);
  const [search, setSearch] = useState<string>("");
  const debounceSearch = useDebounce(search);

  const columns: ColumnInterface[] = [
    { name: "cpf", type: "id" },
    { name: "merchant_name", type: "text" },
    { name: "reason", type: "text" },
    { name: "description", type: "text" },
    { name: "create_user_name", type: "text" },
    { name: "createdAt", type: "date" },
  ];

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
            style={{ width: "100%", height: 40 }}
            loading={isMerchantBlacklistDataFetching}
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
        <Grid item xs={12} md={2} lg={2}>
          <ReasonSelect queryOptions={query} setQueryFunction={setQuery} />
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <Input
            size="large"
            placeholder={t("table.cpf") || ""}
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
            }}
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
            onClick={() => setIsUpdateModalOpen(true)}
            style={{
              height: 40,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PlusOutlined style={{ marginRight: 10, fontSize: 22 }} />{" "}
            {t("buttons.create_bank_blacklist")}
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
          haveInitialDate
          filters={["start_date", "end_date", "merchant_id"]}
          refetch={refetchMerchantBlacklistData}
          selectOptions={{}}
          startDateKeyName="start_date"
          endDateKeyName="end_date"
          initialQuery={INITIAL_QUERY}
        />
      )}

      {isUpdateModalOpen && (
        <MutateModal
          type="create"
          open={isUpdateModalOpen}
          setOpen={setIsUpdateModalOpen}
          fields={[
            { label: "cpf", required: true },
            { label: "reason", required: true },
            { label: "description", required: true },
          ]}
          body={body}
          setBody={setBody}
          modalName={t("modal.new_bank_blacklist")}
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
