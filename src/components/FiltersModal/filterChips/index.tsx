import { Space, Tag } from "antd";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { t } from "i18next";
import { CloseCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import { useMediaQuery } from "react-responsive";

interface FilterChipsProps {
  query: any;
  setQuery: Dispatch<SetStateAction<any>>;
  startDateKeyName: string;
  endDateKeyName: string;
  haveInitialDate?: boolean;
}

export const FilterChips = ({
  query,
  setQuery,
  endDateKeyName,
  startDateKeyName,
  haveInitialDate,
}: FilterChipsProps) => {
  const [filtersQuery, setFiltersQuery] = useState<any>(query);

  const isMobile = useMediaQuery({ maxWidth: "400px" });

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
    <Space size={[0, 8]} wrap>
      {Object.keys(filtersQuery).map((key) => {
        switch (key) {
          case startDateKeyName:
            return (
              <Tag
                style={{
                  maxWidth: isMobile ? "280px" : "400px",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  wordBreak: "break-all",
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
                          .format("YYYY-MM-DDTHH:mm:ss.SSS");

                        q[endDateKeyName] = moment(new Date())
                          .add(1, "day")
                          .startOf("day")
                          .format("YYYY-MM-DDTHH:mm:ss.SSS");
                      }
                      setQuery(q);
                    }}
                  />
                }
              >
                {t(`table.date`)}:{" "}
                {`${new Date(
                  filtersQuery[key]
                ).toLocaleDateString()} ${new Date(
                  filtersQuery[key]
                ).toLocaleTimeString()} - ${new Date(
                  filtersQuery[endDateKeyName]
                ).toLocaleDateString()} ${new Date(
                  filtersQuery[endDateKeyName]
                ).toLocaleTimeString()}`}
              </Tag>
            );
          case endDateKeyName:
          case "age_end":
          case "value_end":
          case "delivered_at":
            return;

          case "age_start":
            return (
              <Tag
                color="cyan"
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
            );

          case "value_start":
            return (
              <Tag
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
            );

          case "gender":
          case "status":
            return (
              <Tag
                color="cyan"
                icon={<CloseCircleOutlined onClick={() => deleteFilter(key)} />}
              >
                {t(`table.${key}`)}:{" "}
                {t(`table.${filtersQuery[key].toLowerCase()}`)}
              </Tag>
            );
          default:
            return (
              <Tag
                color="cyan"
                icon={<CloseCircleOutlined onClick={() => deleteFilter(key)} />}
              >
                {t(`table.${key}`)}: {filtersQuery[key]}
              </Tag>
            );
        }
      })}
    </Space>
  );
};
