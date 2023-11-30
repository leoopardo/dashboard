/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CloseCircleOutlined } from "@ant-design/icons";
import { useListMerchantById } from "@src/services/merchant/getListMerchantById";
import { useListAggregatorById } from "@src/services/register/aggregator/getListAggregatorById";
import { useGetRowsMerchantManualEntryCategory } from "@src/services/register/merchant/manualEntryCategory/getManualEntryCategory";
import { useListOperatorById } from "@src/services/register/operator/getListOperatorById";
import { useGetOrganizationCategories } from "@src/services/register/organization/categories/getCategories";
import { useListPartnerById } from "@src/services/register/partner/getListPartnerById";
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
  const { merchant, refetcMerchant } = useListMerchantById({
    page: 1,
    limit: 200,
    merchant_id: query.merchant_id ?? undefined,
  });
  const currentMerchant = merchant;
  const { Partner, refetcPartner } = useListPartnerById({
    page: 1,
    limit: 200,
    partner_id: query.partner_id ?? undefined,
  });
  const { Aggregator, refetcAggregator } = useListAggregatorById({
    page: 1,
    limit: 200,
    aggregator_id: query.aggregator_id ?? undefined,
  });
  const { Operator, refetcOperator } = useListOperatorById({
    page: 1,
    limit: 200,
    operator_id: query.operator_id ?? undefined,
  });
  const { CategoriesData } = useGetOrganizationCategories({
    limit: 200,
    page: 1,
  });
  const { categoryData } = useGetRowsMerchantManualEntryCategory({
    limit: 200,
    page: 1,
    sort_field: "created_at",
    sort_order: "DESC",
  });

  const [filtersQuery, setFiltersQuery] = useState<any>(query);
  const deleteFilter = (key: string) => {
    if (query[key]) {
      const q = { ...filtersQuery, limit: 25, page: 1 };
      delete q[key];
      setQuery(q);
    }
  };

  useEffect(() => {
    if (query.merchant_id) {
      refetcMerchant();
    }

    if (query.partner_id) {
      refetcPartner();
    }

    if (query.aggregator_id) {
      refetcAggregator();
    }

    if (query.operator_id) {
      refetcOperator();
    }
  }, [query]);

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
                  data-test-id="filter-chip-date"
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
                  data-test-id="filter-chip-age"
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
                  data-test-id="filter-chip-merchant-id"
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
                  {t(`table.merchant`)}: {currentMerchant?.name ?? "-"}
                </Tag>
              </Col>
            );
          case "category_id":
            return (
              <Col key={key}>
                <Tag
                  data-test-id="filter-chip-merchant-id"
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
                  {t(`table.category`)}:{" "}
                  {CategoriesData?.items.find(
                    (c) => c.id === query?.category_id
                  )?.name ??
                    categoryData?.items.find((c) => c.id === query?.category_id)
                      ?.name ??
                    "-"}
                </Tag>
              </Col>
            );

          case "partner_id":
            return (
              <Col key={key}>
                {" "}
                <Tag
                  data-test-id="filter-chip-partner-id"
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
                  {Partner?.name ?? filtersQuery?.partner_id}
                </Tag>
              </Col>
            );

          case "operator_id":
            return (
              <Col key={key}>
                {" "}
                <Tag
                  data-test-id="filter-chip-operator-id"
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
                  {t(`table.operator`)}: {Operator?.name ?? "-"}
                </Tag>
              </Col>
            );

          case "aggregator_id":
            return (
              <Col key={key}>
                {" "}
                <Tag
                  data-test-id="filter-chip-aggregator-id"
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
                  {t(`table.aggregator`)}: {Aggregator?.name ?? "-"}
                </Tag>
              </Col>
            );

          case "value_start":
            return (
              <Col key={key}>
                {" "}
                <Tag
                  data-test-id="filter-chip-value-start"
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
                  data-test-id="filter-chip-gender"
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
                  data-test-id="filter-chip-status"
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

          case "pix_type":
          case "pixType":
            return (
              <Col key={key}>
                {filtersQuery[key] ? (
                  <Tag
                    data-test-id="filter-chip-pix-type"
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
                ) : (
                  <></>
                )}
              </Col>
            );

          case "log_type":
            return;

          case "type":
            return (
              <Col key={key}>
              {filtersQuery[key] ? (
                <Tag
                  data-test-id="filter-chip-pix-type"
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
              ) : (
                <></>
              )}
            </Col>
            )
          default:
            return (
              <Col key={key}>
                {filtersQuery[key] ? (
                  <Tag
                    data-test-id="filter-chip-default"
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
