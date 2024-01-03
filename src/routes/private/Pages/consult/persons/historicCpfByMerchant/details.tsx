/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { FilterOutlined } from "@ant-design/icons";
import { ColumnInterface, CustomTable } from "@components/CustomTable";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { Grid } from "@mui/material";
import { PersonBlacklistReasonsItem } from "@src/services/types/register/persons/blacklist/reasons.interface";
import { Button, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { HistoricCpfByMerchantQuery } from "@src/services/types/consult/persons/hsitoricCpfByMerchant";
import { FilterChips } from "@src/components/FiltersModal/filterChips";
import { FiltersModal } from "@src/components/FiltersModal";
import { useExportHistoricCpfByMerchantDetails } from "@src/services/consult/persons/exportCsvHistoricCpfByMerchantDetails";
import { useGetHistoricCpfByMerchantDetails } from "@src/services/consult/persons/historicCpfByMerchantDetails";
import { ExportReportsModal } from "@src/components/Modals/exportReportsModal";

export const HistoricCpfByMerchantDetails = () => {
  const location = useLocation();
  const INITIAL_QUERY: HistoricCpfByMerchantQuery = location?.state?.query;

  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<HistoricCpfByMerchantQuery>(INITIAL_QUERY);
  const { t } = useTranslation();
  const {
    HistoricCpfByMerchantDetailsData,
    HistoricCpfByMerchantDetailsDataError,
    isHistoricCpfByMerchantDetailsDataFetching,
    refetchHistoricCpfByMerchantDetailsData,
  } = useGetHistoricCpfByMerchantDetails({
    ...query,
    merchant_id: location.state?.item?.merchant_id,
  });

  const {
    HistoricCpfByMerchantDetailsError,
    HistoricCpfByMerchantDetailsIsLoading,
    HistoricCpfByMerchantDetailsIsSuccess,
    HistoricCpfByMerchantDetailsMutate,
  } = useExportHistoricCpfByMerchantDetails({
    ...query,
    merchant_id: location.state?.item?.merchant_id,
  });

  console.log(location?.state?.query);
  
  const [, setCurrentItem] = useState<PersonBlacklistReasonsItem | null>(null);

  const columns: ColumnInterface[] = [
    { name: "_id", type: "id", head: "id" },
    { name: "user_name", type: "text" },
    { name: "merchant_id", type: "text" },
    { name: "cpf", type: "document" },
    { name: "date", type: "date" },
    { name: "ip", type: "text" },
    { name: "createdAt", type: "date" },
  ];

  useEffect(() => {
    refetchHistoricCpfByMerchantDetailsData();
  }, [query]);

  return (
    <Grid container style={{ padding: "25px" }}>
      <Typography.Title level={4}>
        {t("table.merchant")}: {location?.state?.item?.merchant_name}
      </Typography.Title>

      <Grid
        container
        style={{ display: "flex", alignItems: "center", marginTop: "20px" }}
        spacing={1}
      >
        <Grid item xs={12} md={3} lg={2}>
          <Button
            size="large"
            style={{ width: "100%" }}
            loading={isHistoricCpfByMerchantDetailsDataFetching}
            type="primary"
            icon={<FilterOutlined />}
            onClick={() => setIsFiltersOpen(true)}
          >
            {t("table.filters")}
          </Button>
        </Grid>
        <Grid item xs={12} md={5} lg={6}>
          <FilterChips
            startDateKeyName="start_date"
            endDateKeyName="end_date"
            query={query}
            setQuery={setQuery}
          />
        </Grid>

        <Grid item xs={12} md={2} lg={2}>
          <Button
            size="large"
            type="dashed"
            // loading={isUsersDataFetching}
            danger
            onClick={() => {
              setQuery(INITIAL_QUERY);
            }}
            icon={<FilterAltOffOutlinedIcon />}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {t("table.clear_filters")}
          </Button>
        </Grid>

        <Grid item xs={12} md="auto">
          <ExportReportsModal
            disabled={
              !HistoricCpfByMerchantDetailsData?.items?.length ||
              HistoricCpfByMerchantDetailsDataError
            }
            mutateReport={() => HistoricCpfByMerchantDetailsMutate()}
            error={HistoricCpfByMerchantDetailsError}
            success={HistoricCpfByMerchantDetailsIsSuccess}
            loading={HistoricCpfByMerchantDetailsIsLoading}
            reportPath="/consult/consult_persons/reports/historic_cpf_merchant_details"
          />
        </Grid>
      </Grid>

      <Grid container style={{ marginTop: "50px" }}>
        <Grid item xs={12}>
          <CustomTable
            query={query}
            setCurrentItem={setCurrentItem}
            setQuery={setQuery}
            data={HistoricCpfByMerchantDetailsData}
            items={HistoricCpfByMerchantDetailsData?.items}
            error={HistoricCpfByMerchantDetailsDataError}
            columns={columns}
            loading={isHistoricCpfByMerchantDetailsDataFetching}
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
          filters={["start_date", "end_date"]}
          refetch={refetchHistoricCpfByMerchantDetailsData}
          selectOptions={{}}
          startDateKeyName="start_date"
          endDateKeyName="end_date"
          initialQuery={INITIAL_QUERY}
        />
      )}
    </Grid>
  );
};
