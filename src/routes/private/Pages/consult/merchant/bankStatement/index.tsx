import { Grid } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Totalizers } from "./components/totalizers";
import { Button, Spin } from "antd";
import { FilterChips } from "@src/components/FiltersModal/filterChips";
import { FiltersModal } from "@src/components/FiltersModal";
import { CustomTable } from "@src/components/CustomTable";
import { ReloadOutlined } from "@ant-design/icons";
import { useGetMerchantBankStatementTotals } from "@src/services/consult/merchant/bankStatement/getTotals";
import { MerchantBankStatementTotalsQuery } from "@src/services/types/consult/merchant/bankStatement";
import { MerchantHourlyLineChart } from "./components/HourlyChart";
import { useGetHourly } from "@src/services/consult/merchant/bankStatement/getHourly";
import { useGetMerchantTransactions } from "@src/services/consult/merchant/bankStatement/getTransactions";

const INITIAL_QUERY: MerchantBankStatementTotalsQuery = {
  page: 1,
  limit: 25,
  start_date: moment(new Date())
    .startOf("day")
    .format("YYYY-MM-DDTHH:mm:ss.SSS"),
  end_date: moment(new Date())
    .add(1, "day")
    .startOf("day")
    .format("YYYY-MM-DDTHH:mm:ss.SSS"),
};

export const MerchantBankStatement = () => {
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [, setCurrentItem] = useState<any>();
  const { t } = useTranslation();
  const [query, setQuery] =
    useState<MerchantBankStatementTotalsQuery>(INITIAL_QUERY);

  const {
    isMerchantBankStatementTotalsFetching,
    refetchMerchantBankStatementTotalsTotal,
  } = useGetMerchantBankStatementTotals(query);

  const { Hourly, refetchHourlyTotal } = useGetHourly(query);
  const {
    MerchantTransactions,
    isMerchantTransactionsFetching,
    MerchantTransactionsError,
    refetchMerchantTransactionsTotal,
  } = useGetMerchantTransactions(query);

  useEffect(() => {
    refetchHourlyTotal();
    refetchMerchantTransactionsTotal();
  }, [query]);

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
            type="primary"
            onClick={() => setIsFiltersOpen(true)}
          >
            {t("table.filters")}
          </Button>
        </Grid>
        <Grid item xs={12} md={4} lg={6}>
          <FilterChips
            startDateKeyName="start_date"
            endDateKeyName="end_date"
            query={query}
            setQuery={setQuery}
            haveInitialDate
          />
        </Grid>
        <Grid item xs={12} md={2} lg={2}>
          <Button
            style={{ width: "100%" }}
            size="large"
            type="dashed"
            danger
            loading={isMerchantTransactionsFetching}
            onClickCapture={() => setQuery(INITIAL_QUERY)}
          >
            {t("table.clear_filters")}
          </Button>
        </Grid>
        <Grid item xs={12} md={2} lg={2}>
          <Button
            style={{ width: "100%" }}
            type="primary"
            size="large"
            loading={isMerchantBankStatementTotalsFetching}
            onClick={() => {
              refetchMerchantTransactionsTotal();
              refetchMerchantBankStatementTotalsTotal();
            }}
          >
            <ReloadOutlined /> {t("buttons.refresh")}
          </Button>
        </Grid>
      </Grid>

      <Totalizers query={query} />

      <Grid
        item
        xs={12}
        style={{ marginTop: "25px", paddingLeft: "3%", paddingRight: "3%" }}
      >
        <MerchantHourlyLineChart items={Hourly} />
      </Grid>

      {isMerchantBankStatementTotalsFetching && (
        <Grid container>
          <Grid
            item
            xs={12}
            style={{
              height: "200px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#FAFAFA",
            }}
          >
            <Spin tip={t("messages.loading")} size="default">
              <Grid item xs={12} style={{ height: "50px" }} />
            </Spin>{" "}
          </Grid>
        </Grid>
      )}

      <Grid container style={{ marginTop: "15px" }}>
        <Grid item xs={12}>
          <CustomTable
            query={query}
            setCurrentItem={setCurrentItem}
            setQuery={setQuery}
            data={MerchantTransactions}
            items={MerchantTransactions?.items}
            error={MerchantTransactionsError}
            columns={[
              { name: "bank_name", type: "bankNameToIcon" },
              { name: "bank_account_number", type: "text" },
              { name: "paid_at", type: "date" },
              { name: "transaction_type", type: "text" },
              { name: "fee_type", type: "text" },
              { name: "value", type: "value" },
              { name: "fee_percent", type: "text" },
              { name: "fee", type: "value" },
            ]}
            loading={isMerchantTransactionsFetching}
            removeTotal
            label={["bank"]}
            removePagination
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
          filters={["start_date", "end_date", "payment_type", "bank"]}
          refetch={refetchMerchantBankStatementTotalsTotal}
          selectOptions={{ payment_type: ["pix", "withdraw"] }}
          startDateKeyName="start_date"
          endDateKeyName="end_date"
          initialQuery={INITIAL_QUERY}
        />
      )}
    </Grid>
  );
};
