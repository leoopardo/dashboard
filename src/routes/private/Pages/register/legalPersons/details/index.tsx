/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Grid } from "@mui/material";
import { CustomTable } from "@src/components/CustomTable";
import { useGetRowsGeneratedDeposits } from "@src/services/consult/deposits/generatedDeposits/getRows";
import { useGetTotalGeneratedDeposits } from "@src/services/consult/deposits/generatedDeposits/getTotal";
import { useGetRowsPaidDeposits } from "@src/services/consult/deposits/paidDeposits/getRows";
import { useGetTotalPaidDeposits } from "@src/services/consult/deposits/paidDeposits/getTotal";
import { useGetRowsGeneratedWithdrawals } from "@src/services/consult/withdrawals/generatedWithdrawals/getRows";
import { useGetTotalGeneratedWithdrawals } from "@src/services/consult/withdrawals/generatedWithdrawals/getTotal";
import { useGetLegalPersonFiles } from "@src/services/register/legalPersons/files/getFiles";
import { useGetLegalPersonsByCnpj } from "@src/services/register/legalPersons/getPersonsByCnpj";
import { useGetPersons } from "@src/services/register/persons/persons/getPersons";
import { paidDepositTotalQuery } from "@src/services/types/consult/deposits/PaidDeposits.interface";
import { generatedDepositTotalQuery } from "@src/services/types/consult/deposits/generatedDeposits.interface";
import { generatedWithdrawalsRowsQuery } from "@src/services/types/consult/withdrawals/generatedWithdrawals.interface";
import { PersonsQuery } from "@src/services/types/register/persons/persons.interface";
import { moneyFormatter } from "@src/utils/moneyFormatter";
import { Descriptions, Empty, Spin, Tabs, TabsProps, Upload } from "antd";
import moment from "moment";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useParams } from "react-router-dom";
import { TotalizersCards as DepositsCards } from "../../../consult/deposits/generated/components/TotalizersCards";
import { TotalizersCards } from "../../../consult/withdrawals/generated/components/TotalizersCards";

