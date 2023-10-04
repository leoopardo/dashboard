/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DownloadOutlined } from "@ant-design/icons";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { Grid } from "@mui/material";
import { CustomTable } from "@src/components/CustomTable";
import { FiltersModal } from "@src/components/FiltersModal";
import { FilterChips } from "@src/components/FiltersModal/filterChips";
import { useGetOrganizationCategoriesReports } from "@src/services/reports/register/organization/getCategoriesReports";
import { ReportsQuery } from "@src/services/types/reports/reports.interface";
import { Button } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export const OrganizationCategoriesReports = () => {
  const INITIAL_QUERY: ReportsQuery = {
    limit: 25,
    page: 1,
  };
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<ReportsQuery>(INITIAL_QUERY);
  const [, setCurrentItem] = useState<any>();

  const {
    CategoriesReportsData,
    CategoriesReportsDataError,
    isCategoriesReportsDataFetching,
    refetchCategoriesReportsData,
  } = useGetOrganizationCategoriesReports(query);

  useEffect(() => {
    refetchCategoriesReportsData();
  }, [query]);

  const { t } = useTranslation();
  return (
    <Grid container style={{ padding: "25px" }}>
      <Grid
        container
        style={{ display: "flex", alignItems: "center" }}
        spacing={1}
      >
        <Grid item xs={12} md={4} lg={2}>
           <Button size="large"
            style={{ width: "100%" }}
            loading={isCategoriesReportsDataFetching}
            type="primary"
            onClick={() => setIsFiltersOpen(true)}
          >
            {t("table.filters")}
          </Button>
        </Grid>
        <Grid item xs={12} md={6} lg={8}>
          <FilterChips
            startDateKeyName="start_date"
            endDateKeyName="end_date"
            query={query}
            setQuery={setQuery}
          />
        </Grid>
        <Grid item xs={12} md={2} lg={2}>
          <Button
            type="dashed"
            loading={isCategoriesReportsDataFetching}
            danger
            onClick={() => {
              setQuery(INITIAL_QUERY);
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
            actions={[
              {
                label: "download",
                icon: <DownloadOutlined style={{ fontSize: "20px" }} />,
                onClick: (item) => {
                  if (item?.report_url)
                    window.location.assign(item?.report_url);
                },
                disabled: (item) => item.status !== "COMPLETED",
              },
            ]}
            data={CategoriesReportsData}
            items={CategoriesReportsData?.items}
            error={CategoriesReportsDataError}
            columns={[
              { name: "_id", type: "id",sort: true },
              { name: "createdAt", type: "date",sort: true },
              { name: "created_by_name", type: "text" },
              { name: "rows", type: "text" },
              { name: "progress", type: "progress" },
            ]}
            loading={isCategoriesReportsDataFetching}
            label={["createdAt", "progress"]}
          />
        </Grid>
      </Grid>

      {isFiltersOpen && (
        <FiltersModal
          open={isFiltersOpen}
          setOpen={setIsFiltersOpen}
          query={query}
          setQuery={setQuery}
          filters={["start_date", "end_date"]}
          refetch={() => {
            return;
          }}
          selectOptions={{}}
          startDateKeyName="start_date"
          endDateKeyName="end_date"
          initialQuery={INITIAL_QUERY}
        />
      )}
    </Grid>
  );
};
