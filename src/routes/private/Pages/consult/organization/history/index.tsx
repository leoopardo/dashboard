/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { ReloadOutlined } from "@ant-design/icons";
import { Grid } from "@mui/material";
import { CustomTable } from "@src/components/CustomTable";
import { useGetOrganizationHistory } from "@src/services/consult/organization/history/getPerBank";
import {
  OrganizationHistoryItem,
  OrganizationHistoryQuery,
} from "@src/services/types/consult/organization/history";
import { Button, Table, TableColumnsType } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { OrganizationHistoryLineChart } from "./components/historyLineChart";
import { formatFilterDate } from "@src/utils/formatDate";
import { moneyFormatter } from "@src/utils/moneyFormatter";

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

  const columns: TableColumnsType<OrganizationHistoryItem> = [
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
      render: (value) => moneyFormatter(value ?? 0),
    },
    {
      title: t("table.balance_to_payment"),
      dataIndex: "balance_to_payment",
      key: "balance_to_payment",
      render: (value) => moneyFormatter(value ?? 0),
    },
    {
      title: t("table.balance_reserved"),
      dataIndex: "balance_reserved",
      key: "balance_reserved",
      render: (value) => moneyFormatter(value ?? 0),
    },
    {
      title: t("table.total_transactions"),
      dataIndex: "total_transactions",
      key: "total_transactions",
      render: (value) => moneyFormatter(value ?? 0),
    },
  ];

  const expandedRowRender = (record: any) => {
    const columns: TableColumnsType<OrganizationHistoryItem> = [
      {
        title: t("table.cash_in_number"),
        dataIndex: "cash_in_number",
        key: "cash_in_number",
        render: (value) => moneyFormatter(value ?? 0),
      },
      {
        title: t("table.cash_in_value"),
        dataIndex: "cash_in_value",
        key: "cash_in_value",
        render: (value) => moneyFormatter(value ?? 0),
      },
      {
        title: t("table.cash_in_fee"),
        dataIndex: "cash_in_fee",
        key: "cash_in_fee",
        render: (value) => moneyFormatter(value ?? 0),
      },
      {
        title: t("table.cash_out_number"),
        dataIndex: "cash_out_number",
        key: "cash_out_number",
        render: (value) => moneyFormatter(value ?? 0),
      },
      {
        title: t("table.cash_out_value"),
        dataIndex: "cash_out_value",
        key: "cash_out_value",
        render: (value) => moneyFormatter(value ?? 0),
      },
      {
        title: t("table.cash_out_fee"),
        dataIndex: "cash_out_fee",
        key: "cash_out_fee",
        render: (value) => moneyFormatter(value ?? 0),
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

  useEffect(() => {
    refetchOrganizationHistory();
  }, [query]);

  return (
    <Grid container style={{ padding: "25px" }}>
      <Grid container style={{ display: "flex", flexDirection: "row-reverse" }}>
        <Grid xs={12} md={1}>
          <Button
            style={{ width: "100%" }}
            size="large"
            type="link"
            loading={isOrganizationHistoryFetching}
            onClickCapture={() => refetchOrganizationHistory()}
            icon={<ReloadOutlined />}
          ></Button>
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
