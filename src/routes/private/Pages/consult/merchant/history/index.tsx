/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { ReloadOutlined } from "@ant-design/icons";
import { Grid } from "@mui/material";
import { CustomTable } from "@src/components/CustomTable";
import { FilterChips } from "@src/components/FiltersModal/filterChips";
import { MerchantSelect } from "@src/components/Selects/merchantSelect";
import { useGetMerchantHistory } from "@src/services/consult/merchant/history/getMerchantHistory";
import { queryClient } from "@src/services/queryClient";
import {
  MerchantHistoryItem,
  MerchantHistoryQuery,
} from "@src/services/types/consult/merchant/history";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { Button, Empty, Table, TableColumnsType } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { formatFilterDate } from "@src/utils/formatDate";
import { MerchantHistoryLineChart } from "./components/MerchantHistoryLineChart";

export const MerchantHistory = () => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const INITIAL_QUERY: MerchantHistoryQuery = {
    page: 1,
    limit: 30,
  };
  const { t } = useTranslation();
  const isMobile = useMediaQuery({ maxWidth: "750px" });
  const [query, setQuery] = useState<MerchantHistoryQuery>({
    page: 1,
    limit: 30,
  });
  const {
    MerchantHistory,
    isMerchantHistoryFetching,
    MerchantHistoryError,
    refetchMerchantHistory,
  } = useGetMerchantHistory(query);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [, setCurrentItem] = useState<MerchantHistoryItem | null>();

  useEffect(() => {
    refetchMerchantHistory();
  }, [query]);

  const columns: TableColumnsType<MerchantHistoryItem> = [
    {
      title: t("table.reference_day"),
      dataIndex: "reference_day",
      key: "reference_day",
      render: (value) => formatFilterDate(value),
    },
    {
      title: t("table.balance_to_transactions"),
      dataIndex: "balance_to_transactions",
      key: "balance_to_transactions",
      render: (value) =>
        new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(value ?? 0),
    },
    {
      title: t("table.balance_to_payment"),
      dataIndex: "balance_to_payment",
      key: "balance_to_payment",
      render: (value) =>
        new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(value ?? 0),
    },
    {
      title: t("table.balance_reserved"),
      dataIndex: "balance_reserved",
      key: "balance_reserved",
      render: (value) =>
        new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(value ?? 0),
    },
    {
      title: t("table.total_transactions"),
      dataIndex: "total_transactions",
      key: "total_transactions",
      render: (value) =>
        new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(value ?? 0),
    },
  ];

  const expandedRowRender = (record: any) => {
    const columns: TableColumnsType<MerchantHistoryItem> = [
      {
        title: t("table.cash_in_number"),
        dataIndex: "cash_in_number",
        key: "cash_in_number",
        render: (value) =>
          new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(value ?? 0),
      },
      {
        title: t("table.cash_in_value"),
        dataIndex: "cash_in_value",
        key: "cash_in_value",
        render: (value) =>
          new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(value ?? 0),
      },
      {
        title: t("table.cash_in_fee"),
        dataIndex: "cash_in_fee",
        key: "cash_in_fee",
        render: (value) =>
          new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(value ?? 0),
      },
      {
        title: t("table.cash_out_number"),
        dataIndex: "cash_out_number",
        key: "cash_out_number",
        render: (value) =>
          new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(value ?? 0),
      },
      {
        title: t("table.cash_out_value"),
        dataIndex: "cash_out_value",
        key: "cash_out_value",
        render: (value) =>
          new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(value ?? 0),
      },
      {
        title: t("table.cash_out_fee"),
        dataIndex: "cash_out_fee",
        key: "cash_out_fee",
        render: (value) =>
          new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(value ?? 0),
      },
    ];

    return (
      <Table
        columns={columns}
        dataSource={[record]}
        pagination={false}
        bordered
      />
    );
  };

  const onTableRowExpand = (expanded: boolean, record: any) => {
    const keys = [];
    if (expanded) {
      keys.push(record._id);
    }
    setExpanded(keys);
  };

  return (
    <Grid container style={{ padding: "25px" }}>
      <Grid
        container
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "20px",
        }}
        spacing={1}
      >
        {permissions.register.merchant.merchant.merchant_list && (
          <Grid item xs={12} md={4} lg={2}>
            <MerchantSelect queryOptions={query} setQueryFunction={setQuery} />
          </Grid>
        )}

        <Grid item xs={12} md={4} lg={6}>
          <FilterChips
            startDateKeyName="start_date"
            endDateKeyName="end_date"
            query={query}
            setQuery={setQuery}
          />
        </Grid>
        <Grid item xs={12} md={2} lg={2}>
          <Button
            style={{ width: "100%" }}
            size="large"
            type="dashed"
            danger
            loading={isMerchantHistoryFetching}
            onClickCapture={() => setQuery(INITIAL_QUERY)}
          >
            {t("table.clear_filters")}
          </Button>
        </Grid>
        <Grid item xs={12} md={2} lg={2}>
          <Button
            style={{ width: "100%" }}
            size="large"
            type="primary"
            loading={isMerchantHistoryFetching}
            onClickCapture={() => refetchMerchantHistory()}
          >
            <ReloadOutlined /> {t("buttons.refresh")}
          </Button>
        </Grid>
      </Grid>

      <Grid
        item
        xs={12}
        style={{
          display: "flex",
          justifyContent: "center",
          maxHeight: "350px",
        }}
      >
        <MerchantHistoryLineChart items={MerchantHistory?.items} />
      </Grid>

      <Grid item xs={12} style={{ marginTop: "25px" }}>
        {!isMobile ? (
          <Table
            columns={columns}
            bordered
            locale={{
              emptyText: MerchantHistoryError ? (
                <Empty
                  style={{ padding: 15, paddingBottom: 30 }}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={`${t("table.error")} ${
                    MerchantHistoryError?.response?.status
                  } - ${t(`error.${MerchantHistoryError?.response?.status}`)}`}
                />
              ) : (
                <Empty
                  style={{ padding: 15, paddingBottom: 30 }}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={t("messages.empty_table_data")}
                />
              ),
            }}
            expandable={{
              expandedRowRender,
              onExpand: onTableRowExpand,
              expandedRowKeys: expanded,
            }}
            rowKey={(record) => record?._id ?? ""}
            dataSource={MerchantHistory?.items}
            pagination={{
              current: query?.page,
              pageSize: query?.limit,
              total: MerchantHistory?.total,
              onChange: (page) => {
                setQuery((state: any) => ({ ...state, page }));
              },
              pageSizeOptions: [10, 25, 50, 100],
              onShowSizeChange: (_current, size) =>
                setQuery((state: any) => ({ ...state, limit: size })),
            }}
          />
        ) : (
          <CustomTable
            columns={[
              { name: "createdAt", type: "date" },
              { name: "balance_reserved", type: "value" },
              { name: "balance_to_payment", type: "value" },
              { name: "balance_to_transactions", type: "value" },
              { name: "total_transactions", type: "value" },
              { name: "cash_in_number", type: "value" },
              { name: "cash_in_value", type: "value" },
              { name: "cash_in_fee", type: "value" },
              { name: "cash_out_number", type: "value" },
              { name: "cash_out_value", type: "value" },
              { name: "cash_out_fee", type: "value" },
            ]}
            data={MerchantHistory}
            items={MerchantHistory?.items}
            loading={isMerchantHistoryFetching}
            error={MerchantHistoryError}
            query={query}
            setCurrentItem={setCurrentItem}
            setQuery={setQuery}
            label={["createdAt"]}
          />
        )}
      </Grid>
    </Grid>
  );
};
