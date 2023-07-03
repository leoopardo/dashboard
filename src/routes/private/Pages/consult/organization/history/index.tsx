import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { useGetOrganizationHistory } from "@src/services/consult/organization/history/getPerBank";
import {
  OrganizationHistoryItem,
  OrganizationHistoryQuery,
} from "@src/services/types/consult/organization/history";
import { OrganizationHistoryLineChart } from "./components/historyLineChart";
import { Button, Table, TableColumnsType } from "antd";
import moment from "moment";
import { CustomTable } from "@src/components/CustomTable";

export const OrganizationHistory = () => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery({ maxWidth: "750px" });
  const [query, setQuery] = useState<OrganizationHistoryQuery>({
    page: 1,
    limit: 30,
  });
  const {
    OrganizationHistory,
    isOrganizationHistoryFetching,
    OrganizationHistoryError,
    refetchOrganizationHistory,
  } = useGetOrganizationHistory(query);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [, setCurrentItem] = useState<OrganizationHistoryItem | null>();

  useEffect(() => {
    refetchOrganizationHistory();
  }, [query]);

  const columns: TableColumnsType<OrganizationHistoryItem> = [
    {
      title: t("table.created_at"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value) =>
        moment(value).subtract(3, "hours").format("YYYY-MM-DD"),
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
    const columns: TableColumnsType<OrganizationHistoryItem> = [
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
      <Grid xs={12} md={2}>
        <Button
          style={{ width: "100%" }}
          size="large"
          loading={isOrganizationHistoryFetching}
          onClickCapture={() => refetchOrganizationHistory()}
        >
          {t("buttons.refresh")}
        </Button>
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
        <OrganizationHistoryLineChart items={OrganizationHistory?.items} />
      </Grid>

      <Grid item xs={12} style={{ marginTop: "25px" }}>
        {!isMobile ? (
          <Table
            columns={columns}
            bordered
            expandable={{
              expandedRowRender,
              onExpand: onTableRowExpand,
              expandedRowKeys: expanded,
            }}
            rowKey={(record) => record?._id ?? ""}
            dataSource={OrganizationHistory?.items}
            pagination={{
              current: query?.page,
              pageSize: query?.limit,
              total: OrganizationHistory?.total,
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
            data={OrganizationHistory}
            items={OrganizationHistory?.items}
            loading={isOrganizationHistoryFetching}
            error={OrganizationHistoryError}
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
