/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-empty-pattern */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomTable } from "@src/components/CustomTable";
import { FiltersModal } from "@src/components/FiltersModal";
import { FilterChips } from "@src/components/FiltersModal/filterChips";
import { useListBanks } from "@src/services/bank/listBanks";
import { useGetMerchantAttachments } from "@src/services/register/merchant/attachments/getAttachments";
import { useMerchantFeesConfig } from "@src/services/register/merchant/merchant/feesConfig/getFeesConfig";
import { useGetMerchantById } from "@src/services/register/merchant/merchant/getMerchant";
import { useGetMerchantResponsibles } from "@src/services/register/merchant/responsibles/getResponsibles";
import {
  MerchantResponsiblesItem,
  MerchantResponsiblesQuery,
} from "@src/services/types/register/merchants/responsibles/responsibles.interface";
import {
  Avatar,
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
import { useMediaQuery } from "react-responsive";
import { useLocation } from "react-router-dom";

export const MerchantDetails = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const INITIAL_RESPONSIBLE_QUERY: MerchantResponsiblesQuery = {
    merchant_id: location.state.id,
    limit: 25,
    page: 1,
  };
  const { bankListData } = useListBanks({
    limit: 200,
    page: 1,
  });
  const isMobile = useMediaQuery({ maxWidth: "760px" });

  const [responsibleQuery, setResponsibleQuery] =
    useState<MerchantResponsiblesQuery>(INITIAL_RESPONSIBLE_QUERY);
  const [, setCurrentResponsible] = useState<MerchantResponsiblesItem | null>(
    null
  );
  const [isResponsibleFiltersOpen, setIsResponsibleFiltersOpen] =
    useState<boolean>(false);
  const {
    ResponsiblesData,
    ResponsiblesDataError,
    isResponsiblesDataFetching,
    refetchResponsiblesData,
  } = useGetMerchantResponsibles(responsibleQuery);

  const { MerchantAttachmentsData, isMerchantAttachmentsDataFetching } =
    useGetMerchantAttachments({ merchant_id: location.state.id });
  const { MerchantByIdData } = useGetMerchantById(location.state.id);
  const { merchantFeesData } = useMerchantFeesConfig(location.state.id);

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: t("table.merchant_data"),
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
                {location?.state?.cnpj || "-"}
              </Descriptions.Item>
              <Descriptions.Item
                key={"domain"}
                label={t(`table.domain`)}
                labelStyle={{
                  maxWidth: "120px !important",
                  margin: 0,
                  padding: 0,
                  textAlign: "center",
                }}
              >
                {location?.state?.domain || "-"}
              </Descriptions.Item>
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
            </Descriptions>
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 8 }}>
            <Descriptions column={1} bordered>
              <Descriptions.Item
                key={"v3_id"}
                label={t(`table.v3_id`)}
                labelStyle={{
                  maxWidth: "120px !important",
                  margin: 0,
                  padding: 0,
                  textAlign: "center",
                }}
              >
                {location?.state?.v3_id ?? "-"}
              </Descriptions.Item>
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
                {location?.state?.status
                  ? t("table.active")
                  : t("table.inactive")}
              </Descriptions.Item>
              {MerchantByIdData?.merchant_type && (
                <Descriptions.Item
                  key={"merchant_type"}
                  label={t(`table.merchant_type`)}
                  labelStyle={{
                    maxWidth: "120px !important",
                    margin: 0,
                    padding: 0,
                    textAlign: "center",
                  }}
                >
                  {t(`table.${MerchantByIdData?.merchant_type}`)}
                </Descriptions.Item>
              )}
              {MerchantByIdData?.language && (
                <Descriptions.Item
                  key={"language"}
                  label={t(`table.language`)}
                  labelStyle={{
                    maxWidth: "120px !important",
                    margin: 0,
                    padding: 0,
                    textAlign: "center",
                  }}
                >
                  {MerchantByIdData?.language}
                </Descriptions.Item>
              )}
              {MerchantByIdData?.currency && (
                <Descriptions.Item
                  key={"currency"}
                  label={t(`table.currency`)}
                  labelStyle={{
                    maxWidth: "120px !important",
                    margin: 0,
                    padding: 0,
                    textAlign: "center",
                  }}
                >
                  {MerchantByIdData?.currency}
                </Descriptions.Item>
              )}
              {location?.state?.merchantConfig &&
                location?.state?.merchantConfig?.cash_in_bank && (
                  <Descriptions.Item
                    key={"cash_in_bank"}
                    label={t(`table.cash_in_bank`)}
                    labelStyle={{
                      maxWidth: "120px !important",
                      margin: 0,
                      padding: 0,
                      textAlign: "center",
                    }}
                  >
                    <Avatar
                      src={
                        bankListData?.itens.find(
                          (bank) =>
                            bank.bank ===
                            location?.state?.merchantConfig?.cash_in_bank
                        )?.icon_url
                      }
                    />
                  </Descriptions.Item>
                )}
              {location?.state?.merchantConfig &&
                location?.state?.merchantConfig?.cash_out_bank && (
                  <Descriptions.Item
                    key={"cash_out_bank"}
                    label={t(`table.cash_out_bank`)}
                    labelStyle={{
                      maxWidth: "120px !important",
                      margin: 0,
                      padding: 0,
                      textAlign: "center",
                    }}
                  >
                    <Avatar
                      src={
                        bankListData?.itens.find(
                          (bank) =>
                            bank.bank ===
                            location?.state?.merchantConfig?.cash_out_bank
                        )?.icon_url
                      }
                    />
                  </Descriptions.Item>
                )}
            </Descriptions>
          </Col>
          {(location?.state?.aggregator ||
            location?.state?.partner ||
            location?.state?.operator) && (
            <Col xs={{ span: 24 }} md={{ span: 8 }}>
              <Descriptions column={1} bordered>
                {location?.state?.aggregator && (
                  <Descriptions.Item
                    key={"aggregator"}
                    label={t(`table.aggregator`)}
                    labelStyle={{
                      maxWidth: "120px !important",
                      margin: 0,
                      padding: 0,
                      textAlign: "center",
                    }}
                  >
                    {location?.state?.aggregator?.name}
                  </Descriptions.Item>
                )}
                {location?.state?.partner && (
                  <Descriptions.Item
                    key={"partner"}
                    label={t(`table.partner`)}
                    labelStyle={{
                      maxWidth: "120px !important",
                      margin: 0,
                      padding: 0,
                      textAlign: "center",
                    }}
                  >
                    {location?.state?.partner?.name}
                  </Descriptions.Item>
                )}
                {location?.state?.operator && (
                  <Descriptions.Item
                    key={"operator"}
                    label={t(`table.operator`)}
                    labelStyle={{
                      maxWidth: "120px !important",
                      margin: 0,
                      padding: 0,
                      textAlign: "center",
                    }}
                  >
                    {location?.state?.operator?.name}
                  </Descriptions.Item>
                )}
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
                  {`${new Date(
                    location?.state?.created_at
                  ).toLocaleDateString()} ${new Date(
                    location?.state?.created_at
                  ).toLocaleTimeString()}`}
                </Descriptions.Item>
                <Descriptions.Item
                  key={"updated_at"}
                  label={t(`table.updated_at`)}
                  labelStyle={{
                    maxWidth: "120px !important",
                    margin: 0,
                    padding: 0,
                    textAlign: "center",
                  }}
                >
                  {`${new Date(
                    location?.state?.updated_at
                  ).toLocaleDateString()} ${new Date(
                    location?.state?.updated_at
                  ).toLocaleTimeString()}`}
                </Descriptions.Item>
              </Descriptions>
            </Col>
          )}
        </Row>
      ),
    },
    {
      key: "2",
      label: t("table.fee"),
      children: (
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <Descriptions column={isMobile ? 1 : 3} bordered>
    
              <Descriptions.Item
                key={"cashin_pix_fee_type"}
                label={`${t(`table.cashin_pix_fee_type`)}`}
                labelStyle={{
                  maxWidth: "120px !important",
                  margin: 0,
                  padding: 0,
                  textAlign: "center",
                }}
              >
                {merchantFeesData?.fees?.cashin_pix_fee_type
                  ? t(
                      `table.${merchantFeesData?.fees?.cashin_pix_fee_type.toLocaleLowerCase()}`
                    )
                  : "-"}
              </Descriptions.Item>
              <Descriptions.Item
                key={"cashin_pix_fee_percent"}
                label={`${t(`table.cashin_pix_fee_percent`)}`}
                labelStyle={{
                  maxWidth: "120px !important",
                  margin: 0,
                  padding: 0,
                  textAlign: "center",
                }}
              >
                {merchantFeesData?.fees?.cashin_pix_fee_percent
                  ? `${merchantFeesData?.fees?.cashin_pix_fee_percent}%`
                  : "-"}
              </Descriptions.Item>

              <Descriptions.Item
                key={"cashin_pix_fee_value"}
                label={`${t(`table.cashin_pix_fee_value`)}`}
                labelStyle={{
                  maxWidth: "120px !important",
                  margin: 0,
                  padding: 0,
                  textAlign: "center",
                }}
              >
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(
                  Number(merchantFeesData?.fees?.cashin_pix_fee_value) || 0
                )}
              </Descriptions.Item>
              <Descriptions.Item
                key={"customer_withdraw_fee_type"}
                label={`${t(`table.customer_withdraw_fee_type`)}`}
                labelStyle={{
                  maxWidth: "120px !important",
                  margin: 0,
                  padding: 0,
                  textAlign: "center",
                }}
              >
                {merchantFeesData?.fees?.customer_withdraw_fee_type
                  ? t(
                      `table.${merchantFeesData?.fees?.customer_withdraw_fee_type.toLocaleLowerCase()}`
                    )
                  : "-"}
              </Descriptions.Item>
              <Descriptions.Item
                key={"customer_withdraw_fee_percent"}
                label={`${t(`table.customer_withdraw_fee_percent`)}`}
                labelStyle={{
                  maxWidth: "120px !important",
                  margin: 0,
                  padding: 0,
                  textAlign: "center",
                }}
              >
                {merchantFeesData?.fees?.customer_withdraw_fee_percent
                  ? `${merchantFeesData?.fees?.customer_withdraw_fee_percent}%`
                  : "-"}
              </Descriptions.Item>

              <Descriptions.Item
                key={"customer_withdraw_fee_value"}
                label={`${t(`table.customer_withdraw_fee_value`)}`}
                labelStyle={{
                  maxWidth: "120px !important",
                  margin: 0,
                  padding: 0,
                  textAlign: "center",
                }}
              >
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(
                  Number(merchantFeesData?.fees?.customer_withdraw_fee_value) ||
                    0
                )}
              </Descriptions.Item>
              <Descriptions.Item
                key={"fastpix_in_fee_type"}
                label={`${t(`table.fastpix_in_fee_type`)}`}
                labelStyle={{
                  maxWidth: "120px !important",
                  margin: 0,
                  padding: 0,
                  textAlign: "center",
                }}
              >
                {merchantFeesData?.fees?.fastpix_in_fee_type
                  ? t(
                      `table.${merchantFeesData?.fees?.fastpix_in_fee_type.toLocaleLowerCase()}`
                    )
                  : "-"}
              </Descriptions.Item>
              <Descriptions.Item
                key={"fastpix_in_fee_percent"}
                label={`${t(`table.fastpix_in_fee_percent`)}`}
                labelStyle={{
                  maxWidth: "120px !important",
                  margin: 0,
                  padding: 0,
                  textAlign: "center",
                }}
              >
                {merchantFeesData?.fees?.fastpix_in_fee_percent
                  ? `${merchantFeesData?.fees?.fastpix_in_fee_percent}%`
                  : "-"}
              </Descriptions.Item>

              <Descriptions.Item
                key={"fastpix_in_fee_value"}
                label={`${t(`table.fastpix_in_fee_value`)}`}
                labelStyle={{
                  maxWidth: "120px !important",
                  margin: 0,
                  padding: 0,
                  textAlign: "center",
                }}
              >
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(
                  Number(merchantFeesData?.fees?.fastpix_in_fee_value) || 0
                )}
              </Descriptions.Item>

              <Descriptions.Item
                key={"fastpix_refund_fee_type"}
                label={`${t(`table.fastpix_refund_fee_type`)}`}
                labelStyle={{
                  maxWidth: "120px !important",
                  margin: 0,
                  padding: 0,
                  textAlign: "center",
                }}
              >
                {merchantFeesData?.fees?.fastpix_refund_fee_type
                  ? t(
                      `table.${merchantFeesData?.fees?.fastpix_refund_fee_type.toLocaleLowerCase()}`
                    )
                  : "-"}
              </Descriptions.Item>
              <Descriptions.Item
                key={"fastpix_refund_fee_percent"}
                label={`${t(`table.fastpix_refund_fee_percent`)}`}
                labelStyle={{
                  maxWidth: "120px !important",
                  margin: 0,
                  padding: 0,
                  textAlign: "center",
                }}
              >
                {merchantFeesData?.fees?.fastpix_refund_fee_percent
                  ? `${merchantFeesData?.fees?.fastpix_refund_fee_percent}%`
                  : "-"}
              </Descriptions.Item>

              <Descriptions.Item
                key={"fastpix_refund_fee_value"}
                label={`${t(`table.fastpix_refund_fee_value`)}`}
                labelStyle={{
                  maxWidth: "120px !important",
                  margin: 0,
                  padding: 0,
                  textAlign: "center",
                }}
              >
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(
                  Number(merchantFeesData?.fees?.fastpix_refund_fee_value) || 0
                )}
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      ),
    },
    {
      key: "3",
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
                disabled={["merchant_id"]}
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
              disabled={["merchant_id"]}
            />
          )}
        </Row>
      ),
    },
    {
      key: "4",
      label: t("table.attachments"),
      children: isMerchantAttachmentsDataFetching ? (
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
              defaultFileList={MerchantAttachmentsData?.items.map((file) => {
                return {
                  uid: file._id,
                  name: file.file_name,
                  url: file.file_url,
                };
              })}
            />
          </Col>

          {!MerchantAttachmentsData?.total && (
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
          {t("table.merchant")}: {location.state.name}
        </Typography.Title>
      </Col>
      <Col span={24}>
        <Tabs defaultActiveKey="1" items={items} />
      </Col>
    </Row>
  );
};