export const LegalPersonDetails = () => {
  const { t } = useTranslation();
  const currentData = useLocation()?.state;
  const { cnpj } = useParams();
  const query: PersonsQuery = {
    limit: 25,
    page: 1,
    sort_field: "created_at",
    sort_order: "DESC",
    cpf: currentData?.cpf,
  };
  const { LegalPersonsByCnpjData, isLegalPersonsByCnpjDataFetching } =
    useGetLegalPersonsByCnpj(cnpj);

  const { isPersonsDataFetching } = useGetPersons(query);

  ///// generated deposits ------------------

  const [gDepositQuery, setGDepositQuery] =
    useState<generatedDepositTotalQuery>({
      sort_order: "DESC",
      sort_field: "created_at",
      limit: 25,
      page: 1,
      buyer_document: cnpj?.split(" ").join("").split("-").join(""),
    });
  const { depositsTotal, isDepositsTotalFetching, refetchDepositsTotal } =
    useGetTotalGeneratedDeposits(gDepositQuery);

  const { depositsRows, depositsRowsError, isDepositsRowsFetching } =
    useGetRowsGeneratedDeposits(gDepositQuery);

  //////// paid deposits ----------------------

  const [pDepositQuery, setPDepositQuery] = useState<paidDepositTotalQuery>({
    sort_order: "DESC",
    sort_field: "created_at",
    limit: 25,
    page: 1,
    payer_document: cnpj?.split(" ").join("").split("-").join(""),
  });

  const { paidTotal, isPaidTotalFetching, refetchPaidTotal } =
    useGetTotalPaidDeposits(pDepositQuery);

  const { paidRows, paidRowsError, isPaidRowsFetching } =
    useGetRowsPaidDeposits(pDepositQuery);

  ////////// withdrawals --------------------

  const [WithdrawalsQuery, setWithdrawalsQuery] =
    useState<generatedWithdrawalsRowsQuery>({
      sort_order: "DESC",
      sort_field: "created_at",
      limit: 25,
      page: 1,
      receiver_document: cnpj?.split(" ").join("").split("-").join(""),
    });
  const {
    WithdrawalsTotal,
    isWithdrawalsTotalFetching,
    refetchWithdrawalsTotal,
  } = useGetTotalGeneratedWithdrawals(WithdrawalsQuery);

  const { witrawalsRows, witrawalsRowsError, isWithdrawalsRowsFetching } =
    useGetRowsGeneratedWithdrawals(WithdrawalsQuery);

  ///// attachments -------------------------

  const { Files, isFilesFetching } = useGetLegalPersonFiles(cnpj);

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: t("table.general_data"),
      children: isLegalPersonsByCnpjDataFetching ? (
        <div
          style={{
            height: "70vh",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <Grid container spacing={1} display="flex" justifyContent="center">
          <Grid item md={12} xs={12}>
            <Descriptions bordered style={{ margin: 0, padding: 0 }}>
              <Descriptions.Item
                key={"business_name"}
                label={t(`table.business_name`)}
                labelStyle={{
                  maxWidth: "120px !important",
                  margin: 0,
                  padding: 0,
                  textAlign: "center",
                }}
              >
                {LegalPersonsByCnpjData?.business_name}
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
                {LegalPersonsByCnpjData?.email}
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
                {LegalPersonsByCnpjData?.address_country}
              </Descriptions.Item>
              <Descriptions.Item
                key={"trade_name"}
                label={t(`table.trade_name`)}
                labelStyle={{
                  maxWidth: "120px !important",
                  margin: 0,
                  padding: 0,
                  textAlign: "center",
                }}
              >
                {LegalPersonsByCnpjData?.trade_name}
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
                {LegalPersonsByCnpjData?.cnpj}
              </Descriptions.Item>
              <Descriptions.Item
                key={"state"}
                label={t(`table.state`)}
                labelStyle={{
                  maxWidth: "120px !important",
                  margin: 0,
                  padding: 0,
                  textAlign: "center",
                }}
              >
                {LegalPersonsByCnpjData?.address_state}
              </Descriptions.Item>
              <Descriptions.Item
                key={"legal_nature_description"}
                label={t(`table.legal_nature_description`)}
                labelStyle={{
                  maxWidth: "120px !important",
                  margin: 0,
                  padding: 0,
                  textAlign: "center",
                }}
              >
                {LegalPersonsByCnpjData?.legal_nature_description}
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
                {LegalPersonsByCnpjData?.phone}
              </Descriptions.Item>
              <Descriptions.Item
                key={"zip_code"}
                label={t(`table.zip_code`)}
                labelStyle={{
                  maxWidth: "120px !important",
                  margin: 0,
                  padding: 0,
                  textAlign: "center",
                }}
              >
                {LegalPersonsByCnpjData?.address_postal_code}
              </Descriptions.Item>
              <Descriptions.Item
                key={"registration_status_description"}
                label={t(`table.registration_status_description`)}
                labelStyle={{
                  maxWidth: "120px !important",
                  margin: 0,
                  padding: 0,
                  textAlign: "center",
                }}
              >
                {t(
                  `table.${LegalPersonsByCnpjData?.registration_status_description?.toLowerCase()}`
                )}
              </Descriptions.Item>
              <Descriptions.Item
                key={"registration_status_date"}
                label={t(`table.registration_status_date`)}
                labelStyle={{
                  maxWidth: "120px !important",
                  margin: 0,
                  padding: 0,
                  textAlign: "center",
                }}
              >
                {LegalPersonsByCnpjData?.registration_status_date
                  ? moment(
                      new Date(LegalPersonsByCnpjData?.registration_status_date)
                    )
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
                  maxWidth: "120px !important",
                  margin: 0,
                  padding: 0,
                  textAlign: "center",
                }}
              >
                {LegalPersonsByCnpjData?.address_neighborhood}
              </Descriptions.Item>
              <Descriptions.Item
                key={"registration_status_reason"}
                label={t(`table.registration_status_reason`)}
                labelStyle={{
                  maxWidth: "120px !important",
                  margin: 0,
                  padding: 0,
                  textAlign: "center",
                }}
              >
                {LegalPersonsByCnpjData?.registration_status_reason ?? "-"}
              </Descriptions.Item>
              <Descriptions.Item
                key={"last_check"}
                label={t(`table.last_check`)}
                labelStyle={{
                  maxWidth: "120px !important",
                  margin: 0,
                  padding: 0,
                  textAlign: "center",
                }}
              >
                {LegalPersonsByCnpjData?.last_check
                  ? moment(new Date(LegalPersonsByCnpjData?.last_check))
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
                  maxWidth: "120px !important",
                  margin: 0,
                  padding: 0,
                  textAlign: "center",
                }}
              >
                {LegalPersonsByCnpjData?.address_street}
              </Descriptions.Item>
            </Descriptions>
          </Grid>
        </Grid>
      ),
    },
    {
      key: "2",
      label: t("table.blacklist_data"),
      children: isPersonsDataFetching ? (
        <div
          style={{
            height: "70vh",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <Grid container spacing={1} display="flex" justifyContent="center">
          <Grid item md={12} xs={12}>
            <Descriptions bordered style={{ margin: 0, padding: 0 }}>
              <Descriptions.Item
                key={"black_list"}
                label={t(`table.black_list`)}
                labelStyle={{
                  maxWidth: "120px !important",
                  margin: 0,
                  padding: 0,
                  textAlign: "center",
                }}
              >
                {LegalPersonsByCnpjData?.black_list
                  ? t("table.true")
                  : t("table.false")}
              </Descriptions.Item>
              {LegalPersonsByCnpjData?.black_list_description && (
                <Descriptions.Item
                  key={"description"}
                  label={t(`table.description`)}
                  labelStyle={{
                    maxWidth: "120px !important",
                    margin: 0,
                    padding: 0,
                    textAlign: "center",
                  }}
                >
                  {LegalPersonsByCnpjData?.black_list_description}
                </Descriptions.Item>
              )}
              {LegalPersonsByCnpjData?.black_list_reason && (
                <Descriptions.Item
                  key={"reason"}
                  label={t(`table.reason`)}
                  labelStyle={{
                    maxWidth: "120px !important",
                    margin: 0,
                    padding: 0,
                    textAlign: "center",
                  }}
                >
                  {LegalPersonsByCnpjData?.black_list_reason}
                </Descriptions.Item>
              )}
              <Descriptions.Item
                key={"flag_pep"}
                label={t(`table.flag_pep`)}
                labelStyle={{
                  maxWidth: "120px !important",
                  margin: 0,
                  padding: 0,
                  textAlign: "center",
                }}
              >
                {LegalPersonsByCnpjData?.flag_pep
                  ? t("table.true")
                  : t("table.false")}
              </Descriptions.Item>
              <Descriptions.Item
                key={"flag_alert"}
                label={t(`table.flag_alert`)}
                labelStyle={{
                  maxWidth: "120px !important",
                  margin: 0,
                  padding: 0,
                  textAlign: "center",
                }}
              >
                {LegalPersonsByCnpjData?.flag_alert}
              </Descriptions.Item>
            </Descriptions>
          </Grid>
        </Grid>
      ),
    },
    {
      key: "3",
      label: t("table.limits_data"),
      children: isPersonsDataFetching ? (
        <div
          style={{
            height: "70vh",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <Grid container spacing={1} display="flex" justifyContent="center">
          <Grid item md={12} xs={12}>
            <Descriptions bordered style={{ margin: 0, padding: 0 }}>
              <Descriptions.Item
                key={"cash_in_max_value"}
                label={t(`table.cash_in_max_value`)}
                labelStyle={{
                  maxWidth: "120px !important",
                  margin: 0,
                  padding: 0,
                  textAlign: "center",
                }}
              >
                {moneyFormatter(LegalPersonsByCnpjData?.cash_in_max_value || 0)}
              </Descriptions.Item>
            </Descriptions>
          </Grid>
        </Grid>
      ),
    },
    {
      key: "4",
      label: t("table.attachments"),
      children: isFilesFetching ? (
        <div
          style={{
            height: "70vh",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spin size="large" />
        </div>
      ) : Files?.total && Files.total >= 1 ? (
        <Upload
          listType="picture"
          accept="*"
          multiple={false}
          showUploadList={{
            showRemoveIcon: false,
          }}
          defaultFileList={Files?.items.map((file) => {
            return {
              uid: file._id,
              name: file.file_name,
              url: file.file_url,
            };
          })}
        />
      ) : (
        <div
          style={{
            height: "70vh",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={t("error.400")}
          />
        </div>
      ),
    },
    {
      key: "5",
      label: t("menus.generated_deposits"),
      children: (
        <>
          <div style={{ marginBottom: "20px" }}>
            <DepositsCards
              data={depositsTotal}
              fetchData={refetchDepositsTotal}
              loading={isDepositsTotalFetching}
              query={gDepositQuery}
            />
          </div>

          <CustomTable
            query={query}
            setCurrentItem={() => {
              return;
            }}
            setQuery={setGDepositQuery}
            data={depositsRows}
            items={depositsRows?.items}
            error={depositsRowsError}
            columns={[
              { name: "_id", type: "id" },
              { name: "bank", type: "text" },
              { name: "merchant_name", type: "text" },
              { name: "value", type: "value" },
              { name: "createdAt", type: "date" },
              { name: "delivered_at", type: "date" },
              { name: "buyer_name", type: "text" },
              { name: "buyer_document", type: "document" },
              { name: "status", type: "status" },
            ]}
            loading={isDepositsRowsFetching}
            removeTotal
            label={[
              "bank",
              "merchant_name",
              "status",
              "createdAt",
              "delivered_at",
            ]}
          />
        </>
      ),
    },
    {
      key: "6",
      label: t("menus.paid_deposits"),
      children: (
        <>
          <div style={{ marginBottom: "20px" }}>
            <DepositsCards
              data={paidTotal}
              fetchData={refetchPaidTotal}
              loading={isPaidTotalFetching}
              query={pDepositQuery}
            />
          </div>

          <CustomTable
            query={query}
            setCurrentItem={() => {
              return;
            }}
            setQuery={setPDepositQuery}
            data={paidRows}
            items={paidRows?.items}
            error={paidRowsError}
            columns={[
              { name: "_id", type: "id" },
              { name: "bank", type: "text" },
              { name: "merchant_name", type: "text" },
              { name: "value", type: "value" },
              { name: "createdAt", type: "date" },
              { name: "delivered_at", type: "date" },
              { name: "buyer_name", type: "text" },
              { name: "buyer_document", type: "document" },
              { name: "status", type: "status" },
            ]}
            loading={isPaidRowsFetching}
            removeTotal
            label={[
              "bank",
              "merchant_name",
              "status",
              "createdAt",
              "delivered_at",
            ]}
          />
        </>
      ),
    },
    {
      key: "7",
      label: t("menus.withdrawals"),
      children: (
        <>
          <div style={{ marginBottom: "20px" }}>
            <TotalizersCards
              data={WithdrawalsTotal}
              fetchData={refetchWithdrawalsTotal}
              loading={isWithdrawalsTotalFetching}
              query={WithdrawalsQuery}
            />
          </div>
          <CustomTable
            query={WithdrawalsQuery}
            setCurrentItem={() => {
              return;
            }}
            setQuery={setWithdrawalsQuery}
            data={witrawalsRows}
            items={witrawalsRows?.items}
            error={witrawalsRowsError}
            columns={[
              { name: "_id", type: "id" },
              { name: "bank", type: "text" },
              { name: "merchant_name", type: "text" },
              { name: "value", type: "value" },
              { name: "createdAt", type: "date" },
              { name: "delivered_at", type: "date" },
              { name: "receiver_name", type: "text" },
              { name: "receiver_document", type: "document" },
              { name: "pix_key_type", type: "text" },
              { name: "pix_key", type: "text" },
              { name: "status", type: "status" },
            ]}
            loading={isWithdrawalsRowsFetching}
            removeTotal
            label={[
              "bank",
              "merchant_name",
              "status",
              "createdAt",
              "delivered_at",
            ]}
          />
        </>
      ),
    },
  ];

  return (
    <Grid
      container
      style={{
        padding: "25px",
        display: "flex",
      }}
    >
      <Grid item xs={12}>
        <Tabs defaultActiveKey="1" items={items} />
      </Grid>
    </Grid>
  );
};
