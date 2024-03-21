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
import { useGetFiles } from "@src/services/register/persons/persons/files/getFiles";
import { useGetPersons } from "@src/services/register/persons/persons/getPersons";
import { paidDepositTotalQuery } from "@src/services/types/consult/deposits/PaidDeposits.interface";
import { generatedDepositTotalQuery } from "@src/services/types/consult/deposits/generatedDeposits.interface";
import { generatedWithdrawalsRowsQuery } from "@src/services/types/consult/withdrawals/generatedWithdrawals.interface";
import { PersonsQuery } from "@src/services/types/register/persons/persons.interface";
import { moneyFormatter } from "@src/utils/moneyFormatter";
import { Descriptions, Empty, Spin, Tabs, TabsProps, Upload } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useParams } from "react-router-dom";
import { TotalizersCards as DepositsCards } from "../../../consult/deposits/generated/components/TotalizersCards";
import { TotalizersCards } from "../../../consult/withdrawals/generated/components/TotalizersCards";

export const PersonDetails = () => {
  const { t } = useTranslation();
  const currentData = useLocation()?.state;
  const { cpf } = useParams();
  const query: PersonsQuery = {
    limit: 25,
    page: 1,
    sort_field: "created_at",
    sort_order: "DESC",
    cpf: currentData?.cpf,
  };
  const [personData, setPersonData] = useState({
    _id: currentData?._id,
    cpf: currentData?.cpf,
    state: currentData?.state,
    name: currentData?.name,
    city: currentData?.city,
    mother_name: currentData?.mother_name,
    neighborhood: currentData?.neighborhood,
    birth_date: currentData?.birth_date,
    createdAt: currentData?.createdAt,
    gender: currentData?.gender,
    updatedAt: currentData?.updatedAt,
    situation_text: currentData?.situation_text,
    email: currentData?.email,
    last_check: currentData?.last_check,
    cellphone: currentData?.cellphone,
  });
  const [blacklistData, setBlacklistData] = useState({
    black_list: currentData?.black_list,
    black_list_reason: currentData?.black_list_reason,
    black_list_description: currentData?.black_list_description,
    flag_pep: currentData?.flag_pep,
    flag_aux_gov: currentData?.flag_aux_gov,
    flag_alert: currentData?.flag_alert,
  });
  const [LimitsData, setLimitsData] = useState({
    cash_in_max_value: currentData?.cash_in_max_value,
    cash_out_max_value: currentData?.cash_out_max_value,
    cash_out_transaction_limit: currentData?.cash_out_transaction_limit,
  });
  const { isPersonsDataFetching } = useGetPersons(query);

  ///// generated deposits ------------------

  const [gDepositQuery, setGDepositQuery] =
    useState<generatedDepositTotalQuery>({
      sort_order: "DESC",
      sort_field: "created_at",
      limit: 25,
      page: 1,
      buyer_document: cpf?.split(" ").join("").split("-").join(""),
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
    payer_document: cpf?.split(" ").join("").split("-").join(""),
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
      receiver_document: cpf?.split(" ").join("").split("-").join(""),
    });
  const {
    WithdrawalsTotal,
    isWithdrawalsTotalFetching,
    refetchWithdrawalsTotal,
  } = useGetTotalGeneratedWithdrawals(WithdrawalsQuery);

  const { witrawalsRows, witrawalsRowsError, isWithdrawalsRowsFetching } =
    useGetRowsGeneratedWithdrawals(WithdrawalsQuery);

  ///// attachments -------------------------

  const { Files, isFilesFetching } = useGetFiles(cpf?.split(" ").join("."));

  useEffect(() => {
    if (!isPersonsDataFetching && currentData) {
      setPersonData({
        _id: currentData?._id,
        cpf: currentData?.cpf,
        state: currentData?.state,
        name: currentData?.name,
        city: currentData?.city,
        mother_name: currentData?.mother_name,
        neighborhood: currentData?.neighborhood,
        birth_date: currentData?.birth_date,
        createdAt: currentData?.createdAt,
        gender: currentData?.gender,
        updatedAt: currentData?.updatedAt,
        situation_text: currentData?.situation_text,
        email: currentData?.email,
        last_check: currentData?.last_check,
        cellphone: currentData?.cellphone,
      });

      setBlacklistData({
        black_list: currentData?.black_list,
        black_list_reason: currentData?.black_list_reason,
        black_list_description: currentData?.black_list_description,
        flag_pep: currentData?.flag_pep,
        flag_aux_gov: currentData?.flag_aux_gov,
        flag_alert: currentData?.flag_alert,
      });
      setLimitsData({
        cash_in_max_value: currentData?.cash_in_max_value,
        cash_out_max_value: currentData?.cash_out_max_value,
        cash_out_transaction_limit: currentData?.cash_out_transaction_limit,
      });
    }
  }, [currentData]);

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: t("table.general_data"),
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
              {!isPersonsDataFetching &&
                Object.keys(personData).map((key, index) => {
                  switch (key) {
                    case "birth_date":
                      return (
                        <Descriptions.Item
                          key={key}
                          label={t(`table.${key}`)}
                          labelStyle={{
                            maxWidth: "120px !important",
                            margin: 0,
                            padding: 0,
                            textAlign: "center",
                          }}
                        >
                          {currentData[key]
                            ? `${new Date(
                                currentData[key] ?? ""
                              ).toLocaleDateString("pt-BR", {
                                timeZone: "UTC",
                              })}`
                            : "-"}
                        </Descriptions.Item>
                      );

                    case "createdAt":
                    case "last_check":
                    case "updatedAt":
                      return (
                        <Descriptions.Item
                          key={key}
                          label={t(`table.${key}`)}
                          labelStyle={{
                            maxWidth: "120px !important",
                            margin: 0,
                            padding: 0,
                            textAlign: "center",
                          }}
                        >
                          {`${new Date(
                            currentData[key] ?? ""
                          ).toLocaleDateString()} ${new Date(
                            currentData[key] ?? ""
                          ).toLocaleTimeString()}`}
                        </Descriptions.Item>
                      );

                    case "flag_pep":
                    case "flag_aux_gov":
                    case "black_list":
                      return (
                        <Descriptions.Item
                          key={key}
                          label={t(`table.${key}`)}
                          labelStyle={{
                            maxWidth: "120px !important",
                            margin: 0,
                            padding: 0,
                            textAlign: "center",
                          }}
                        >
                          {currentData[key]
                            ? t("table.true")
                            : t("table.false")}
                        </Descriptions.Item>
                      );

                    default:
                      return (
                        <Descriptions.Item
                          key={index}
                          label={t(`table.${key}`)}
                          labelStyle={{
                            maxWidth: "120px !important",
                            margin: 0,
                            padding: 0,
                            textAlign: "center",
                          }}
                        >
                          {(currentData as any)[key] ?? "-"}
                        </Descriptions.Item>
                      );
                  }
                })}
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
          <Grid item md={8} xs={12}>
            <Descriptions bordered style={{ margin: 0, padding: 0 }}>
              {!isPersonsDataFetching &&
                Object.keys(blacklistData).map((key, index) => {
                  switch (key) {
                    case "flag_pep":
                    case "flag_aux_gov":
                    case "black_list":
                      return (
                        <Descriptions.Item
                          key={key}
                          label={t(`table.${key}`)}
                          labelStyle={{
                            maxWidth: "120px !important",
                            margin: 0,
                            padding: 0,
                            textAlign: "center",
                          }}
                        >
                          {currentData[key]
                            ? t("table.true")
                            : t("table.false")}
                        </Descriptions.Item>
                      );

                    default:
                      return (
                        <Descriptions.Item
                          key={index}
                          label={t(`table.${key}`)}
                          labelStyle={{
                            maxWidth: "120px !important",
                            margin: 0,
                            padding: 0,
                            textAlign: "center",
                          }}
                        >
                          {(currentData as any)[key] ?? "-"}
                        </Descriptions.Item>
                      );
                  }
                })}
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
              {!isPersonsDataFetching &&
                Object.keys(LimitsData).map((key, index) => {
                  switch (key) {
                    case "cash_out_transaction_limit":
                      return (
                        <Descriptions.Item
                          key={index}
                          label={t(`table.${key}`)}
                          labelStyle={{
                            maxWidth: "120px !important",
                            margin: 0,
                            padding: 0,
                            textAlign: "center",
                          }}
                        >
                          {(currentData as any)[key]
                            ? (currentData as any)[key]
                            : "-"}
                        </Descriptions.Item>
                      );

                    default:
                      return (
                        <Descriptions.Item
                          key={index}
                          label={t(`table.${key}`)}
                          labelStyle={{
                            maxWidth: "120px !important",
                            margin: 0,
                            padding: 0,
                            textAlign: "center",
                          }}
                        >
                          {(currentData as any)[key]
                            ? moneyFormatter((currentData as any)[key])
                            : "-"}
                        </Descriptions.Item>
                      );
                  }
                })}
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
