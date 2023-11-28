/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { EyeFilled, ReloadOutlined } from "@ant-design/icons";
import { Grid } from "@mui/material";
import { CustomTable } from "@src/components/CustomTable";
import { FiltersModal } from "@src/components/FiltersModal";
import { FilterChips } from "@src/components/FiltersModal/filterChips";
import { useGetOrganizationBankMaintenece } from "@src/services/register/organization/bankMaitenence/getBanks";
import { useGetWithdrawLogsSteps } from "@src/services/support/apiLogs/WithdrawalsErrors/ListSteps";
import { useGetWithdrawErrorsLogById } from "@src/services/support/apiLogs/WithdrawalsErrors/getWithdrawalsErrorLogById";
import { useGetWithdrawalsErrorsLogs } from "@src/services/support/apiLogs/WithdrawalsErrors/getWithdrawalsErrorLogs";
import { useGetWithdrawalsErrorsTotal } from "@src/services/support/apiLogs/WithdrawalsErrors/getWithdrawalsErrorStepsTotal";
import {
  DepositLogsItem,
  DepositsLogsStepsTotalQuery,
} from "@src/services/types/support/apiLogs/depositsError.interface";
import { Avatar, Button, Card, Col, Row, Statistic, Select } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LogDetailsModal } from "../components/LogDetailsModal";
import { LogsColors } from "../utils/logsColors";
import { Search } from "@src/components/Inputs/search";

export const WithdrawalsErrors = () => {
  const INITIAL_QUERY: DepositsLogsStepsTotalQuery = {
    limit: 10,
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
  const [query, setQuery] =
    useState<DepositsLogsStepsTotalQuery>(INITIAL_QUERY);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<DepositLogsItem | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const [searchOption, setSearchOption] = useState<string | undefined>(
    undefined
  );

  const { LogsSteps, refetchLogsSteps } = useGetWithdrawLogsSteps(query);

  const {
    WithdrawalsErrorsTotal,
    isWithdrawalsErrorsTotalFetching,
    refetchWithdrawalsErrorsTotal,
  } = useGetWithdrawalsErrorsTotal(query);

  const {
    WithdrawalsErrorsLogs,
    WithdrawalsErrorsLogsError,
    isWithdrawalsErrorsLogsFetching,
    refetchWithdrawalsErrorsLogs,
  } = useGetWithdrawalsErrorsLogs(query);

  const { WithdrawErrorLog, refetchWithdrawErrorLog } =
    useGetWithdrawErrorsLogById(currentItem?._id);

  const { BankMainteneceData } = useGetOrganizationBankMaintenece({
    limit: 200,
    page: 1,
    sort_field: "label_name",
    sort_order: "DESC",
  });

  useEffect(() => {
    refetchWithdrawalsErrorsTotal();
    refetchWithdrawalsErrorsLogs();
    refetchLogsSteps();
  }, [query]);

  return (
    <Grid container style={{ padding: "25px" }}>
      {WithdrawalsErrorsTotal && WithdrawalsErrorsTotal?.length >= 1 && (
        <Row
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
          gutter={[8, 8]}
          align="middle"
        >
          {WithdrawalsErrorsTotal?.map((error) => (
            <Col>
              <Card bordered={false}>
                <Statistic
                  loading={isWithdrawalsErrorsTotalFetching}
                  title={t(`logs.${error.step.toLowerCase()}`)}
                  value={error.total}
                  style={{ wordBreak: "break-word" }}
                  valueStyle={{ fontSize: "16px" }}
                  prefix={
                    <Avatar
                      src={
                        BankMainteneceData?.itens.find(
                          (bank) =>
                            bank.label_name?.split(" ").join("_") === error.step
                        )?.icon_url ?? null
                      }
                      style={{
                        backgroundColor: (LogsColors as any)[error.step],
                      }}
                      size="small"
                      shape="circle"
                    />
                  }
                />
              </Card>
            </Col>
          ))}
          <Col span="auto">
            <Button
              style={{ width: "100%" }}
              size="large"
              shape="circle"
              type="dashed"
              loading={isWithdrawalsErrorsTotalFetching}
              onClickCapture={() => {
                refetchWithdrawalsErrorsTotal();
              }}
            >
              <ReloadOutlined />
            </Button>
          </Col>
        </Row>
      )}

      <Grid
        container
        style={{
          display: "flex",
          alignItems: "center",
          marginTop:
            WithdrawalsErrorsTotal && WithdrawalsErrorsTotal?.length >= 1
              ? "10px"
              : 0,
        }}
        spacing={1}
      >
        <Grid item xs={12} md={4} lg={2}>
          <Button
            size="large"
            style={{ width: "100%" }}
            loading={isWithdrawalsErrorsTotalFetching}
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

      <Grid container style={{ marginTop: "5px" }} spacing={1}>
        <Grid item xs={12} md={2} lg={2}>
          <Select
            style={{ width: "100%" }}
            size="large"
            onChange={(value) => {
              setSearchOption(value);
            }}
            value={searchOption}
            placeholder={t("input.options")}
            options={[
              { value: "ip", label: t("table.ip") },
              { value: "document", label: t("table.document") },
              { value: "description", label: t("table.description") },
              { value: "reference_id", label: t("table.reference_id") },
            ]}
          />
        </Grid>
        <Grid item xs={12} md={3} lg={4}>
          <Search
            query={query}
            setQuery={setQuery}
            searchOption={searchOption}
          />
        </Grid>
      </Grid>

      <Grid container style={{ marginTop: "15px" }}>
        <Grid item xs={12}>
          <CustomTable
            query={query}
            setCurrentItem={setCurrentItem}
            setQuery={setQuery}
            data={WithdrawalsErrorsLogs}
            items={WithdrawalsErrorsLogs?.items}
            error={WithdrawalsErrorsLogsError}
            removeTotal
            columns={[
              { name: "_id", type: "id", sort: true },
              { name: "merchant_id", type: "text" },
              { name: "partner_id", type: "text" },
              { name: "document", type: "document" },
              { name: "error_message", type: "text" },
              { name: "step", type: "text", sort: true },
              { name: "createdAt", type: "date", sort: true },
            ]}
            loading={isWithdrawalsErrorsLogsFetching}
            label={["merchant_name", "error_message", "step"]}
            actions={[
              {
                label: "details",
                icon: <EyeFilled style={{ fontSize: "20px" }} />,
                onClick: () => {
                  setIsDetailsOpen(true);
                  refetchWithdrawErrorLog();
                },
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
          haveInitialDate
          filters={[
            "start_date",
            "end_date",
            "partner_id",
            "merchant_id",
            "aggregator_id",
            "operator_id",
            "step",
          ]}
          refetch={refetchWithdrawalsErrorsTotal}
          selectOptions={{ step: LogsSteps?.map((step) => step.step) }}
          startDateKeyName="start_date"
          endDateKeyName="end_date"
          initialQuery={INITIAL_QUERY}
        />
      )}

      {isDetailsOpen && (
        <LogDetailsModal
          open={isDetailsOpen}
          setOpen={setIsDetailsOpen}
          data={WithdrawErrorLog}
        />
      )}
    </Grid>
  );
};
