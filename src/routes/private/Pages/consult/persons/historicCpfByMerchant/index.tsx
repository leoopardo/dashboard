/* eslint-disable react-hooks/exhaustive-deps */
import {
  DownOutlined,
  EyeFilled,
  FileAddOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { ColumnInterface, CustomTable } from "@components/CustomTable";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { Grid } from "@mui/material";
import { FiltersModal } from "@src/components/FiltersModal";
import { FilterChips } from "@src/components/FiltersModal/filterChips";
import { useExportHistoricCnpjByMerchant } from "@src/services/consult/persons/createReportHistoricCnpjByMerchant";
import { useExportHistoricCpfByMerchant } from "@src/services/consult/persons/createReportHistoricCpfByMerchant";
import { useGetHistoricCnpjByMerchant } from "@src/services/consult/persons/historicCnpjByMerchant";
import { useGetHistoricCpfByMerchant } from "@src/services/consult/persons/historicCpfByMerchant";
import { HistoricCpfByMerchantQuery } from "@src/services/types/consult/persons/hsitoricCpfByMerchant";
import { PersonBlacklistReasonsItem } from "@src/services/types/register/persons/blacklist/reasons.interface";
import {
  Badge,
  Button,
  Dropdown,
  Space,
  Tabs,
  Typography,
  notification,
} from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

type NotificationType = "success" | "info" | "warning" | "error";

const INITIAL_QUERY: HistoricCpfByMerchantQuery = {
  limit: 25,
  page: 1,
  start_date: moment(new Date())
    .startOf("day")
    .utc()
    .format("YYYY-MM-DDTHH:mm:ss.SSS"),
  end_date: moment(new Date())
    .add(1, "day")
    .startOf("day")
    .utc()
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
  const [api, contextHolder] = notification.useNotification();

  const {
    HistoricCnpjByMerchantData,
    HistoricCnpjByMerchantDataError,
    isHistoricCnpjByMerchantDataFetching,
    refetchHistoricCnpjByMerchantData,
  } = useGetHistoricCnpjByMerchant(query);

  const {
    HistoricCpfByMerchantReportsIsLoading,
    HistoricCpfByMerchantReportsIsSuccess,
    HistoricCpfByMerchantReportsMutate,
  } = useExportHistoricCpfByMerchant(query);

  const {
    HistoricCnpjByMerchantReportsIsLoading,
    HistoricCnpjByMerchantReportsIsSuccess,
    HistoricCnpjByMerchantReportsMutate,
  } = useExportHistoricCnpjByMerchant(query);

  const [, setCurrentItem] = useState<PersonBlacklistReasonsItem | null>(null);

  const columns: ColumnInterface[] = [
    { name: "merchant_id", type: "text", head: "id" },
    { name: "merchant_name", type: "text" },
    { name: "totalCpfChecks", type: "text", head: "total_cpf_checks" },
  ];

  useEffect(() => {
    refetchHistoricCpfByMerchantData();
    refetchHistoricCnpjByMerchantData();
  }, [query]);

  const openNotificationWithIcon = (type: NotificationType, path: string) => {
    const BtnNavigate = (
      <Button onClick={() => navigate(path)}>{t("menus.reports")}</Button>
    );
    api[type]({
      message: t("messages.creating_csv"),
      description: t("messages.creating_csv_message"),
      duration: 0,
      btn: BtnNavigate,
    });
  };

  useEffect(() => {
    if (HistoricCpfByMerchantReportsIsSuccess) {
      openNotificationWithIcon(
        "info",
        "/consult/consult_persons/reports/historic_cpf_merchant_reports"
      );
    }
  }, [HistoricCpfByMerchantReportsIsSuccess]);

  useEffect(() => {
    if (HistoricCnpjByMerchantReportsIsSuccess) {
      openNotificationWithIcon(
        "info",
        "/consult/consult_persons/reports/historic_cnpj_merchant_reports"
      );
    }
  }, [HistoricCnpjByMerchantReportsIsSuccess]);

  return (
    <Grid container style={{ padding: "25px" }}>
      {contextHolder}
      <Grid
        container
        style={{ display: "flex", alignItems: "center" }}
        spacing={1}
      >
        <Grid item xs={12} md={8} lg={8}>
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
            <Grid item xs={12} md={9} lg={10}>
              <FilterChips
                initial_query={INITIAL_QUERY}
                startDateKeyName="start_date"
                endDateKeyName="end_date"
                query={query}
                setQuery={setQuery}
                haveInitialDate
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid
          container
          item
          xs={12}
          md={4}
          lg={4}
          spacing={1}
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <Grid item xs={12} md={6} lg={7}>
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

          <Grid item xs={12} md={4} lg={4}>
            <Dropdown
              menu={{
                items: [
                  {
                    label: "CPF",
                    key: "cpf",
                    onClick: () => {
                      HistoricCpfByMerchantReportsMutate();
                    },
                    disabled: HistoricCpfByMerchantData?.length === 0,
                  },
                  {
                    label: "CNPJ",
                    key: "cnpj",
                    onClick: () => {
                      HistoricCnpjByMerchantReportsMutate();
                    },
                    disabled: HistoricCnpjByMerchantData?.length === 0,
                  },
                ],
              }}
            >
              <Button
                style={{ width: "100%" }}
                size="large"
                loading={
                  HistoricCpfByMerchantReportsIsLoading ||
                  HistoricCnpjByMerchantReportsIsLoading
                }
                shape="round"
                icon={<FileAddOutlined style={{ fontSize: 22 }} />}
              >
                <Space>
                  CSV <DownOutlined style={{ fontSize: 12 }} />
                </Space>
              </Button>
            </Dropdown>
          </Grid>
        </Grid>
      </Grid>

      <Grid container style={{ marginTop: "8px" }}>
        <Grid item xs={12}>
          <Tabs
            items={[
              {
                label: (
                  <Badge count={HistoricCpfByMerchantData?.length}>
                    <Typography style={{ width: 32, marginLeft: 8 }}>
                      CPF
                    </Typography>
                  </Badge>
                ),
                key: "cpf",
                children: (
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
                    refetch={refetchHistoricCpfByMerchantData}
                    removePagination
                    actions={[
                      {
                        label: "details",
                        icon: <EyeFilled style={{ fontSize: "18px" }} />,
                        onClick: (item) => {
                          navigate("details", {
                            state: { item: item, query, cpf: true },
                          });
                        },
                      },
                    ]}
                  />
                ),
              },
              {
                label: (
                  <Badge count={HistoricCnpjByMerchantData?.length}>
                    <Typography style={{ width: 38, marginLeft: 8 }}>
                      CNPJ
                    </Typography>
                  </Badge>
                ),
                key: "cnpj",
                children: (
                  <CustomTable
                    query={query}
                    setCurrentItem={setCurrentItem}
                    setQuery={setQuery}
                    data={HistoricCnpjByMerchantData}
                    items={HistoricCnpjByMerchantData}
                    error={HistoricCnpjByMerchantDataError}
                    columns={[
                      { name: "merchant_id", type: "text", head: "id" },
                      { name: "merchant_name", type: "text" },

                      {
                        name: "totalCnpjChecks",
                        type: "text",
                        head: "total_cnpj_checks",
                      },
                    ]}
                    loading={isHistoricCnpjByMerchantDataFetching}
                    label={["merchant_name"]}
                    refetch={refetchHistoricCnpjByMerchantData}
                    removePagination
                    actions={[
                      {
                        label: "details",
                        icon: <EyeFilled style={{ fontSize: "18px" }} />,
                        onClick: (item) => {
                          navigate("details", {
                            state: { item: item, query, cnpj: true },
                          });
                        },
                      },
                    ]}
                  />
                ),
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
        filters={["start_date", "end_date", "merchant_id"]}
        refetch={refetchHistoricCpfByMerchantData}
        selectOptions={{}}
        startDateKeyName="start_date"
        endDateKeyName="end_date"
        initialQuery={INITIAL_QUERY}
        haveInitialDate
      />
    </Grid>
  );
};
