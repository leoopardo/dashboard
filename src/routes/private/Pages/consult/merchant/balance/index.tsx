import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import {
  Button,
  Card,
  Divider,
  Spin,
  Statistic,
  Table,
  TableColumnsType,
} from "antd";
import { useTranslation } from "react-i18next";
import { defaultTheme } from "@src/styles/defaultTheme";
import { useMediaQuery } from "react-responsive";
import { useGetMerchantBalance } from "@src/services/consult/merchant/balance/getMerchantBalance";
import {
  MerchantBalanceItem,
  MerchantBalanceQuery,
} from "@src/services/types/consult/merchant/balance";
import { CustomTable } from "@src/components/CustomTable";
import { MerchantBalanceChart } from "./components/TotalizerChart";
import { MerchantSelect } from "@src/components/Selects/merchantSelect";
import { FilterChips } from "@src/components/FiltersModal/filterChips";
import { ReloadOutlined } from "@ant-design/icons";

export const MerchantBalance = () => {
  const INITIAL_QUERY: MerchantBalanceQuery = {
    page: 1,
    limit: 25,
  };
  const [query, setQuery] = useState<MerchantBalanceQuery>(INITIAL_QUERY);
  const [expanded, setExpanded] = useState<string[]>([]);
  const isMobile = useMediaQuery({ maxWidth: "750px" });
  const {
    MerchantBalance,
    isMerchantBalanceFetching,
    refetchMerchantBalance,
    MerchantBalanceError,
  } = useGetMerchantBalance(query);
  const [, setCurrentItem] = useState<MerchantBalanceItem | null>();

  const { t } = useTranslation();

  useEffect(() => {
    refetchMerchantBalance();
  }, [query]);

  const columns: TableColumnsType<MerchantBalanceItem> = [
    {
      title: t("table.merchant"),
      dataIndex: "merchant_name",
      key: "merchant_name",
      render: (value) => value ?? "-",
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
  ];

  const expandedRowRender = (record: any) => {
    const columns: TableColumnsType<MerchantBalanceItem> = [
      {
        title: t("table.in"),
        dataIndex: "in",
        key: "in",
        render: (value) =>
          new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(value ?? 0),
      },
      {
        title: t("table.out"),
        dataIndex: "out",
        key: "out",
        render: (value) =>
          new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(value ?? 0),
      },
      {
        title: t("table.pix_amount_value"),
        dataIndex: "pix_amount_value",
        key: "pix_amount_value",
        render: (value) =>
          new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(value ?? 0),
      },
      {
        title: t("table.pix_amount_fee"),
        dataIndex: "pix_amount_fee",
        key: "pix_amount_fee",
        render: (value) =>
          new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(value ?? 0),
      },
      {
        title: t("table.withdraw_amount_value"),
        dataIndex: "withdraw_amount_value",
        key: "withdraw_amount_value",
        render: (value) =>
          new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(value ?? 0),
      },
      {
        title: t("table.withdraw_amount_fee"),
        dataIndex: "withdraw_amount_fee",
        key: "withdraw_amount_fee",
        render: (value) =>
          new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(value ?? 0),
      },
      {
        title: t("table.refund_transactions_total"),
        dataIndex: "refund_transactions_total",
        key: "refund_transactions_total",
      },
      {
        title: t("table.refund_amount_fee"),
        dataIndex: "refund_amount_fee",
        key: "refund_amount_fee",
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
        spacing={1}
        style={{ display: "flex", justifyContent: "center" }}
      >
        <Grid
          item
          xs={12}
          md={1}
          style={{
            minWidth: "120px",
            minHeight: "120px",
            marginRight: !isMobile ? "15px" : 0,
          }}
        >
          <MerchantBalanceChart items={MerchantBalance} />
        </Grid>
        <Grid item xs={12} md="auto">
          <Card bordered={false}>
            <Statistic
              loading={isMerchantBalanceFetching}
              title={t("table.balance_to_transactions")}
              value={new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(
                MerchantBalance?.balance_to_transactions_total ??
                  MerchantBalance?.balance_to_transactions ??
                  0
              )}
              precision={0}
              valueStyle={{ color: "#006086", fontSize: "16px" }}
            />
          </Card>
        </Grid>
        <Grid item xs={12} md="auto">
          <Card bordered={false}>
            <Statistic
              loading={isMerchantBalanceFetching}
              title={t("table.balance_to_payment")}
              value={new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(
                MerchantBalance?.balance_to_payment_total ??
                  MerchantBalance?.balance_to_payment ??
                  0
              )}
              precision={2}
              valueStyle={{
                color: defaultTheme.colors.warnning,
                fontSize: "16px",
              }}
            />
          </Card>
        </Grid>
        <Grid item xs={12} md="auto">
          <Card bordered={false}>
            <Statistic
              loading={isMerchantBalanceFetching}
              title={t("table.balance_reserved")}
              value={new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(
                MerchantBalance?.balance_reserved_total ??
                  MerchantBalance?.balance_reserved ??
                  0
              )}
              precision={2}
              valueStyle={{
                color: defaultTheme.colors.error,
                fontSize: "16px",
              }}
            />
          </Card>
        </Grid>
        <Grid item xs={12} md="auto">
          <Card bordered={false}>
            <Statistic
              loading={isMerchantBalanceFetching}
              title={t("table.balance_total")}
              value={new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(
                (MerchantBalance?.balance_reserved_total ??
                  MerchantBalance?.balance_reserved ??
                  0) +
                  (MerchantBalance?.balance_to_payment_total ??
                    MerchantBalance?.balance_to_payment ??
                    0) +
                  (MerchantBalance?.balance_to_transactions_total ??
                    MerchantBalance?.balance_to_transactions ??
                    0)
              )}
              precision={2}
              valueStyle={{
                color: defaultTheme.colors.paid,
                fontSize: "16px",
              }}
            />
          </Card>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>

      <Grid
        container
        style={{
        
          display: "flex",
          alignItems: "center",
          marginBottom: "20px",
        }}
        spacing={1}
      >
        <Grid item xs={12} md={4} lg={2}>
          <MerchantSelect queryOptions={query} setQueryFunction={setQuery} />
        </Grid>
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
            loading={isMerchantBalanceFetching}
            onClickCapture={() => setQuery(INITIAL_QUERY)}
          >
            {t("table.clear_filters")}
          </Button>
        </Grid>
        <Grid item xs={12} md={2} lg={2}>
          <Button
            size="large"
            type="primary"
            style={{ width: "100%" }}
            loading={isMerchantBalanceFetching}
            onClickCapture={() => {
              refetchMerchantBalance();
            }}
          >
            <ReloadOutlined /> {t("buttons.refresh")}
          </Button>
        </Grid>
      </Grid>

      <Grid
        container
        item
        xs={12}
        spacing={2}
        style={{ display: "flex", alignItems: "center" }}
      >
        {isMerchantBalanceFetching && (
          <Grid
            item
            xs={12}
            style={{
              display: "flex",
              justifyContent: "center",
              height: "50px",
            }}
          >
            <Spin />
          </Grid>
        )}
        <Grid item xs={12}>
          {!isMobile ? (
            <Table
              columns={columns}
              bordered
              expandable={{
                expandedRowRender,
                onExpand: onTableRowExpand,
                expandedRowKeys: expanded,
                expandRowByClick: true,
              }}
              rowKey={(record) => record?._id ?? ""}
              dataSource={MerchantBalance?.items ?? [MerchantBalance]}
              pagination={{
                current: query?.page,
                pageSize: query?.limit,
                total: MerchantBalance?.total,
                onChange: (page) => {
                  setQuery((state: any) => ({ ...state, page }));
                },
                pageSizeOptions: [10, 25, 50, 100],
                onShowSizeChange: (current, size) =>
                  setQuery((state: any) => ({ ...state, limit: size })),
              }}
            />
          ) : (
            <CustomTable
              columns={[
                { name: "merchant_name", type: "text" },
                { name: "balance_reserved", type: "value" },
                { name: "balance_to_payment", type: "value" },
                { name: "balance_to_transactions", type: "value" },
                { name: "in", type: "value" },
                { name: "out", type: "value" },
                { name: "pix_transactions_total", type: "text" },
                { name: "pix_amount_value", type: "value" },
                { name: "pix_amount_fee", type: "value" },
                { name: "withdraw_transactions_total", type: "text" },
                { name: "withdraw_amount_value", type: "value" },
                { name: "withdraw_amount_fee", type: "value" },
                { name: "refund_transactions_total", type: "text" },
                { name: "refund_amount_fee", type: "value" },
                { name: "updatedAt", type: "date" },
              ]}
              data={MerchantBalance}
              items={MerchantBalance?.items}
              loading={isMerchantBalanceFetching}
              error={MerchantBalanceError}
              query={query}
              setCurrentItem={setCurrentItem}
              setQuery={setQuery}
              label={["merchant_name"]}
            />
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};
