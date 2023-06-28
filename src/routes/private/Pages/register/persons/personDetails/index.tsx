import { Grid } from "@mui/material";
import { CustomTable } from "@src/components/CustomTable";
import { useGetRowsGeneratedDeposits } from "@src/services/consult/generatedDeposits/getRows";
import { useGetTotalGeneratedDeposits } from "@src/services/consult/generatedDeposits/getTotal";
import { useGetPersons } from "@src/services/register/persons/persons/getPersons";
import { generatedDepositTotalQuery } from "@src/services/types/consult/deposits/generatedDeposits.interface";
import { PersonsQuery } from "@src/services/types/register/persons/persons.interface";
import { Descriptions, Spin, Tabs, TabsProps } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { useParams } from "react-router-dom";
import { TotalizersCards as DepositsCards } from "../../../consult/deposits/generated/components/TotalizersCards";
import { useGetTotalPaidDeposits } from "@src/services/consult/paidDeposits/getTotal";
import { useGetRowsPaidDeposits } from "@src/services/consult/paidDeposits/getRows";
import { paidDepositTotalQuery } from "@src/services/types/consult/deposits/PaidDeposits.interface";
import { useGetTotalGeneratedWithdrawals } from "@src/services/consult/generatedWithdrawals/getTotal";
import { useGetRowsGeneratedWithdrawals } from "@src/services/consult/generatedWithdrawals/getRows";
import { generatedWithdrawalsRowsQuery } from "@src/services/types/consult/withdrawals/generatedWithdrawals.interface";
import { TotalizersCards } from "../../../consult/withdrawals/generated/components/TotalizersCards";

export const PersonDetails = () => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery({ maxWidth: "750px" });
  const { name } = useParams();
  const query: PersonsQuery = {
    limit: 25,
    page: 1,
    sort_field: "created_at",
    sort_order: "DESC",
    name: name,
  };
  const { PersonsData, isPersonsDataFetching } = useGetPersons(query);

  ///// generated deposits ------------------

  const [gDepositQuery, setGDepositQuery] =
    useState<generatedDepositTotalQuery>({
      page: 1,
      limit: 25,
      payer_name: name?.toLocaleLowerCase(),
    });

  const { depositsTotal, isDepositsTotalFetching, refetchDepositsTotal } =
    useGetTotalGeneratedDeposits(gDepositQuery);

  const { depositsRows, depositsRowsError, isDepositsRowsFetching } =
    useGetRowsGeneratedDeposits(gDepositQuery);

  //////// paid deposits ----------------------

  const [pDepositQuery, setPDepositQuery] = useState<paidDepositTotalQuery>({
    page: 1,
    limit: 25,
    payer_name: name?.toLocaleLowerCase(),
    status: "PAID",
  });

  const { paidTotal, isPaidTotalFetching, refetchPaidTotal } =
    useGetTotalPaidDeposits(pDepositQuery);

  const { paidRows, paidRowsError, isPaidRowsFetching } =
    useGetRowsPaidDeposits(pDepositQuery);

  ////////// withdrawals --------------------

  const [WithdrawalsQuery, setWithdrawalsQuery] =
    useState<generatedWithdrawalsRowsQuery>({ page: 1, limit: 25 });
  const {
    WithdrawalsTotal,
    isWithdrawalsTotalFetching,
    refetchWithdrawalsTotal,
  } = useGetTotalGeneratedWithdrawals(WithdrawalsQuery);

  const { witrawalsRows, witrawalsRowsError, isWithdrawalsRowsFetching } =
    useGetRowsGeneratedWithdrawals(WithdrawalsQuery);

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: t("table.details"),
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
        <Descriptions
          bordered
          style={{ margin: 0, padding: 0 }}
          column={isMobile ? 1 : 3}
        >
          {PersonsData?.items[0] &&
            Object.keys(PersonsData?.items[0]).map((key: string, index) => {
              switch (key) {
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
      ),
    },
    {
      key: "2",
      label: t("table.attachment"),
      children: <></>,
    },
    {
      key: "3",
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
      key: "4",
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
      key: "5",
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
