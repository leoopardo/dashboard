/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FilterOutlined } from "@ant-design/icons";
import { CustomTable } from "@src/components/CustomTable";
import { FiltersModal } from "@src/components/FiltersModal";
import { FilterChips } from "@src/components/FiltersModal/filterChips";
import { useGetSerproAssertiva } from "@src/services/consult/persons/serproAssertiva/getSerproAssertiva";
import { defaultTheme } from "@src/styles/defaultTheme";
import { Button, Card, Col, Row, Statistic } from "antd";
import moment from "moment";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export const SerproAssertiva = () => {
  const INITIAL_QUERY: any = {
    limit: 25,
    page: 1,
    start_date: moment(new Date())
      .startOf("M")
      .add(3, "hours")
      .format("YYYY-MM-DDTHH:mm:ss.SSS"),
    end_date: moment(new Date())
      .endOf("M")
      .add(1, "day")
      .startOf("day")
      .add(3, "hours")
      .format("YYYY-MM-DDTHH:mm:ss.SSS"),
  };
  const [query, setQuery] = useState<any>(INITIAL_QUERY);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const { data, isFetching, refetch, error } = useGetSerproAssertiva(query);

  useEffect(() => {
    refetch();
  }, [query]);

  const { t } = useTranslation();
  return (
    <Row style={{ padding: 25 }} gutter={[8, 8]}>
      <Col xs={24} style={{ marginBottom: 8 }}>
        <Row
          gutter={[8, 8]}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Col xs={{ span: 24 }} md={{ span: 4 }}>
            <Card bordered={false}>
              <Statistic
                title={t("table.assertiva_count")}
                value={data?.assertiva_count_total}
                precision={0}
                valueStyle={{ color: defaultTheme.colors.chartYellow }}
              />
            </Card>
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 4 }}>
            <Card bordered={false}>
              <Statistic
                title={t("table.serpro_count")}
                value={data?.serpro_count_total}
                precision={0}
                valueStyle={{ color: defaultTheme.colors.chartBlue }}
              />
            </Card>
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 4 }}>
            <Card bordered={false}>
              <Statistic
                title="Total"
                value={
                  (data?.assertiva_count_total || 0) +
                  (data?.serpro_count_total || 0)
                }
                precision={0}
                valueStyle={{ color: defaultTheme.colors.chartGreen }}
              />
            </Card>
          </Col>
        </Row>
      </Col>
      <Col xs={24}>
        <Row gutter={[8, 8]} align="middle">
          <Col xs={{ span: 24 }} md={{ span: 8 }} lg={{ span: 4 }}>
            <Button
              size="large"
              style={{ width: "100%" }}
              loading={false}
              type="primary"
              onClick={() => {
                setIsFiltersOpen(true);
              }}
              icon={<FilterOutlined />}
            >
              {t("table.filters")}
            </Button>
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 16 }} lg={{ span: 12 }}>
            <FilterChips
              initial_query={INITIAL_QUERY}
              startDateKeyName="start_date"
              endDateKeyName="end_date"
              query={query}
              setQuery={setQuery}
              haveInitialDate
            />
          </Col>
        </Row>
      </Col>

      <Col span={24}>
        <CustomTable
          query={query}
          setCurrentItem={() => {
            return;
          }}
          setQuery={setQuery}
          data={data}
          refetch={refetch}
          items={data?.items}
          error={error}
          columns={[
            { name: "_id", type: "id" },
            { name: "date", type: "birth" },
            { name: "assertiva_count", type: "text" },
            { name: "serpro_count", type: "text" },
            { name: "serpro_cnpj_count", type: "text" },
          ]}
          loading={isFetching}
          label={["assertiva_count", "serpro_count", "createdAt"]}
        />
      </Col>
      <FiltersModal
        open={isFiltersOpen}
        setOpen={setIsFiltersOpen}
        query={query}
        setQuery={setQuery}
        filters={["start_date", "end_date"]}
        refetch={() => {
          return;
        }}
        selectOptions={{}}
        startDateKeyName="start_date"
        endDateKeyName="end_date"
        initialQuery={INITIAL_QUERY}
        haveInitialDate
      />
    </Row>
  );
};
