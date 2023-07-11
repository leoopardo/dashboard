import { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import { Button } from "antd";
import { useTranslation } from "react-i18next";
import { FilterChips } from "@src/components/FiltersModal/filterChips";
import { ReportsQuery } from "@src/services/types/reports/reports.interface";
import { FiltersModal } from "@src/components/FiltersModal";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { CustomTable } from "@src/components/CustomTable";
import { DownloadOutlined } from "@ant-design/icons";
import moment from "moment";
import { useGetConsultMerchantReports } from "@src/services/reports/consult/merchant/getConsultMerchantReports";

export const ConsultMerchantReports = () => {
  const INITIAL_QUERY: ReportsQuery = {
    limit: 25,
    page: 1,
    start_date: moment(new Date())
      .startOf("day")
      .format("YYYY-MM-DDTHH:mm:ss.SSS"),
    end_date: moment(new Date())
      .add(1, "day")
      .startOf("day")
      .format("YYYY-MM-DDTHH:mm:ss.SSS"),
  };
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<ReportsQuery>(INITIAL_QUERY);
  const [, setCurrentItem] = useState<any>();

  const {
    ConsultMerchantReportsData,
    ConsultMerchantReportsDataError,
    isConsultMerchantReportsDataFetching,
    refetchConsultMerchantReportsData,
  } = useGetConsultMerchantReports(query);

  useEffect(() => {
    refetchConsultMerchantReportsData();
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
          <Button
            style={{ width: "100%", height: 40 }}
            loading={isConsultMerchantReportsDataFetching}
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
            loading={isConsultMerchantReportsDataFetching}
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
            data={ConsultMerchantReportsData}
            items={ConsultMerchantReportsData?.items}
            error={ConsultMerchantReportsDataError}
            columns={[
              { name: "_id", type: "id" },
              { name: "createdAt", type: "date" },
              { name: "created_by_name", type: "text" },
              { name: "rows", type: "text" },
              { name: "progress", type: "progress" },
            ]}
            loading={isConsultMerchantReportsDataFetching}
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