/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DownloadOutlined, EyeFilled } from "@ant-design/icons";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { Grid } from "@mui/material";
import { CustomTable } from "@src/components/CustomTable";
import { FiltersModal } from "@src/components/FiltersModal";
import { FilterChips } from "@src/components/FiltersModal/filterChips";
import { ViewModal } from "@src/components/Modals/viewGenericModal";
import { useGetTransferBetweenAccountsReports } from "@src/services/reports/moviments/merchant/getTransferBetweenAccountsReports";
import { ReportsQuery } from "@src/services/types/reports/reports.interface";
import { Button } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export const TransferBetweenAccountsReports = () => {
  const INITIAL_QUERY: ReportsQuery = {
    limit: 25,
    page: 1,
  };
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<ReportsQuery>(INITIAL_QUERY);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>();
  const [, setDisable] = useState<boolean>(false);

  const {
    TransferBetweenAccountsReportsData,
    TransferBetweenAccountsReportsDataError,
    isTransferBetweenAccountsReportsDataFetching,
    refetchTransferBetweenAccountsReportsData,
  } = useGetTransferBetweenAccountsReports(query);

  const itemDetails = useMemo(() => {
    if (currentItem) {
      const { __v, ...rest } = currentItem;

      return rest;
    }
  }, [currentItem]);

  useEffect(() => {
    refetchTransferBetweenAccountsReportsData();
  }, [query]);

  useEffect(() => {
    currentItem?.report_url ? setDisable(false) : setDisable(true);
  }, [currentItem]);

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
            loading={isTransferBetweenAccountsReportsDataFetching}
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
        <Grid item xs={12} md={2} lg={2}>
          <Button
            type="dashed"
            loading={isTransferBetweenAccountsReportsDataFetching}
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
                label: "details",
                icon: <EyeFilled style={{ fontSize: "20px" }} />,
                onClick: () => setIsViewModalOpen(true),
              },
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
            refetch={refetchTransferBetweenAccountsReportsData}
            data={TransferBetweenAccountsReportsData}
            items={TransferBetweenAccountsReportsData?.items}
            error={TransferBetweenAccountsReportsDataError}
            columns={[
              { name: "_id", type: "id" },
              { name: "createdAt", type: "date" },
              { name: "created_by_name", type: "text" },
              { name: "start_date_filter", type: "date" },
              { name: "end_date_filter", type: "date" },
              { name: "rows", type: "text" },
              { name: "progress", type: "progress" },
            ]}
            loading={isTransferBetweenAccountsReportsDataFetching}
            label={["createdAt", "progress"]}
          />
        </Grid>
      </Grid>

      <FiltersModal
        open={isFiltersOpen}
        setOpen={setIsFiltersOpen}
        query={query}
        setQuery={setQuery}
        filters={["createdat_start", "createdat_end"]}
        refetch={() => {
          return;
        }}
        selectOptions={{}}
        startDateKeyName="createdat_start"
        endDateKeyName="createdat_end"
        initialQuery={INITIAL_QUERY}
      />

      <ViewModal
        open={isViewModalOpen}
        setOpen={setIsViewModalOpen}
        item={itemDetails}
        loading={false}
        modalName={t("modal.report_details")}
      />
    </Grid>
  );
};
