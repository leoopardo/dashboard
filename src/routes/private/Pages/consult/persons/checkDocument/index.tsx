/* eslint-disable @typescript-eslint/no-explicit-any */
import { LockOutlined, SearchOutlined } from "@ant-design/icons";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { Grid } from "@mui/material";
import { useGetCheckCnpj } from "@src/services/consult/persons/checkCNPJ";
import { useGetCheckCpf } from "@src/services/consult/persons/checkDocument";
import { useGetCheckCpfDetails } from "@src/services/consult/persons/checkDocumentsDetails";
import { moneyFormatter } from "@src/utils/moneyFormatter";
import { Button, Descriptions, Input, Select, Space, Typography } from "antd";
import moment from "moment";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ReactInputMask from "react-input-mask";
import { useMediaQuery } from "react-responsive";
import { ViewModal } from "./components/ViewModal";

export const CheckDocument = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState<string>("");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: "750px" });
  const [searchOption, setSearchOption] = useState<"cpf" | "cnpj">("cpf");

  const {
    CheckCpfData,
    isCheckCpfDataFetching,
    refetchCheckCpfData,
    remove,
    CheckCpfDataError,
  } = useGetCheckCpf(searchOption === "cpf" ? search : "");
  const {
    CheckCnpjData,
    isCheckCnpjDataFetching,
    refetchCheckCnpjData,
    removeCnpj,
    CheckCnpjDataError,
  } = useGetCheckCnpj(searchOption === "cnpj" ? search : "");
  const merchantsBlacklistData = useGetCheckCpfDetails(search);

  return (
    <Grid container style={{ padding: "25px" }}>
      <Grid container style={{ marginTop: "5px" }} spacing={1}>
        <Grid item xs={12} md={5} lg={5}>
          <Space.Compact block size="large">
            <Select
              value={searchOption}
              onChange={(value) => {
                setSearchOption(value);
                setSearch("");
                remove();
                removeCnpj();
              }}
              style={{ width: "40%" }}
              options={[
                { label: t("table.cpf"), value: "cpf" },
                { label: t("table.cnpj"), value: "cnpj" },
              ]}
            />
            <ReactInputMask
              value={search}
              mask={
                searchOption === "cpf" ? "999.999.999-99" : "99.999.999/9999-99"
              }
              onChange={(event) => {
                if (searchOption === "cnpj") {
                  event.target.value = event.target.value.replace(/\D/g, "");
                }
                setSearch(event.target.value);
              }}
            >
              <Input
                size="large"
                placeholder={
                  searchOption === "cpf"
                    ? t("table.cpf") || ""
                    : t("table.cnpj") || ""
                }
                status={CheckCnpjDataError || CheckCpfDataError ? "error" : ""}
              />
            </ReactInputMask>
            <Button
              type="primary"
              loading={isCheckCpfDataFetching || isCheckCnpjDataFetching}
              onClickCapture={() => {
                if (searchOption === "cpf") {
                  refetchCheckCpfData();
                  merchantsBlacklistData.refetchCheckCpfData();
                }
                if (searchOption === "cnpj") {
                  refetchCheckCnpjData();
                  merchantsBlacklistData.refetchCheckCpfData();
                }
              }}
              icon={<SearchOutlined />}
            >
              {t("buttons.check")}
            </Button>
          </Space.Compact>
          <Typography.Text type="danger">
            {CheckCnpjDataError || CheckCpfDataError
              ? t("error.invalidCPFOrCNPJ")
              : ""}
          </Typography.Text>
        </Grid>
        <Grid item xs={12} md={3} lg={2}>
          <Button
            type="dashed"
            loading={isCheckCpfDataFetching}
            danger
            icon={<FilterAltOffOutlinedIcon />}
            onClick={() => {
              setSearch("");
              remove();
              removeCnpj();
            }}
            style={{
              height: 40,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {t("table.clear_filters")}
          </Button>
        </Grid>
      </Grid>
      <Grid container style={{ marginTop: "25px" }}>
        {(CheckCpfData || CheckCnpjData) && (
          <Grid
            container
            item
            xs={12}
            justifyContent={"flex-end"}
            style={{ marginBottom: 10 }}
          >
            <Button
              icon={<LockOutlined />}
              size="large"
              onClick={() => setIsViewModalOpen(true)}
            >
              {t("buttons.merchant_blacklist_details")}
            </Button>
          </Grid>
        )}
        <Grid item xs={12}>
          <Descriptions
            bordered
            style={{ margin: 0, padding: 0 }}
            column={isMobile ? 1 : 3}
          >
            {CheckCpfData &&
              searchOption === "cpf" &&
              Object.keys(CheckCpfData).map((key: string, index) => {
                switch (key) {
                  case "birth_date":
                    return (
                      <Descriptions.Item
                        key={key}
                        label={t(`table.${key}`)}
                        labelStyle={{
                          maxWidth: "140px !important",
                          margin: 0,
                          padding: 0,
                          textAlign: "center",
                        }}
                      >
                        {CheckCpfData[key]
                          ? `${new Date(
                              CheckCpfData[key] ?? ""
                            ).toLocaleDateString("pt-BR", { timeZone: "UTC" })}`
                          : "-"}
                      </Descriptions.Item>
                    );

                  case "cpf":
                    return (
                      <Descriptions.Item
                        key={key}
                        label={t(`table.${key}`)}
                        labelStyle={{
                          maxWidth: "140px !important",
                          margin: 0,
                          padding: 0,
                          textAlign: "center",
                        }}
                      >
                        {CheckCpfData[key]?.replace(
                          /(\d{3})(\d{3})(\d{3})(\d{2})/,
                          "$1.$2.$3-$4"
                        ) || "-"}
                      </Descriptions.Item>
                    );

                  case "black_list":
                    return (
                      <Descriptions.Item
                        key={key}
                        label={t(`table.${key}`)}
                        labelStyle={{
                          maxWidth: "140px !important",
                          margin: 0,
                          padding: 0,
                          textAlign: "center",
                        }}
                      >
                        {CheckCpfData[key] ? t("table.true") : t("table.false")}
                      </Descriptions.Item>
                    );

                  default:
                    return (
                      <Descriptions.Item
                        key={index}
                        label={t(`table.${key}`)}
                        labelStyle={{
                          maxWidth: "140px !important",
                          margin: 0,
                          padding: 0,
                          textAlign: "center",
                        }}
                      >
                        {(CheckCpfData as any)[key] ?? "-"}
                      </Descriptions.Item>
                    );
                }
              })}
            {!isCheckCnpjDataFetching &&
              CheckCpfData &&
              merchantsBlacklistData?.CheckCpfData?.total &&
              searchOption === "cpf" && (
                <>
                  {merchantsBlacklistData?.CheckCpfData?.total > 0 ? (
                    <Descriptions.Item
                      key={"merchant_blacklist"}
                      label={t(`table.merchant_blacklist`)}
                      labelStyle={{
                        maxWidth: "140px !important",
                        margin: 0,
                        padding: 0,
                        textAlign: "center",
                      }}
                    >
                      {t("table.true")}
                    </Descriptions.Item>
                  ) : (
                    <Descriptions.Item
                      key={"merchant_blacklist"}
                      label={t(`table.merchant_blacklist`)}
                      labelStyle={{
                        maxWidth: "140px !important",
                        margin: 0,
                        padding: 0,
                        textAlign: "center",
                      }}
                    >
                      {t("table.false")}
                    </Descriptions.Item>
                  )}
                </>
              )}

            {CheckCnpjData && searchOption === "cnpj" && (
              <>
                <Descriptions.Item
                  key={"business_name"}
                  label={t(`table.business_name`)}
                  labelStyle={{
                    maxWidth: "140px !important",
                    margin: 0,
                    padding: 0,
                    textAlign: "center",
                  }}
                >
                  {CheckCnpjData?.business_name}
                </Descriptions.Item>
                <Descriptions.Item
                  key={"email"}
                  label={t(`table.email`)}
                  labelStyle={{
                    maxWidth: "140px !important",
                    margin: 0,
                    padding: 0,
                    textAlign: "center",
                  }}
                >
                  {CheckCnpjData?.email}
                </Descriptions.Item>
                <Descriptions.Item
                  key={"country"}
                  label={t(`table.country`)}
                  labelStyle={{
                    maxWidth: "140px !important",
                    margin: 0,
                    padding: 0,
                    textAlign: "center",
                  }}
                >
                  {CheckCnpjData?.address_country}
                </Descriptions.Item>
                <Descriptions.Item
                  key={"legal_nature_description"}
                  label={t(`table.legal_nature_description`)}
                  labelStyle={{
                    maxWidth: "140px !important",
                    margin: 0,
                    padding: 0,
                    textAlign: "center",
                  }}
                >
                  {CheckCnpjData?.legal_nature_description}
                </Descriptions.Item>
                <Descriptions.Item
                  key={"cellphone"}
                  label={t(`table.cellphone`)}
                  labelStyle={{
                    maxWidth: "140px !important",
                    margin: 0,
                    padding: 0,
                    textAlign: "center",
                  }}
                >
                  {CheckCnpjData?.phone}
                </Descriptions.Item>
                <Descriptions.Item
                  key={"state"}
                  label={t(`table.state`)}
                  labelStyle={{
                    maxWidth: "140px !important",
                    margin: 0,
                    padding: 0,
                    textAlign: "center",
                  }}
                >
                  {CheckCnpjData?.address_state}
                </Descriptions.Item>
                <Descriptions.Item
                  key={"registration_status_description"}
                  label={t(`table.registration_status_description`)}
                  labelStyle={{
                    maxWidth: "140px !important",
                    margin: 0,
                    padding: 0,
                    textAlign: "center",
                  }}
                >
                  {t(
                    `table.${CheckCnpjData?.registration_status_description?.toLowerCase()}`
                  )}
                </Descriptions.Item>
                <Descriptions.Item
                  key={"registration_status_date"}
                  label={t(`table.registration_status_date`)}
                  labelStyle={{
                    maxWidth: "140px !important",
                    margin: 0,
                    padding: 0,
                    textAlign: "center",
                  }}
                >
                  {CheckCnpjData?.registration_status_date
                    ? moment(new Date(CheckCnpjData?.registration_status_date))
                        .utc()
                        .format(
                          navigator.language === "pt-BR"
                            ? "DD/MM/YYYY HH:mm"
                            : "YYYY/MM/DD HH:mm"
                        )
                    : "-"}
                </Descriptions.Item>
                <Descriptions.Item
                  key={"neighborhood"}
                  label={t(`table.neighborhood`)}
                  labelStyle={{
                    maxWidth: "140px !important",
                    margin: 0,
                    padding: 0,
                    textAlign: "center",
                  }}
                >
                  {CheckCnpjData?.address_neighborhood}
                </Descriptions.Item>
                <Descriptions.Item
                  key={"registration_status_reason"}
                  label={t(`table.registration_status_reason`)}
                  labelStyle={{
                    maxWidth: "140px !important",
                    margin: 0,
                    padding: 0,
                    textAlign: "center",
                  }}
                >
                  {CheckCnpjData?.registration_status_reason ?? "-"}
                </Descriptions.Item>
                <Descriptions.Item
                  key={"last_check"}
                  label={t(`table.last_check`)}
                  labelStyle={{
                    maxWidth: "140px !important",
                    margin: 0,
                    padding: 0,
                    textAlign: "center",
                  }}
                >
                  {CheckCnpjData?.last_check
                    ? moment(new Date(CheckCnpjData?.last_check))
                        .utc()
                        .format(
                          navigator.language === "pt-BR"
                            ? "DD/MM/YYYY HH:mm"
                            : "YYYY/MM/DD HH:mm"
                        )
                    : "-"}
                </Descriptions.Item>
                <Descriptions.Item
                  key={"street"}
                  label={t(`table.street`)}
                  labelStyle={{
                    maxWidth: "140px !important",
                    margin: 0,
                    padding: 0,
                    textAlign: "center",
                  }}
                >
                  {CheckCnpjData?.address_street}
                </Descriptions.Item>
                <Descriptions.Item
                  key={"main_cnae_code"}
                  label={t(`table.main_cnae_code`)}
                  labelStyle={{
                    maxWidth: "140px !important",
                    margin: 0,
                    padding: 0,
                    textAlign: "center",
                  }}
                >
                  {CheckCnpjData?.main_cnae_code}
                </Descriptions.Item>
              </>
            )}
          </Descriptions>
          {CheckCnpjData && searchOption === "cnpj" && (
            <Descriptions
              bordered
              style={{ margin: 0, padding: 0 }}
              column={isMobile ? 1 : 3}
            >
              <Descriptions.Item
                key={"black_list"}
                label={t(`table.black_list`)}
                labelStyle={{
                  maxWidth: "140px !important",
                  margin: 0,
                  padding: 0,
                  textAlign: "center",
                }}
              >
                {CheckCnpjData?.black_list ? t("table.true") : t("table.false")}
              </Descriptions.Item>
              {merchantsBlacklistData &&
              merchantsBlacklistData?.CheckCpfData?.total > 0 ? (
                <Descriptions.Item
                  key={"merchant_blacklist"}
                  label={t(`table.merchant_blacklist`)}
                  labelStyle={{
                    maxWidth: "140px !important",
                    margin: 0,
                    padding: 0,
                    textAlign: "center",
                  }}
                >
                  {t("table.true")}
                </Descriptions.Item>
              ) : (
                <Descriptions.Item
                  key={"merchant_blacklist"}
                  label={t(`table.merchant_blacklist`)}
                  labelStyle={{
                    maxWidth: "140px !important",
                    margin: 0,
                    padding: 0,
                    textAlign: "center",
                  }}
                >
                  {t("table.false")}
                </Descriptions.Item>
              )}
              {/* <Descriptions.Item
                key={"flag_pep"}
                label={t(`table.flag_pep`)}
                labelStyle={{
                  maxWidth: "140px !important",
                  margin: 0,
                  padding: 0,
                  textAlign: "center",
                }}
              >
                {CheckCnpjData?.flag_pep ? t("table.true") : t("table.false")}
              </Descriptions.Item> */}

              <Descriptions.Item
                key={"flag_alert"}
                label={t(`table.flag_alert`)}
                labelStyle={{
                  maxWidth: "140px !important",
                  margin: 0,
                  padding: 0,
                  textAlign: "center",
                }}
              >
                {CheckCnpjData?.flag_alert}
              </Descriptions.Item>
              <Descriptions.Item
                key={"cash_in_max_value"}
                label={t(`table.cash_in_max_value`)}
                labelStyle={{
                  maxWidth: "140px !important",
                  margin: 0,
                  padding: 0,
                  textAlign: "center",
                }}
              >
                {CheckCnpjData?.cash_in_max_value
                  ? moneyFormatter(CheckCnpjData?.cash_in_max_value)
                  : "-"}
              </Descriptions.Item>
            </Descriptions>
          )}
        </Grid>
      </Grid>

      <ViewModal
        modalName={`Blacklist: ${CheckCnpjData?.business_name ?? CheckCpfData?.name}`}
        open={isViewModalOpen}
        setOpen={setIsViewModalOpen}
        cpf={CheckCpfData?.cpf}
      />
    </Grid>
  );
};
