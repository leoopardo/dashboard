/* eslint-disable @typescript-eslint/no-explicit-any */
import { CloseCircleOutlined } from "@ant-design/icons";
import { queryClient } from "@src/services/queryClient";
import { AggregatorsResponse } from "@src/services/types/register/aggregators/aggregators.interface";
import { MerchantsResponse } from "@src/services/types/register/merchants/merchantsRegister.interface";
import { OperatorsResponse } from "@src/services/types/register/operators/operators.interface";
import { PartnersResponse } from "@src/services/types/register/partners/partners.interface";
import { Col, Row, Tag } from "antd";
import moment from "moment";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface FilterChipsProps {
  query: any;
  setQuery: Dispatch<SetStateAction<any>>;
  startDateKeyName: string;
  endDateKeyName: string;
  haveInitialDate?: boolean;
  disabled?: string[];
}

export const FilterChips = ({
  query,
  setQuery,
  endDateKeyName,
  startDateKeyName,
  haveInitialDate,
  disabled,
}: FilterChipsProps) => {
  const { t } = useTranslation();
  const merchants = queryClient.getQueryData(
    "MerchantList"
  ) as MerchantsResponse;
  const partners = queryClient.getQueryData("listPartners") as PartnersResponse;
  const aggregators = queryClient.getQueryData(
    "listAggregator"
  ) as AggregatorsResponse;
  const operators = queryClient.getQueryData(
    "listOperators"
  ) as OperatorsResponse;

  const [filtersQuery, setFiltersQuery] = useState<any>(query);
  const deleteFilter = (key: string) => {
    if (query[key]) {
      const q = { ...filtersQuery, limit: 25, page: 1 };
      delete q[key];
      setQuery(q);
    }
  };

  useEffect(() => {
    const q = { ...query };
    delete q.limit;
    delete q.page;
    delete q.sort_order;
    delete q.sort_field;
    setFiltersQuery({
      ...q,
    });
  }, [query]);

  return (
    <Row gutter={[4, 4]} wrap style={{ width: "100%" }}>
      {Object.keys(filtersQuery).map((key) => {
        if (!filtersQuery[key]) {
          return;
        }
        switch (key) {
          case startDateKeyName:
            return query[startDateKeyName] ? (
              <Col key={key}>
                <Tag
                  key={key}
                  style={{
                    width: "100%",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    wordBreak: "break-all",
                    display: disabled?.includes(key) ? "none" : undefined,
                  }}
                  color="cyan"
                  icon={
                    <CloseCircleOutlined
                      onClick={() => {
                        const q = { ...filtersQuery, limit: 25, page: 1 };
                        delete q[key];
                        delete q[endDateKeyName];
                        if (haveInitialDate) {
                          q[key] = moment(new Date())
                            .startOf("day")
                            .add(3, "hours")
                            .format("YYYY-MM-DDTHH:mm:ss.SSS");

                          q[endDateKeyName] = moment(new Date())
                            .add(1, "day")
                            .startOf("day")
                            .add(3, "hours")
                            .format("YYYY-MM-DDTHH:mm:ss.SSS");
                        }
                        setQuery(q);
                      }}
                    />
                  }
                >
                  {t(`table.date`)}:{" "}
                  {`${moment(filtersQuery[key])
                    .subtract(3, "hours")
                    .format(
                      navigator.language === "pt-BR"
                        ? "DD/MM/YYYY HH:mm"
                        : "YYYY/MM/DD HH:mm"
                    )} - ${moment(filtersQuery[endDateKeyName])
                    .subtract(3, "hours")
                    .format(
                      navigator.language === "pt-BR"
                        ? "DD/MM/YYYY HH:mm"
                        : "YYYY/MM/DD HH:mm"
                    )} `}
                </Tag>
              </Col>
            ) : (
              <></>
            );
          case endDateKeyName:
          case "age_end":
          case "value_end":
          case "delivered_at":
            return;

          case "age_start":
            return (
              <Col key={key}>
                <Tag
                  key={key}
                  color="cyan"
                  style={{
                    width: "100%",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    wordBreak: "break-all",
                    display: disabled?.includes(key) ? "none" : undefined,
                  }}
                  icon={
                    <CloseCircleOutlined
                      onClick={() => {
                        const q = { ...filtersQuery, limit: 25, page: 1 };
                        delete q.age_start;
                        delete q.age_end;
                        setQuery(q);
                      }}
                    />
                  }
                >
                  {t(`table.age`)}: {filtersQuery.age_start} -{" "}
                  {filtersQuery.age_end}
                </Tag>
              </Col>
            );

          case "merchant_id":
            return (
              <Col key={key}>
                <Tag
                  style={{
                    width: "100%",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    wordBreak: "break-all",
                    display: disabled?.includes(key) ? "none" : undefined,
                  }}
                  key={key}
                  color="cyan"
                  icon={
                    <CloseCircleOutlined onClick={() => deleteFilter(key)} />
                  }
                >
                  {t(`table.merchant`)}:{" "}
                  {merchants?.items?.find(
                    (merch) => merch.id === filtersQuery?.merchant_id
                  )?.name ?? "-"}
                </Tag>
              </Col>
            );

          case "partner_id":
            return (
              <Col key={key}>
                {" "}
                <Tag
                  style={{
                    width: "100%",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    wordBreak: "break-all",
                    display: disabled?.includes(key) ? "none" : undefined,
                  }}
                  key={key}
                  color="cyan"
                  icon={
                    <CloseCircleOutlined onClick={() => deleteFilter(key)} />
                  }
                >
                  {t(`table.partner`)}:{" "}
                  {partners?.items?.find(
                    (part) => part.id === filtersQuery?.partner_id
                  )?.name ?? "-"}
                </Tag>
              </Col>
            );

          case "operator_id":
            return (
              <Col key={key}>
                {" "}
                <Tag
                  style={{
                    width: "100%",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    wordBreak: "break-all",
                    display: disabled?.includes(key) ? "none" : undefined,
                  }}
                  key={key}
                  color="cyan"
                  icon={
                    <CloseCircleOutlined onClick={() => deleteFilter(key)} />
                  }
                >
                  {t(`table.operator`)}:{" "}
                  {operators?.items?.find(
                    (op) => op.id === filtersQuery?.operator_id
                  )?.name ?? "-"}
                </Tag>
              </Col>
            );

          case "aggregator_id":
            return (
              <Col key={key}>
                {" "}
                <Tag
                  style={{
                    width: "100%",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    wordBreak: "break-all",
                    display: disabled?.includes(key) ? "none" : undefined,
                  }}
                  key={key}
                  color="cyan"
                  icon={
                    <CloseCircleOutlined onClick={() => deleteFilter(key)} />
                  }
                >
                  {t(`table.aggregator`)}:{" "}
                  {aggregators?.items?.find(
                    (aggreg) => aggreg.id === filtersQuery?.aggregator_id
                  )?.name ?? "-"}
                </Tag>
              </Col>
            );

          case "value_start":
            return (
              <Col key={key}>
                {" "}
                <Tag
                  style={{
                    width: "100%",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    wordBreak: "break-all",
                    display: disabled?.includes(key) ? "none" : undefined,
                  }}
                  key={key}
                  color="cyan"
                  icon={
                    <CloseCircleOutlined
                      onClick={() => {
                        const q = { ...filtersQuery, limit: 25, page: 1 };
                        delete q.value_start;
                        delete q.value_end;
                        setQuery(q);
                      }}
                    />
                  }
                >
                  {t(`table.value`)}:{" "}
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(filtersQuery.value_start)}{" "}
                  -{" "}
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(filtersQuery.value_end)}
                </Tag>
              </Col>
            );

          case "gender":
          case "to":
          case "from":
            return (
              <Col key={key}>
                {" "}
                <Tag
                  style={{
                    width: "100%",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    wordBreak: "break-all",
                    display: disabled?.includes(key) ? "none" : undefined,
                  }}
                  key={key}
                  color="cyan"
                  icon={
                    <CloseCircleOutlined onClick={() => deleteFilter(key)} />
                  }
                >
                  {t(`table.${key}`)}:{" "}
                  {t(`table.${filtersQuery[key].toLowerCase()}`)}
                </Tag>
              </Col>
            );

          case "status":
            return (
              <Col key={key}>
                <Tag
                  style={{
                    width: "100%",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    wordBreak: "break-all",
                    display: disabled?.includes(key) ? "none" : undefined,
                  }}
                  key={key}
                  color="cyan"
                  icon={
                    <CloseCircleOutlined onClick={() => deleteFilter(key)} />
                  }
                >
                  {t(`table.${key}`)}:{" "}
                  {t(
                    `table.${
                      filtersQuery[key].toLowerCase() == "true"
                        ? "active"
                        : filtersQuery[key].toLowerCase() == "false"
                        ? "inactive"
                        : filtersQuery[key].toLowerCase()
                    }`
                  )}
                </Tag>
              </Col>
            );

          case "log_type":
            return;
          default:
            return (
              <Col key={key}>
                {filtersQuery[key] ? (
                  <Tag
                    style={{
                      width: "100%",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      wordBreak: "break-all",
                      display: disabled?.includes(key) ? "none" : undefined,
                    }}
                    key={key}
                    color="cyan"
                    icon={
                      <CloseCircleOutlined onClick={() => deleteFilter(key)} />
                    }
                  >
                    {t(`table.${key}`)}: {filtersQuery[key]}
                  </Tag>
                ) : (
                  <></>
                )}
              </Col>
            );
        }
      })}
    </Row>
  );
};
