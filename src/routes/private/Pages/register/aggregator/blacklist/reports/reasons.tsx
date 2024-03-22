/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DownloadOutlined, EyeFilled } from "@ant-design/icons";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { Grid } from "@mui/material";
import { CustomTable } from "@src/components/CustomTable";
import { FiltersModal } from "@src/components/FiltersModal";
import { FilterChips } from "@src/components/FiltersModal/filterChips";
import { ViewModal } from "@src/components/Modals/viewGenericModal";
import { Button } from "antd";
import { queryClient } from "@src/services/queryClient";
import { useEffect, useState } from "react";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { useTranslation } from "react-i18next";
import { PersonBlacklistUploadsQuery } from "@src/services/types/register/persons/blacklist/uploads.interface";
import { useGetAggregatorBlacklistReasons } from "@src/services/register/aggregator/blacklist/getAggregatorBlacklistReasonsCsv";

export const AggregatorBlacklistReasonsReports = () => {
  const INITIAL_QUERY: PersonBlacklistUploadsQuery = {
    limit: 25,
    page: 1,
  };
  const { type } = queryClient.getQueryData("validate") as ValidateInterface;
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<PersonBlacklistUploadsQuery>(INITIAL_QUERY);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>();
  const [, setDisable] = useState<boolean>(false);

  const {
    data,
    isFetching,
    error,
    refetch,
  } = useGetAggregatorBlacklistReasons(query);

  useEffect(() => {
    refetch();
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
        <Grid item xs={12} md={2} lg={2}>
          <Button
            type="dashed"
            loading={isFetching}
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
                disabled: () => type !== 1 && type !== 2,
              },
            ]}
            refetch={refetch}
            data={data}
            items={data?.items}
            error={error}
            columns={[
              { name: "_id", type: "id", sort: true },
              { name: "createdAt", type: "date", sort: true },
              { name: "created_by_name", type: "text" },
              { name: "rows", type: "text" },
              { name: "can_be_deleted_only_by_organization", type: "boolean" },
              { name: "progress", type: "progress" },
            ]}
            loading={isFetching}
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
        item={currentItem}
        loading={false}
        modalName={t("modal.report_details")}
      />
    </Grid>
  );
};
