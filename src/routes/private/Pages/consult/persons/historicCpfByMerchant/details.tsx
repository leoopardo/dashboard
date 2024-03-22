/* eslint-disable react-hooks/exhaustive-deps */
import { DownOutlined, FilterOutlined } from "@ant-design/icons";
import { ColumnInterface, CustomTable } from "@components/CustomTable";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { Grid } from "@mui/material";
import { FiltersModal } from "@src/components/FiltersModal";
import { FilterChips } from "@src/components/FiltersModal/filterChips";
import { useExportHistoricCnpjByMerchantDetails } from "@src/services/consult/persons/exportCsvHistoricCnpjByMerchantDetails";
import { useExportHistoricCpfByMerchantDetails } from "@src/services/consult/persons/exportCsvHistoricCpfByMerchantDetails";
import { useGetHistoricCnpjByMerchantDetails } from "@src/services/consult/persons/historicCnpjByMerchantDetails";
import { useGetHistoricCpfByMerchantDetails } from "@src/services/consult/persons/historicCpfByMerchantDetails";
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
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

export const HistoricCpfByMerchantDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const INITIAL_QUERY: HistoricCpfByMerchantQuery = location?.state?.query;
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("cpf");
  const [query, setQuery] = useState<HistoricCpfByMerchantQuery>(INITIAL_QUERY);
  const [api, contextHolder] = notification.useNotification();
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
    HistoricCpfByMerchantDetailsIsLoading,
    HistoricCpfByMerchantDetailsIsSuccess,
    HistoricCpfByMerchantDetailsMutate,
  } = useExportHistoricCpfByMerchantDetails({
    ...query,
    merchant_id: location.state?.item?.merchant_id,
  });

  const {
    HistoricCnpjByMerchantDetailsIsLoading,
    HistoricCnpjByMerchantDetailsIsSuccess,
    HistoricCnpjByMerchantDetailsMutate,
  } = useExportHistoricCnpjByMerchantDetails({
    ...query,
    merchant_id: location.state?.item?.merchant_id,
  });

  const {
    HistoricCnpjByMerchantDetailsData,
    HistoricCnpjByMerchantDetailsDataError,
    refetchHistoricCnpjByMerchantDetailsData
  } = useGetHistoricCnpjByMerchantDetails({
    ...query,
    merchant_id: location.state?.item?.merchant_id,
  });

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
    refetchHistoricCnpjByMerchantDetailsData()
  }, [query]);

  useEffect(() => {
    location.state.cpf
      ? setActiveTab("cpf")
      : location.state.cnpj
      ? setActiveTab("cnpj")
      : setActiveTab("cpf");
  }, []);

  const openNotificationWithIcon = (
    type: "success" | "info" | "warning" | "error",
    path: string
  ) => {
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
    if (HistoricCpfByMerchantDetailsIsSuccess) {
      openNotificationWithIcon(
        "info",
        "/consult/consult_persons/reports/historic_cpf_merchant_details"
      );
    }
  }, [HistoricCpfByMerchantDetailsIsSuccess]);

  useEffect(() => {
    if (HistoricCnpjByMerchantDetailsIsSuccess) {
      openNotificationWithIcon(
        "info",
        "/consult/consult_persons/reports/historic_cnpj_merchant_details"
      );
    }
  }, [HistoricCnpjByMerchantDetailsIsSuccess]);

  return (
    <Grid container style={{ padding: "25px" }}>
      <Typography.Title level={4}>
        {t("table.merchant")}: {location?.state?.item?.merchant_name}
      </Typography.Title>
      {contextHolder}
      <Grid
        container
        style={{ display: "flex", alignItems: "center" }}
        spacing={1}
      >
        <Grid item xs={12} md={8} lg={9}>
          <Grid
            container
            style={{ display: "flex", alignItems: "center" }}
            spacing={1}
          >
            <Grid item xs={12} md={2} lg={2}>
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
            <Grid item xs={12} md={9} lg={9}>
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

        <Grid item xs={12} md={2} lg={2}>
          <Button
            size="large"
            type="dashed"
            loading={isHistoricCpfByMerchantDetailsDataFetching}
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

        <Grid item xs={12} md={2} lg={1}>
          <Dropdown
            menu={{
              items: [
                {
                  label: "CPF",
                  key: "cpf",
                  onClick: () => {
                    HistoricCpfByMerchantDetailsMutate();
                  },
                  disabled: HistoricCpfByMerchantDetailsData?.total === 0,
                },
                {
                  label: "CNPJ",
                  key: "cnpj",
                  onClick: () => {
                    HistoricCnpjByMerchantDetailsMutate();
                  },
                  disabled: HistoricCnpjByMerchantDetailsData?.total === 0,
                },
              ],
            }}
          >
            <Button
              size="large"
              loading={
                HistoricCpfByMerchantDetailsIsLoading ||
                HistoricCnpjByMerchantDetailsIsLoading
              }
            >
              <Space>
                CSV <DownOutlined style={{ fontSize: 12 }} />
              </Space>
            </Button>
          </Dropdown>
        </Grid>
      </Grid>

      <Grid container style={{ marginTop: "8px" }}>
        <Grid item xs={12}>
          <Tabs
            activeKey={activeTab}
            onChange={(key) => setActiveTab(key)}
            items={[
              {
                label: (
                  <Badge count={HistoricCpfByMerchantDetailsData?.total}>
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
                    data={HistoricCpfByMerchantDetailsData}
                    items={HistoricCpfByMerchantDetailsData?.items}
                    error={HistoricCpfByMerchantDetailsDataError}
                    columns={columns}
                    loading={isHistoricCpfByMerchantDetailsDataFetching}
                    label={["cpf", "merchant_name"]}
                    actions={[]}
                  />
                ),
              },
              {
                label: (
                  <Badge count={HistoricCnpjByMerchantDetailsData?.total}>
                    <Typography style={{ width: 40, marginLeft: 8 }}>
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
                    data={HistoricCnpjByMerchantDetailsData}
                    items={HistoricCnpjByMerchantDetailsData?.items}
                    error={HistoricCnpjByMerchantDetailsDataError}
                    columns={[
                      { name: "_id", type: "id", head: "id" },
                      { name: "user_name", type: "text" },
                      { name: "merchant_id", type: "text" },
                      { name: "cnpj", type: "document" },
                      { name: "date", type: "date" },
                      { name: "ip", type: "text" },
                      { name: "createdAt", type: "date" },
                    ]}
                    loading={isHistoricCpfByMerchantDetailsDataFetching}
                    label={["cpf", "merchant_name"]}
                    actions={[]}
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
        filters={["start_date", "end_date"]}
        refetch={refetchHistoricCpfByMerchantDetailsData}
        selectOptions={{}}
        startDateKeyName="start_date"
        endDateKeyName="end_date"
        initialQuery={INITIAL_QUERY}
        haveInitialDate
      />
    </Grid>
  );
};
