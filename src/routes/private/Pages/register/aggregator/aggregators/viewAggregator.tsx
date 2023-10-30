/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-empty-pattern */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomTable } from "@src/components/CustomTable";
import { FiltersModal } from "@src/components/FiltersModal";
import { FilterChips } from "@src/components/FiltersModal/filterChips";
import { useGetAggregatorAttachments } from "@src/services/register/aggregator/attachments/getAttachments";
import { useGetAggregatorResponsibles } from "@src/services/register/aggregator/responsibles/getResponsibles";
import {
  AggregatorResponsiblesItem,
  AggregatorResponsiblesQuery,
} from "@src/services/types/register/aggregators/responsibles/responsibles.interface";
import {
  Button,
  Col,
  Descriptions,
  Empty,
  Row,
  Spin,
  Tabs,
  TabsProps,
  Typography,
  Upload,
} from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

export const AggregatorDetails = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const INITIAL_RESPONSIBLE_QUERY: AggregatorResponsiblesQuery = {
    aggregator_id: location.state.id,
    limit: 25,
    page: 1,
  };

  const [responsibleQuery, setResponsibleQuery] =
    useState<AggregatorResponsiblesQuery>(INITIAL_RESPONSIBLE_QUERY);
  const [, setCurrentResponsible] = useState<AggregatorResponsiblesItem | null>(
    null
  );
  const [isResponsibleFiltersOpen, setIsResponsibleFiltersOpen] =
    useState<boolean>(false);
  const {
    ResponsiblesData,
    ResponsiblesDataError,
    isResponsiblesDataFetching,
    refetchResponsiblesData,
  } = useGetAggregatorResponsibles(responsibleQuery);

  const { AggregatorAttachmentsData, isAggregatorAttachmentsDataFetching } =
    useGetAggregatorAttachments({ aggregator_id: location.state.id });

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: t("table.aggregator_data"),
      children: (
        <Row gutter={[8, 8]}>
          <Col xs={{ span: 24 }} md={{ span: 8 }}>
            <Descriptions column={1} bordered>
              <Descriptions.Item
                key={"id"}
                label={t(`table.id`)}
                labelStyle={{
                  maxWidth: "120px !important",
                  margin: 0,
                  padding: 0,
                  textAlign: "center",
                }}
              >
                {location?.state?.id ?? "-"}
              </Descriptions.Item>
              <Descriptions.Item
                key={"name"}
                label={t(`table.name`)}
                labelStyle={{
                  maxWidth: "120px !important",
                  margin: 0,
                  padding: 0,
                  textAlign: "center",
                }}
              >
                {location?.state?.name ?? "-"}
              </Descriptions.Item>
              <Descriptions.Item
                key={"cnpj"}
                label={t(`table.cnpj`)}
                labelStyle={{
                  maxWidth: "120px !important",
                  margin: 0,
                  padding: 0,
                  textAlign: "center",
                }}
              >
                {location?.state?.cnpj ?? "-"}
              </Descriptions.Item>
             
            </Descriptions>
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 8 }}>
            <Descriptions column={1} bordered>
              <Descriptions.Item
                key={"email"}
                label={t(`table.email`)}
                labelStyle={{
                  maxWidth: "120px !important",
                  margin: 0,
                  padding: 0,
                  textAlign: "center",
                }}
              >
                {location?.state?.email ?? "-"}
              </Descriptions.Item>
              <Descriptions.Item
                key={"cellphone"}
                label={t(`table.cellphone`)}
                labelStyle={{
                  maxWidth: "120px !important",
                  margin: 0,
                  padding: 0,
                  textAlign: "center",
                }}
              >
                {location?.state?.cellphone ?? "-"}
              </Descriptions.Item>
              <Descriptions.Item
                key={"country"}
                label={t(`table.country`)}
                labelStyle={{
                  maxWidth: "120px !important",
                  margin: 0,
                  padding: 0,
                  textAlign: "center",
                }}
              >
                {location?.state.country ?? "-"}
              </Descriptions.Item>
            </Descriptions>
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 8 }}>
            <Descriptions column={1} bordered>
              <Descriptions.Item
                key={"status"}
                label={t(`table.status`)}
                labelStyle={{
                  maxWidth: "120px !important",
                  margin: 0,
                  padding: 0,
                  textAlign: "center",
                }}
              >
                {location?.state?.status === 1
                  ? t("table.active")
                  : t("table.inactive")}
              </Descriptions.Item>
              <Descriptions.Item
                key={"linked_merchants_total"}
                label={t(`table.linked_merchants_total`)}
                labelStyle={{
                  maxWidth: "120px !important",
                  margin: 0,
                  padding: 0,
                  textAlign: "center",
                }}
              >
                {location?.state?.linked_merchants_total ?? 0}
              </Descriptions.Item>
              <Descriptions.Item
                key={"linked_operators_total"}
                label={t(`table.linked_operators_total`)}
                labelStyle={{
                  maxWidth: "120px !important",
                  margin: 0,
                  padding: 0,
                  textAlign: "center",
                }}
              >
                {location?.state?.linked_operators_total ?? 0}
              </Descriptions.Item>
              <Descriptions.Item
                key={"createdAt"}
                label={t(`table.created_at`)}
                labelStyle={{
                  maxWidth: "120px !important",
                  margin: 0,
                  padding: 0,
                  textAlign: "center",
                }}
              >
                {`${new Date(location?.state?.created_at).toLocaleDateString()} ${new Date(
                    location?.state?.created_at
                  ).toLocaleTimeString()}`}
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      ),
    },
    {
      key: "2",
      label: t("table.responsibles"),
      children: (
        <Row gutter={[8, 16]} style={{ width: "100%" }}>
          <Row style={{ width: "100%" }} gutter={[8, 2]} align="middle">
            <Col xs={{ span: 24 }} md={{ span: 4 }}>
              <Button
                size="large"
                style={{ width: "100%" }}
                loading={isResponsiblesDataFetching}
                type="primary"
                onClick={() => setIsResponsibleFiltersOpen(true)}
              >
                {t("table.filters")}
              </Button>
            </Col>{" "}
            <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 15 }}>
              <FilterChips
                disabled={["aggregator_id"]}
                startDateKeyName="start_date"
                endDateKeyName="end_date"
                query={responsibleQuery}
                setQuery={setResponsibleQuery}
              />
            </Col>
          </Row>

          <Col span={24}>
            <CustomTable
              query={responsibleQuery}
              setCurrentItem={setCurrentResponsible}
              setQuery={setResponsibleQuery}
              actions={[]}
              data={ResponsiblesData}
              items={ResponsiblesData?.items}
              error={ResponsiblesDataError}
              columns={[
                { name: "name", type: "text" },
                { name: "email", type: "text" },
                { name: "cellphone", type: "text" },
                { name: "position", type: "text" },
                { name: "created_at", type: "date" },
              ]}
              loading={isResponsiblesDataFetching}
              label={["name", "position"]}
            />
          </Col>

          {isResponsibleFiltersOpen && (
            <FiltersModal
              open={isResponsibleFiltersOpen}
              setOpen={setIsResponsibleFiltersOpen}
              query={responsibleQuery}
              setQuery={setResponsibleQuery}
              filters={["start_date", "end_date"]}
              refetch={refetchResponsiblesData}
              selectOptions={{}}
              startDateKeyName="start_date"
              endDateKeyName="end_date"
              initialQuery={INITIAL_RESPONSIBLE_QUERY}
              disabled={["aggregator_id"]}
            />
          )}
        </Row>
      ),
    },
    {
      key: "3",
      label: t("table.attachments"),
      children: isAggregatorAttachmentsDataFetching ? (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <Upload
              listType="picture"
              accept="*"
              multiple={false}
              showUploadList={{
                showRemoveIcon: false,
              }}
              defaultFileList={AggregatorAttachmentsData?.items.map((file) => {
                return {
                  uid: file._id,
                  name: file.file_name,
                  url: file.file_url,
                };
              })}
            />
          </Col>

          {!AggregatorAttachmentsData?.total && (
            <Col span={24}>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={t("error.400")}
              />
            </Col>
          )}
        </Row>
      ),
    },
  ];
  return (
    <Row style={{ padding: 25 }}>
      <Col span={24}>
        <Typography.Title level={4}>
          {t("table.aggregator")}: {location.state.name}
        </Typography.Title>
      </Col>
      <Col span={24}>
        <Tabs defaultActiveKey="1" items={items} />
      </Col>
    </Row>
  );
};
