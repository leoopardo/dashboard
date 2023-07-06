import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import { useGetBankBlacklist } from "@src/services/support/blacklists/bankBlacklist/getBankBlacklist";
import {
  BankBlacklistItem,
  BankBlacklistQuery,
} from "@src/services/types/support/blacklists/bankBlacklist.interface";
import { Button, Input, Popconfirm, Select } from "antd";
import { useTranslation } from "react-i18next";
import { FilterChips } from "@src/components/FiltersModal/filterChips";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import useDebounce from "@src/utils/useDebounce";
import { CustomTable } from "@src/components/CustomTable";
import { FiltersModal } from "@src/components/FiltersModal";
import { useCreateBankBlacklist } from "@src/services/support/blacklists/bankBlacklist/createBankBlacklist";
import { MutateModal } from "@src/components/Modals/mutateGenericModal";
import { Toast } from "@src/components/Toast";
import { DeleteOutlined } from "@ant-design/icons";
import { useDeleteBankBlacklist } from "@src/services/support/blacklists/bankBlacklist/deteteBankBlacklist";

export const BankBlacklist = () => {
  const INITIAL_QUERY: BankBlacklistQuery = {
    limit: 25,
    page: 1,
  };
  const [query, setQuery] = useState<BankBlacklistQuery>(INITIAL_QUERY);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [searchOption, setSearchOption] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [currentItem, setCurrentItem] = useState<BankBlacklistItem | null>(
    null
  );
  const [body, setBody] = useState<{ bank_name: string; ispb: string }>({
    bank_name: "",
    ispb: "",
  });
  const debounceSearch = useDebounce(search);
  const { t } = useTranslation();
  const {
    BankBlacklist,
    BankBlacklistError,
    isBankBlacklistFetching,
    refetchBankBlacklist,
  } = useGetBankBlacklist(query);

  const { CreateError, CreateIsLoading, CreateIsSuccess, CreateMutate } =
    useCreateBankBlacklist(body);

  const { DeleteError, DeleteIsLoading, DeleteIsSuccess, DeleteMutate } =
    useDeleteBankBlacklist({ ispb: currentItem?.ispb });

  useEffect(() => {
    refetchBankBlacklist();
  }, [query]);

  useEffect(() => {
    if (!debounceSearch) {
      const q = { ...query };
      return setQuery(q);
    }
    if (searchOption && search) {
      setQuery((state) => ({ ...state, [searchOption]: debounceSearch }));
    }
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
            loading={isBankBlacklistFetching}
            type="primary"
            onClick={() => setIsFiltersOpen(true)}
          >
            {t("table.filters")}
          </Button>
        </Grid>
        <Grid item xs={12} md={8} lg={10}>
          <FilterChips
            startDateKeyName="start_date"
            endDateKeyName="end_date"
            query={query}
            setQuery={setQuery}
            haveInitialDate
          />
        </Grid>
      </Grid>
      <Grid container style={{ marginTop: "5px" }} spacing={1}>
        <Grid item xs={12} md={2} lg={2}>
          <Select
            style={{ width: "100%" }}
            size="large"
            onChange={(value) => {
              setSearchOption(value);
              setSearch("");
            }}
            value={searchOption}
            placeholder="Opções"
            options={[
              { value: "ispb", label: t("table.ispb") },
              { value: "bank_name", label: t("table.bank_name") },
            ]}
          />
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <Input
            disabled={!searchOption}
            size="large"
            value={search}
            placeholder={t("table.bank_name") || ""}
            onChange={(event) => {
              setSearch(event.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12} md={3} lg={2}>
          <Button
            type="dashed"
            loading={isBankBlacklistFetching}
            danger
            size="large"
            onClick={() => {
              setQuery(INITIAL_QUERY);
              setSearch("");
              setSearchOption(null);
            }}
            style={{
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
            size="large"
            loading={isBankBlacklistFetching}
            onClick={() => {
              setIsCreateOpen(true);
            }}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
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
            data={BankBlacklist}
            items={BankBlacklist?.items}
            error={BankBlacklistError}
            columns={[
              { name: "ispb", type: "id" },
              { name: "bank_name", type: "bankNameToIcon" },
              { name: "user_id", type: "text" },
              { name: "user_name", type: "text" },
              { name: "createdAt", type: "date" },
            ]}
            loading={isBankBlacklistFetching}
            actions={[
              {
                label: "delete",
                icon: <DeleteOutlined />,
                onClick() {
                  setIsConfirmOpen(true);
                },
              },
            ]}
            isConfirmOpen={isConfirmOpen}
            setIsConfirmOpen={setIsConfirmOpen}
            label={["bank_name", "ispb"]}
            itemToAction={currentItem?.bank_name}
            onConfirmAction={() => DeleteMutate()}
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
          filters={["start_date", "end_date"]}
          refetch={refetchBankBlacklist}
          selectOptions={{}}
          startDateKeyName="start_date"
          endDateKeyName="end_date"
          initialQuery={INITIAL_QUERY}
        />
      )}

      {isCreateOpen && (
        <MutateModal
          type="create"
          open={isCreateOpen}
          setOpen={setIsCreateOpen}
          fields={[
            { label: "bank_name", required: true },
            { label: "ispb", required: true },
          ]}
          body={body}
          setBody={setBody}
          modalName={t("modal.new_bank_blacklist")}
          submit={CreateMutate}
          submitLoading={CreateIsLoading}
          error={CreateError}
          success={CreateIsSuccess}
        />
      )}
      <Toast
        actionSuccess={t("messages.created")}
        actionError={t("messages.create")}
        errorMessage={
          t(
            `error.${CreateError?.response?.data?.message.split(" ").join("_")}`
          ) ?? undefined
        }
        error={CreateError}
        success={CreateIsSuccess}
      />
      <Toast
        actionSuccess={t("messages.deleted")}
        actionError={t("messages.delete")}
        error={DeleteError}
        success={DeleteIsSuccess}
      />
    </Grid>
  );
};
