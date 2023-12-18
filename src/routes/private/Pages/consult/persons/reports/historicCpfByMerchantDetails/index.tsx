/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import { Button } from "antd";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { FilterChips } from "@src/components/FiltersModal/filterChips";
import { ReportsQuery } from "@src/services/types/reports/reports.interface";
import { FiltersModal } from "@src/components/FiltersModal";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { CustomTable } from "@src/components/CustomTable";
import { DownloadOutlined, EyeFilled } from "@ant-design/icons";
import { ViewModal } from "@src/components/Modals/viewGenericModal";
import { useGetReportsHistoricCpfMerchantDetails } from "@src/services/consult/persons/getReportsHistoricCpfByMerchantDetails";

export const HistoricCpfByMerchantDetailsReports = () => {
  const INITIAL_QUERY: ReportsQuery = {
    limit: 25,
    page: 1,
    start_date: moment(new Date())
      .startOf("day")
      .add(3, "hours")
      .format("YYYY-MM-DDTHH:mm:ss.SSS"),
    end_date: moment(new Date())
      .add(1, "day")
      .startOf("day")
      .add(3, "hours")
      .format("YYYY-MM-DDTHH:mm:ss.SSS"),
  };
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [query, setQuery] = useState<ReportsQuery>(INITIAL_QUERY);
  const [currentItem, setCurrentItem] = useState<any>();

  const {
    ReportsHistoricCpfMerchantDetailsData,
    ReportsHistoricCpfMerchantDetailsDataError,
    isReportsHistoricCpfMerchantDetailsDataFetching,
    refetchReportsHistoricCpfMerchantDetailsData,
  } = useGetReportsHistoricCpfMerchantDetails(query);

  useEffect(() => {
    refetchReportsHistoricCpfMerchantDetailsData();
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
            size="large"
            style={{ width: "100%" }}
            loading={isReportsHistoricCpfMerchantDetailsDataFetching}
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
            loading={isReportsHistoricCpfMerchantDetailsDataFetching}
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
              {
                label: "details",
                icon: <EyeFilled style={{ fontSize: "20px" }} />,
                onClick: () => setIsViewModalOpen(true),
              },
            ]}
            refetch={refetchReportsHistoricCpfMerchantDetailsData}
            data={ReportsHistoricCpfMerchantDetailsData}
            items={ReportsHistoricCpfMerchantDetailsData?.items}
            error={ReportsHistoricCpfMerchantDetailsDataError}
            columns={[
              { name: "_id", type: "id", sort: true },
              { name: "createdAt", type: "date", sort: true },
              { name: "created_by_name", type: "text" },
              { name: "rows", type: "text", sort: true },
              { name: "progress", type: "progress", sort: true },
            ]}
            loading={isReportsHistoricCpfMerchantDetailsDataFetching}
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
      {isViewModalOpen && (
        <ViewModal
          open={isViewModalOpen}
          setOpen={setIsViewModalOpen}
          item={currentItem}
          loading={false}
          modalName={t("modal.report_details")}
        />
      )}
    </Grid>
  );
};
