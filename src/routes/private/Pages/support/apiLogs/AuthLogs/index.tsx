/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { EyeFilled } from "@ant-design/icons";
import { Grid } from "@mui/material";
import { CustomTable } from "@src/components/CustomTable";
import { FiltersModal } from "@src/components/FiltersModal";
import { FilterChips } from "@src/components/FiltersModal/filterChips";
import { ViewModal } from "@src/components/Modals/viewGenericModal";
import { useGetAuthLogs } from "@src/services/support/apiLogs/authLogs/getAuthLogs";
import { AuthLogsQuery } from "@src/services/types/support/apiLogs/authLogs.interface";
import { DepositLogsItem } from "@src/services/types/support/apiLogs/depositsError.interface";
import { Button } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export const AuthLogs = () => {
  const INITIAL_QUERY: AuthLogsQuery = {
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
  const { t } = useTranslation();
  const [query, setQuery] = useState<AuthLogsQuery>(INITIAL_QUERY);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<DepositLogsItem | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);

  const { AuthLogs, AuthLogsError, isAuthLogsFetching, refetchAuthLogs } =
    useGetAuthLogs(query);

  useEffect(() => {
    refetchAuthLogs();
  }, [query]);

  return (
    <Grid container style={{ padding: "25px" }}>
      <Grid
        container
        style={{
          display: "flex",
          alignItems: "center",
        }}
        spacing={1}
      >
        <Grid item xs={12} md={4} lg={2}>
          <Button
            size="large"
            style={{ width: "100%" }}
            loading={isAuthLogsFetching}
            type="primary"
            onClick={() => setIsFiltersOpen(true)}
          >
            {t("table.filters")}
          </Button>
        </Grid>
        <Grid item xs={12} md={8} lg={10}>
          <FilterChips initial_query={INITIAL_QUERY}
            startDateKeyName="start_date"
            endDateKeyName="end_date"
            query={query}
            setQuery={setQuery}
            haveInitialDate
          />
        </Grid>
      </Grid>

      <Grid container style={{ marginTop: "15px" }}>
        <Grid item xs={12}>
          <CustomTable
            query={query}
            setCurrentItem={setCurrentItem}
            setQuery={setQuery}
            data={AuthLogs}
            items={AuthLogs?.items}
            error={AuthLogsError}
            removeTotal
            refetch={refetchAuthLogs}
            columns={[
              { name: "_id", type: "id", sort: true },
              { name: "merchant_name", type: "text" },
              { name: "partner_name", type: "text" },
              { name: "error_message", type: "text" },
              { name: "success", type: "boolean" },
              { name: "ip", type: "text" },
              { name: "createdAt", type: "date", sort: true },
            ]}
            loading={isAuthLogsFetching}
            label={["merchant_name", "success", "ip", "error_message", "step"]}
            actions={[
              {
                label: "details",
                icon: <EyeFilled style={{ fontSize: "20px" }} />,
                onClick: () => {
                  setIsDetailsOpen(true);
                },
              },
            ]}
          />
        </Grid>
      </Grid>

      <FiltersModal
        open={isFiltersOpen}
        setOpen={setIsFiltersOpen}
        query={query}
        setQuery={setQuery}
        haveInitialDate
        filters={["start_date", "end_date"]}
        refetch={refetchAuthLogs}
        selectOptions={{}}
        startDateKeyName="start_date"
        endDateKeyName="end_date"
        initialQuery={INITIAL_QUERY}
      />

      {isDetailsOpen && (
        <ViewModal
          open={isDetailsOpen}
          setOpen={setIsDetailsOpen}
          item={currentItem}
          modalName={`Log: ${currentItem?._id}`}
          loading={isAuthLogsFetching}
        />
      )}
    </Grid>
  );
};
