/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { EyeFilled } from "@ant-design/icons";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { Grid } from "@mui/material";
import { CustomTable } from "@src/components/CustomTable";
import { FiltersModal } from "@src/components/FiltersModal";
import { FilterChips } from "@src/components/FiltersModal/filterChips";
import { ViewModal } from "@src/components/Modals/viewGenericModal";
import { useGetPreManualUploads } from "@src/services/moviments/merchants/preOperations/getUploads";
import useDebounce from "@src/utils/useDebounce";
import { Button } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export const PreManualUploads = () => {
  const INITIAL_QUERY: any = {
    limit: 25,
    page: 1,
  };
  const [query, setQuery] = useState<any>(INITIAL_QUERY);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [searchOption, setSearchOption] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [currentItem, setCurrentItem] = useState<any | null>(null);
  const debounceSearch = useDebounce(search);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const { t } = useTranslation();
  const { data, error, isFetching, refetch } = useGetPreManualUploads(query);

  useEffect(() => {
    refetch();
  }, [query]);

  useEffect(() => {
    if (!debounceSearch) {
      const q = { ...query };
      return setQuery(q);
    }
    if (searchOption && search) {
      setQuery((state: any) => ({ ...state, [searchOption]: debounceSearch }));
    }
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
            loading={isFetching}
            type="primary"
            onClick={() => setIsFiltersOpen(true)}
          >
            {t("table.filters")}
          </Button>
        </Grid>
        <Grid item xs={12} md={6} lg={8}>
          <FilterChips initial_query={INITIAL_QUERY}
            startDateKeyName="createdat_start"
            endDateKeyName="createdat_end"
            query={query}
            setQuery={setQuery}
          />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <Button
            type="dashed"
            loading={isFetching}
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
      </Grid>

      <Grid container style={{ marginTop: "15px" }}>
        <Grid item xs={12}>
          <CustomTable
            query={query}
            setCurrentItem={setCurrentItem}
            setQuery={setQuery}
            data={data}
            items={data?.items}
            error={error}
            columns={[
              { name: "_id", type: "id" },
              { name: "created_by_name", type: "text" },
              { name: "rows", type: "text" },
              { name: "total_rows", type: "text" },
              { name: "failed_rows", type: "text" },
              { name: "progress", type: "progress" },
              { name: "createdAt", type: "date" },
            ]}
            loading={isFetching}
            actions={[
              {
                label: "details",
                icon: <EyeFilled style={{ fontSize: "22px" }} />,
                onClick() {
                  setIsViewModalOpen(true);
                },
              },
            ]}
            label={["created_by_name", "total_rows", "failed_rows", "progress"]}
          />
        </Grid>
      </Grid>

      <FiltersModal
        open={isFiltersOpen}
        setOpen={setIsFiltersOpen}
        query={query}
        setQuery={setQuery}
        filters={["createdat_start", "createdat_end"]}
        refetch={refetch}
        selectOptions={{}}
        startDateKeyName="createdat_start"
        endDateKeyName="createdat_end"
        initialQuery={INITIAL_QUERY}
      />

      <ViewModal
        item={currentItem}
        loading={isFetching}
        open={isViewModalOpen}
        setOpen={setIsViewModalOpen}
        modalName={t("actions.details")}
      />
    </Grid>
  );
};
