import { OrganizationBankStatementTotalsQuery } from "@src/services/types/consult/organization/bankStatement/totals.interface";
import { Grid } from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Totalizers } from "./components/Totalizers";
import { Button, Divider } from "antd";
import { FilterChips } from "@src/components/FiltersModal/filterChips";
import { FiltersModal } from "@src/components/FiltersModal";
import { useGetOrganizationBankStatementTotals } from "@src/services/consult/organization/bankStatement/getTotals";
import { useGetOrganizationPerbank } from "@src/services/consult/organization/bankStatement/getPerBank";
import { CustomTable } from "@src/components/CustomTable";
import { EyeFilled } from "@ant-design/icons";
import { PieChart } from "./components/PieValue";
import { PieFee } from "./components/PieFee";
import { PieBankfee } from "./components/PieBankFee";

const INITIAL_QUERY: OrganizationBankStatementTotalsQuery = {
  start_date: moment(new Date())
    .startOf("day")
    .format("YYYY-MM-DDTHH:mm:ss.SSS"),
  end_date: moment(new Date())
    .add(1, "day")
    .startOf("day")
    .format("YYYY-MM-DDTHH:mm:ss.SSS"),
};

export const OrganizationBankStatement = () => {
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<any>();
  const { t } = useTranslation();
  const [query, setQuery] =
    useState<OrganizationBankStatementTotalsQuery>(INITIAL_QUERY);

  const { OrganizationBankStatementTotals } =
    useGetOrganizationBankStatementTotals(query);
  const {
    OrganizationPerbank,
    OrganizationPerbankError,
    isOrganizationPerbankFetching,
    refetchOrganizationPerbank,
  } = useGetOrganizationPerbank(query);

  useEffect(() => {
    refetchOrganizationPerbank();
  }, [query]);

  return (
    <Grid container style={{ padding: "25px" }}>
      <Grid
        container
        style={{ marginTop: "20px", display: "flex", alignItems: "center" }}
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
        <Grid item xs={12} md={8} lg={10}>
          <FilterChips
            startDateKeyName="start_date"
            endDateKeyName="end_date"
            query={query}
            setQuery={setQuery}
            haveInitialDate
          />
        </Grid>
      </Grid>
      <Totalizers query={query} />

      <Grid container style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
        <Grid xs={6} md={2}>
          <PieChart items={OrganizationBankStatementTotals} />
        </Grid>
        <Grid xs={6} md={2}>
          <PieFee items={OrganizationBankStatementTotals} />
        </Grid>
        <Grid xs={6} md={2}>
          <PieBankfee items={OrganizationBankStatementTotals} />
        </Grid>
        <Grid xs={6} md={2}>
          <PieChart items={OrganizationBankStatementTotals} />
        </Grid>
      </Grid>

      <Grid container style={{ marginTop: "15px" }}>
        <Grid item xs={12}>
          <CustomTable
            query={query}
            setCurrentItem={setCurrentItem}
            setQuery={setQuery}
            data={OrganizationPerbank}
            items={OrganizationPerbank}
            error={OrganizationPerbankError}
            columns={[
              { name: "bank", type: "bankNameToIcon" },
              { name: "number_in", type: "text" },
              { name: "value_in", type: "value" },
              { name: "fee_in", type: "value" },
              { name: "number_out", type: "text" },
              { name: "value_out", type: "value" },
              { name: "fee_out", type: "value" },
              { name: "number_total", type: "text" },
              { name: "value_total", type: "value" },
              { name: "fee_total", type: "value" },
            ]}
            loading={isOrganizationPerbankFetching}
            removeTotal
            label={["bank"]}
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
          refetch={refetchOrganizationPerbank}
          selectOptions={{ payment_type: ["pix", "withdraw"] }}
          startDateKeyName="start_date"
          endDateKeyName="end_date"
          initialQuery={INITIAL_QUERY}
        />
      )}
    </Grid>
  );
};
