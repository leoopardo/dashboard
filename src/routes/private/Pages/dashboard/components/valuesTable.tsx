/* eslint-disable react-hooks/exhaustive-deps */
import { useGetMerchantBankStatementTotals } from "@src/services/consult/merchant/bankStatement/getTotals";
import { Card, Col, Row, Table, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";

interface ValuesTableInterface {
  query: {
    start_date: string;
    end_date: string;
    page?: number;
    limit?: number;
    sort_field?: string;
    sort_order?: string;
  };
}

export const ValuesTable = ({ query }: ValuesTableInterface) => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery({ maxWidth: "750px" });
  const {
    MerchantBankStatementTotals,
    isMerchantBankStatementTotalsFetching,
    refetchMerchantBankStatementTotalsTotal,
  } = useGetMerchantBankStatementTotals(query);

  useEffect(() => {
    refetchMerchantBankStatementTotalsTotal();
  }, [query]);

  interface DataType {
    type: string;
    operation_number: number;
    value: number;
    ticket: number;
    fee: number;
    key: string;
  }

  const columns: ColumnsType<DataType> = [
    {
      title: t("table.type"),
      dataIndex: "type",
      filters: [
        { text: t("table.moviments"), value: "moviment" },
        { text: t("table.deposits"), value: "deposits" },
        { text: t("table.withdrawals"), value: "withdrawals" },
        { text: t("table.payments"), value: "payments" },
      ],
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value: any, record) => record.type.startsWith(value),
      render: (value) => <Typography>{t(`table.${value}`)}</Typography>,
    },
    {
      title: t("table.operation_number"),
      dataIndex: "operation_number",
    },
    {
      title: t("table.value"),
      dataIndex: "value",
      render: (value) => (
        <Typography>
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(Number(value) || 0)}
        </Typography>
      ),
    },
    {
      title: t("table.ticket"),
      dataIndex: "ticket",
      render: (value) => (
        <Typography>
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(Number(value) || 0)}
        </Typography>
      ),
    },
    {
      title: t("table.fee"),
      dataIndex: "fee",
      render: (value) => (
        <Typography>
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(Number(value) || 0)}
        </Typography>
      ),
    },
  ];

  const [data, setData] = useState<
    {
      type: string;
      operation_number: number;
      value: number;
      ticket: number;
      fee: number;
      key: string;
    }[]
  >([]);

  useEffect(() => {
    if (!isMerchantBankStatementTotalsFetching && MerchantBankStatementTotals)
      setData([
        {
          key: "2",
          type: "deposits",
          operation_number: MerchantBankStatementTotals?.number_in ?? 0,
          value: MerchantBankStatementTotals?.value_in ?? 0,
          ticket: MerchantBankStatementTotals?.average_ticket_in ?? 0,
          fee: MerchantBankStatementTotals?.fee_in ?? 0,
        },
        {
          key: "3",
          type: "withdrawals",
          operation_number: MerchantBankStatementTotals?.number_out ?? 0,
          value: MerchantBankStatementTotals?.value_out ?? 0,
          ticket: MerchantBankStatementTotals?.average_ticket_out ?? 0,
          fee: MerchantBankStatementTotals?.fee_out ?? 0,
        },
        {
          key: "4",
          type: "total",
          operation_number: MerchantBankStatementTotals?.number_total ?? 0,
          value: MerchantBankStatementTotals?.value_total ?? 0,
          ticket: MerchantBankStatementTotals?.fee_total ?? 0,
          fee: MerchantBankStatementTotals?.fee_total ?? 0,
        },
      ]);
  }, [MerchantBankStatementTotals]);

  return (
    <>
      {/* <Typography.Title level={2}>Transações</Typography.Title> */}
      {!isMobile ? (
        <Table
          columns={columns}
          dataSource={data}
          loading={isMerchantBankStatementTotalsFetching}
        />
      ) : (
        <Row gutter={[8, 8]}>
          {data.map((item) => (
            <Col span={24}>
              <Card
                title={t(`table.${item.type}`)}
                bodyStyle={{ display: "flex", flexWrap: "wrap", padding: 8 }}
                headStyle={{ padding: 8 }}
              >
                <Typography.Title
                  level={5}
                  style={{ margin: 0, paddingRight: 24 }}
                >
                  {t("table.operation_number")}:{" "}
                  <span style={{ textDecoration: "underline" }}>
                    {item?.operation_number ?? 0}
                  </span>
                </Typography.Title>
                <Typography.Title
                  level={5}
                  style={{ margin: 0, paddingRight: 24 }}
                >
                  {t("table.value")}:{" "}
                  <span style={{ textDecoration: "underline" }}>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(Number(item?.value) || 0)}
                  </span>
                </Typography.Title>
                <Typography.Title
                  level={5}
                  style={{ margin: 0, paddingRight: 24 }}
                >
                  {t("table.fee")}:{" "}
                  <span style={{ textDecoration: "underline" }}>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(Number(item?.fee) || 0)}
                  </span>
                </Typography.Title>
                <Typography.Title
                  level={5}
                  style={{ margin: 0, paddingRight: 24 }}
                >
                  {t("table.ticket")}:{" "}
                  <span style={{ textDecoration: "underline" }}>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(Number(item?.ticket) || 0)}
                  </span>
                </Typography.Title>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};
