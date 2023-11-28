/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { ReloadOutlined } from "@ant-design/icons";
import { Grid } from "@mui/material";
import { CustomTable } from "@src/components/CustomTable";
import { FilterChips } from "@src/components/FiltersModal/filterChips";
import { MerchantSelect } from "@src/components/Selects/merchantSelect";
import { useGetMerchantBalance } from "@src/services/consult/merchant/balance/getMerchantBalance";
import { queryClient } from "@src/services/queryClient";
import {
  MerchantBalanceItem,
  MerchantBalanceQuery,
} from "@src/services/types/consult/merchant/balance";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { Button, Divider, Spin, Table, TableColumnsType, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { MerchantBalance as MerchantBalanceTotals } from "../../../dashboard/components/merchantBalance";

export const MerchantBalance = () => {
  const { t } = useTranslation();
  const { permissions, type, merchant_id } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const INITIAL_QUERY: MerchantBalanceQuery = {
    page: 1,
    limit: 25,
    merchant_id: type === 3 ? merchant_id : undefined,
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
    {
      title: t("table.balance_total"),
      dataIndex: "balance_total",
      key: "balance_total",
      render: (value) =>
        new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(value ?? 0),
    },
    {
      title: (
        <Tooltip title={t("table.refetch_data")}>
          <Button
            type="link"
            onClick={() => {
              queryClient.invalidateQueries();
            }}
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <ReloadOutlined style={{ fontSize: "16px" }} />
          </Button>
        </Tooltip>
      ),
      dataIndex: "",
      key: "",
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
        title: t("table.pix_transactions_total"),
        dataIndex: "pix_transactions_total",
        key: "pix_transactions_total",
        render: (value) => value ?? 0,
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
        title: t("table.withdraw_transactions_total"),
        dataIndex: "withdraw_transactions_total",
        key: "withdraw_transactions_total",
        render: (value) => value ?? 0,
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
        render: (value) => value ?? 0,
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
      <Grid xs={12}>
        <MerchantBalanceTotals customQuery={query} />
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>

      {type !== 3 && (
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
              <MerchantSelect
                queryOptions={query}
                setQueryFunction={setQuery}
              />
            </Grid>
          )}

          <Grid item xs={12} md={6} lg={8}>
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
        </Grid>
      )}

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
                onShowSizeChange: (_current, size) =>
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
              label={[
                "merchant_name",
                "balance_to_transactions",
                "balance_to_payment",
                "balance_reserved",
              ]}
            />
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};
