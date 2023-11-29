/* eslint-disable react-hooks/exhaustive-deps */
import { EyeFilled, FilterOutlined } from "@ant-design/icons";
import { ColumnInterface, CustomTable } from "@components/CustomTable";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { Grid } from "@mui/material";
import { useExportHistoricCpfByMerchant } from "@src/services/consult/persons/createReportHistoricCpfByMerchant";
import { PersonBlacklistReasonsItem } from "@src/services/types/register/persons/blacklist/reasons.interface";
import { Button } from "antd";
import moment from "moment";
import { useGetHistoricCpfByMerchant } from "@src/services/consult/persons/historicCpfByMerchant";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { HistoricCpfByMerchantQuery } from "@src/services/types/consult/persons/hsitoricCpfByMerchant";
import { FilterChips } from "@src/components/FiltersModal/filterChips";
import { FiltersModal } from "@src/components/FiltersModal";
import { useNavigate } from "react-router-dom";
import { ExportReportsModal } from "@src/components/Modals/exportReportsModal";

const INITIAL_QUERY: HistoricCpfByMerchantQuery = {
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

export const HistoricCpfByMerchant = () => {
  const navigate = useNavigate();
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<HistoricCpfByMerchantQuery>(INITIAL_QUERY);
  const { t } = useTranslation();
  const {
    HistoricCpfByMerchantData,
    HistoricCpfByMerchantDataError,
    isHistoricCpfByMerchantDataFetching,
    refetchHistoricCpfByMerchantData,
  } = useGetHistoricCpfByMerchant(query);

  const {
    HistoricCpfByMerchantReportsError,
    HistoricCpfByMerchantReportsIsLoading,
    HistoricCpfByMerchantReportsIsSuccess,
    HistoricCpfByMerchantReportsMutate,
  } = useExportHistoricCpfByMerchant(query);

  const [, setCurrentItem] = useState<PersonBlacklistReasonsItem | null>(null);

  const columns: ColumnInterface[] = [
    { name: "merchant_id", type: "text", head: "id" },
    { name: "merchant_name", type: "text" },
    { name: "totalCpfChecks", type: "text", head: "total_cpf_checks" },
  ];

  useEffect(() => {
    refetchHistoricCpfByMerchantData();
  }, [query]);

  return (
    <Grid container style={{ padding: "25px" }}>
      <Grid
        container
        style={{ display: "flex", alignItems: "center" }}
        spacing={1}
      >
        <Grid item xs={12} md={3} lg={2}>
          <Button
            size="large"
            style={{ width: "100%" }}
            loading={isHistoricCpfByMerchantDataFetching}
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
            loading={isHistoricCpfByMerchantDataFetching}
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
              !HistoricCpfByMerchantData?.length ||
              HistoricCpfByMerchantDataError
            }
            mutateReport={() => HistoricCpfByMerchantReportsMutate()}
            error={HistoricCpfByMerchantReportsError}
            success={HistoricCpfByMerchantReportsIsSuccess}
            loading={HistoricCpfByMerchantReportsIsLoading}
            reportPath="/consult/consult_persons/reports/historic_cpf_merchant"
          />
        </Grid>
      </Grid>

      <Grid container style={{ marginTop: "30px" }}>
        <Grid item xs={12}>
          <CustomTable
            query={query}
            setCurrentItem={setCurrentItem}
            setQuery={setQuery}
            data={HistoricCpfByMerchantData}
            items={HistoricCpfByMerchantData}
            error={HistoricCpfByMerchantDataError}
            columns={columns}
            loading={isHistoricCpfByMerchantDataFetching}
            label={["merchant_name"]}
            actions={[
              {
                label: "details",
                icon: <EyeFilled style={{ fontSize: "18px" }} />,
                onClick: (item) => navigate("details", { state: item }),
              },
            ]}
          />
        </Grid>
      </Grid>

      {isFiltersOpen && (
        <FiltersModal
          open={isFiltersOpen}
          setOpen={setIsFiltersOpen}
          query={query}
          setQuery={setQuery}
          filters={["start_date", "end_date", "merchant_id"]}
          refetch={refetchHistoricCpfByMerchantData}
          selectOptions={{}}
          startDateKeyName="start_date"
          endDateKeyName="end_date"
          initialQuery={INITIAL_QUERY}
        />
      )}
    </Grid>
  );
};
