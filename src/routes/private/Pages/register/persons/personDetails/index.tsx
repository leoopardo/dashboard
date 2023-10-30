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
import { Descriptions, Empty, Spin, Tabs, TabsProps, Upload } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { useParams } from "react-router-dom";
import { TotalizersCards as DepositsCards } from "../../../consult/deposits/generated/components/TotalizersCards";
import { TotalizersCards } from "../../../consult/withdrawals/generated/components/TotalizersCards";

export const PersonDetails = () => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery({ maxWidth: "750px" });
  const { cpf } = useParams();
  const query: PersonsQuery = {
    limit: 25,
    page: 1,
    sort_field: "created_at",
    sort_order: "DESC",
    cpf: cpf?.split(" ").join("."),
  };
  const [personData, setPersonData] = useState({});
  const [blacklistData, setBlacklistData] = useState({});
  const [LimitsData, setLimitsData] = useState({});
  const { PersonsData, isPersonsDataFetching } = useGetPersons(query);

  ///// generated deposits ------------------

  const [gDepositQuery, setGDepositQuery] =
    useState<generatedDepositTotalQuery>({
      sort_order: "DESC",
      sort_field: "created_at",
      limit: 25,
      page: 1,
      buyer_document: cpf?.split(" ").join("").split("-").join(""),
      initial_date: moment(new Date())
        .subtract(30, "days")
        .format("YYYY-MM-DDTHH:mm:ss.SSS"),
      final_date: moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSS"),
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
    initial_date: moment(new Date())
      .subtract(30, "days")
      .format("YYYY-MM-DDTHH:mm:ss.SSS"),
    final_date: moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSS"),
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
      initial_date: moment(new Date())
        .subtract(30, "days")
        .format("YYYY-MM-DDTHH:mm:ss.SSS"),
      final_date: moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSS"),
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
    if (!isPersonsDataFetching && PersonsData?.items[0]) {
      setPersonData({
        _id: PersonsData?.items[0]._id,
        cpf: PersonsData?.items[0].cpf,
        state: PersonsData?.items[0].state,
        name: PersonsData?.items[0].name,
        city: PersonsData?.items[0].city,
        mother_name: PersonsData?.items[0].mother_name,
        neighborhood: PersonsData?.items[0].neighborhood,
        birth_date: PersonsData?.items[0].birth_date,
        createdAt: PersonsData?.items[0].createdAt,
        gender: PersonsData?.items[0].gender,
        updatedAt: PersonsData?.items[0].updatedAt,
        situation_text: PersonsData?.items[0].situation_text,
        email: PersonsData?.items[0].email,
        last_check: PersonsData?.items[0].last_check,
        cellphone: PersonsData?.items[0].cellphone,
      });

      setBlacklistData({
        black_list: PersonsData?.items[0].black_list,
        black_list_reason: PersonsData?.items[0].black_list_reason,
        black_list_description: PersonsData?.items[0].black_list_description,
        flag_pep: PersonsData?.items[0].flag_pep,
        flag_aux_gov: PersonsData?.items[0].flag_aux_gov,
        flag_alert: PersonsData?.items[0].flag_alert,
      });
      setLimitsData({
        cash_in_max_value: PersonsData?.items[0].cash_in_max_value,
        cash_out_max_value: PersonsData?.items[0].cash_out_max_value,
        cash_out_transaction_limit:
          PersonsData?.items[0].cash_out_transaction_limit,
      });
    }
  }, [PersonsData?.items[0]]);

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
          <Grid item md={10} xs={12}>
            <Descriptions
              bordered
              style={{ margin: 0, padding: 0 }}
              column={isMobile ? 1 : 2}
            >
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
                          {`${new Date(
                            PersonsData?.items[0][key] ?? ""
                          ).toLocaleDateString("pt-BR", {
                            timeZone: "UTC",
                          })}`}
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
                            PersonsData?.items[0][key] ?? ""
                          ).toLocaleDateString()} ${new Date(
                            PersonsData?.items[0][key] ?? ""
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
                          {PersonsData?.items[0][key]
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
                          {(PersonsData?.items[0] as any)[key] ?? "-"}
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
            <Descriptions bordered style={{ margin: 0, padding: 0 }} column={1}>
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
                          {PersonsData?.items[0][key]
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
                          {(PersonsData?.items[0] as any)[key] ?? "-"}
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
          <Grid item md={8} xs={12}>
            <Descriptions bordered style={{ margin: 0, padding: 0 }} column={1}>
              {!isPersonsDataFetching &&
                Object.keys(LimitsData).map((key, index) => {
                  switch (key) {
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
                          {(PersonsData?.items[0] as any)[key]
                            ? new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              }).format((PersonsData?.items[0] as any)[key])
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
