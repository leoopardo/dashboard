/* eslint-disable react-hooks/exhaustive-deps */
import { Grid } from "@mui/material";
import { Button, Input } from "antd";
import { useEffect, useState } from "react";
import { FilterChips } from "@components/FiltersModal/filterChips";
import { useTranslation } from "react-i18next";
import { FiltersModal } from "@components/FiltersModal";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { ColumnInterface, CustomTable } from "@components/CustomTable";
import useDebounce from "@utils/useDebounce";
import { useGetOrganizationCategories } from "@services/register/organization/categories/getCategories";
import { BankMaintenenceQuery } from "@src/services/types/bankMaintenence.interface";
import { useGetOrganizationBankMaintenece } from "@src/services/register/organization/bankMaitenence";

const INITIAL_QUERY: BankMaintenenceQuery = {
  limit: 25,
  page: 1,
  sort_field: "id",
  sort_order: "DESC",
};

export const BankMaintenence = () => {
  const [query, setQuery] = useState<BankMaintenenceQuery>(INITIAL_QUERY);
  const { t } = useTranslation();

  const {
    BankMainteneceData,
    BankMainteneceDataError,
    isBankMainteneceDataFetching,
    refetchBankMainteneceData,
  } = useGetOrganizationBankMaintenece(query);

  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [search, setSearch] = useState<string>("");
  const debounceSearch = useDebounce(search);

  const columns: ColumnInterface[] = [
    { name: "icon_url", type: "icon" },
    { name: "label_name", type: "text" },
    { name: "priority", type: "text" },
    { name: "agency", type: "text" },
    { name: "account", type: "text" },
    { name: "status", type: "status" },
    { name: "bank_fee", type: "text" },
    { name: "cash_in", type: "boolean" },
    { name: "cash_out", type: "boolean" },
    { name: "created_at", type: "date" },
  ];

  useEffect(() => {
    refetchBankMainteneceData();
  }, [query]);

  useEffect(() => {
    if (!debounceSearch) {
      const q = { ...query };
      return setQuery(q);
    }
    setQuery((state) => ({ ...state, name: debounceSearch }));
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
            loading={isBankMainteneceDataFetching}
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
            loading={isBankMainteneceDataFetching}
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
      </Grid>

      <Grid container style={{ marginTop: "15px" }}>
        <Grid item xs={12}>
          {" "}
          <CustomTable
            query={query}
            setCurrentItem={setCurrentItem}
            setQuery={setQuery}
            data={BankMainteneceData}
            items={BankMainteneceData?.itens}
            error={BankMainteneceDataError}
            columns={columns}
            loading={isBankMainteneceDataFetching}
            label={["label_name"]}
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
          refetch={refetchBankMainteneceData}
          selectOptions={{}}
          startDateKeyName="start_date"
          endDateKeyName="end_date"
          initialQuery={INITIAL_QUERY}
        />
      )}
    </Grid>
  );
};
