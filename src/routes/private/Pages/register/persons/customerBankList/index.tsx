/* eslint-disable react-hooks/exhaustive-deps */
import { ColumnInterface, CustomTable } from "@components/CustomTable";
import { FiltersModal } from "@components/FiltersModal";
import { FilterChips } from "@components/FiltersModal/filterChips";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { Grid } from "@mui/material";
import { ExportReportsModal } from "@src/components/Modals/exportReportsModal";
import { ViewModal } from "@src/components/Modals/viewGenericModal";
import { useListClientClientBanks } from "@src/services/bank/listClientBanks";
import { queryClient } from "@src/services/queryClient";
import { useCreateCustomerBanksReports } from "@src/services/reports/register/persons/customerBanks/createCustomerBanksReports";
import {
  ClientBankItem,
  ClientBankQuery,
} from "@src/services/types/banks.interface";
import { ValidateInterface } from "@src/services/types/validate.interface";
import useDebounce from "@utils/useDebounce";
import { Button, Input, Select } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const INITIAL_QUERY: ClientBankQuery = {
  limit: 25,
  page: 1,
  sort_field: "createdAt",
  sort_order: "DESC",
};

export const CostumerBanks = () => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const [query, setQuery] = useState<ClientBankQuery>(INITIAL_QUERY);
  const [searchOption, setSearchOption] = useState<string | null>(null);
  const { t } = useTranslation();
  const {
    clientbankListData,
    clientbankListError,
    isClientBankListFetching,
    refetchClientBankList,
  } = useListClientClientBanks(query);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<ClientBankItem | null>(null);
  const [search, setSearch] = useState<string>("");
  const debounceSearch = useDebounce(search);

  const {
    CustomerBanksReportsError,
    CustomerBanksReportsIsLoading,
    CustomerBanksReportsIsSuccess,
    CustomerBanksReportsMutate,
  } = useCreateCustomerBanksReports(query);

  const columns: ColumnInterface[] = [
    { name: "bank_code", type: "text" },
    { name: "bank_name", type: "bankNameToIcon", head: "bank_icon" },
    { name: "bank_name", type: "text", sort: true },
    { name: "ispb", type: "text" },
    { name: "createdAt", type: "date", sort: true },
  ];

  useEffect(() => {
    refetchClientBankList();
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
            loading={isClientBankListFetching}
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
            placeholder={t("input.options")}
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
            loading={isClientBankListFetching}
            danger
            onClick={() => {
              setQuery(INITIAL_QUERY);
              setSearch("");
              setSearchOption(null);
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
        {permissions.register.person.client_banks
          .person_client_banks_export_csv && (
          <Grid item xs={12} md="auto">
            <ExportReportsModal
              disabled={!clientbankListData?.total || clientbankListError}
              mutateReport={() => CustomerBanksReportsMutate()}
              error={CustomerBanksReportsError}
              success={CustomerBanksReportsIsSuccess}
              loading={CustomerBanksReportsIsLoading}
              reportPath="/register/person/person_reports/client_bank_reports"
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
            data={clientbankListData}
            items={clientbankListData?.items}
            error={clientbankListError}
            columns={columns}
            loading={isClientBankListFetching}
            label={["bank_name", "ispb"]}
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
          refetch={refetchClientBankList}
          selectOptions={{}}
          startDateKeyName="start_date"
          endDateKeyName="end_date"
          initialQuery={INITIAL_QUERY}
        />
      )}
      {isViewModalOpen && (
        <ViewModal
          item={currentItem}
          loading={isClientBankListFetching}
          modalName={`${t("menus.partner")}: ${currentItem?._id}`}
          open={isViewModalOpen}
          setOpen={setIsViewModalOpen}
        />
      )}
    </Grid>
  );
};
