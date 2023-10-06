/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { EyeFilled } from "@ant-design/icons";
import { ColumnInterface, CustomTable } from "@components/CustomTable";
import { FiltersModal } from "@components/FiltersModal";
import { FilterChips } from "@components/FiltersModal/filterChips";
import { ValidateToken } from "@components/ValidateToken";
import { ArrowUpOutlined, DollarOutlined } from "@ant-design/icons";
import { Grid } from "@mui/material";
import { ArrowDownOutlined } from "@ant-design/icons";
import { useCreateTransferBetweenMerchants } from "@src/services/moviments/transfersMerchants/createTransferBetweenMerchants";
import { useGetTransferBetweenMerchants } from "@src/services/moviments/transfersMerchants/getTransferBetweenMerchants";
import { ViewModal } from "@src/components/Modals/viewGenericModal";
import { queryClient } from "@src/services/queryClient";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { Button, Row, Col, Statistic, Card } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Toast } from "@src/components/Toast";
import { MutateModal } from "@src/components/Modals/mutateGenericModal";
import { useListMerchants } from "@src/services/merchant/listMerchants";
import { GetTransferMerchantQuery } from "@src/services/types/moviments/transfersMerchants/getTransferBetweenMerchants.interface";

const INITIAL_QUERY: GetTransferMerchantQuery = {
  limit: 25,
  page: 1,
  sort_field: "id",
  sort_order: "DESC",
};

export const TransferBetweenMerchants = () => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const [query, setQuery] = useState<GetTransferMerchantQuery>(INITIAL_QUERY);
  const { t } = useTranslation();
  const [transferBody, setTransferBody] = useState<any | null>({
    final_account: "",
    origin_account: "",
  });
  const {
    isTransferMerchantsDataFetching,
    refetchTransferMerchantsData,
    transferMerchantsData,
    transferMerchantsDataError,
  } = useGetTransferBetweenMerchants(query);
  const { merchantsData } = useListMerchants(query as any);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [isTransferModalOpen, setIsTransferModalOpen] =
    useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<any>(null);

  const [isValidateTokenOpen, setIsValidateTokenOpen] =
    useState<boolean>(false);
  const [tokenState, setTokenState] = useState<string>("");
  const { error, isSuccess, mutate } = useCreateTransferBetweenMerchants({
    ...transferBody,
    validation_token: tokenState,
  });
console.log({query})
  const columns: ColumnInterface[] = [
    { name: "id", type: "id", sort: true },
    {
      name: "debit_merchant_name",
      type: "text",
      head: "merchant_origin",
      sort: true,
    },
    { name: "debit_balance_type", type: "status", sort: true },
    {
      name: "credit_merchant_name",
      type: "text",
      head: "merchant_destination",
      sort: true,
    },
    { name: "credit_balance_type", type: "status", sort: true },
    { name: "user_name", type: "text", sort: true },
    { name: "value", type: "value", sort: true },
    { name: "createdAt", type: "date", sort: true },
    { name: "status", type: "status" },
  ];

  const handleBalanceColor = (key: string) => {
    switch (key) {
      case "total_success":
        return "#3f8600"
      case "total_processing":
        return "#C4B35B"
      case "total_canceled":
        return "#cf1322"
          
      default:
        return;
    }
  };

  const handleCreateTransfer = () => {
    mutate();
  };

  useEffect(() => {
    refetchTransferMerchantsData();
  }, [query]);
  
  return (
    <Row style={{ padding: 25 }}>

      <Row gutter={[8, 8]} style={{ width: "100%", marginBottom: 16, justifyContent: 'center', gap: 10 }}>
        {transferMerchantsData &&
          Object.keys(transferMerchantsData).map((key) => {
            switch (key) {
              case "total_processing":
              case "total_canceled":
              case "total_success":
                return (
                  <Grid
                    key={key}
                    item
                    xs={12}
                    md="auto"
                  >
                    <Card bordered={false} style={{minWidth: 150}} >
                    <Statistic
                      valueStyle={{ color: handleBalanceColor(key), fontSize: "20px" }}
                      title={t(`table.${key}`)}
                      loading={isTransferMerchantsDataFetching}
                      value={new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(transferMerchantsData[key] || 0)}
                    />
                    </Card>
                  </Grid>
                );
              default:
                return;
            }
          })}

      </Row>

      <Row gutter={[8, 8]} style={{ width: "100%", marginBottom: 16 }}>
        <Col xs={{ span: 24 }} md={{ span: 4 }}>
          <Button
            size="large"
            style={{ width: "100%" }}
            loading={false}
            type="primary"
            onClick={() => setIsFiltersOpen(true)}
          >
            {t("table.filters")}
          </Button>
        </Col>
        <Col xs={{ span: 24 }} md={{ span: 11 }} lg={16}>
          <FilterChips
            startDateKeyName="start_date"
            endDateKeyName="end_date"
            query={query}
            setQuery={setQuery}
          />
        </Col>

        <Col xs={{ span: 24 }} md={{ span: 6 }} lg={4}>
          <Button
            type="default"
            loading={false}
            onClick={() => {
              setIsTransferModalOpen(true);
            }}
            style={{
              height: 40,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ArrowUpOutlined
              style={{ fontSize: 16, marginRight: -8, marginBottom: 12 }}
            />
            <DollarOutlined style={{ fontSize: 22 }} /> {t("table.transfer")}
          </Button>
        </Col>
      </Row>

      <Grid container style={{ marginTop: "15px" }}>
        <Grid item xs={12}>
          <CustomTable
            query={query}
            setCurrentItem={setCurrentItem}
            setQuery={setQuery}
            actions={[
              {
                label: "details",
                icon: <EyeFilled style={{ fontSize: "20px" }} />,
                onClick: () => {
                  setIsViewModalOpen(true);
                },
              },
            ]}
            data={transferMerchantsData}
            items={transferMerchantsData?.items}
            error={transferMerchantsDataError}
            columns={columns}
            loading={isTransferMerchantsDataFetching}
            label={["_id"]}
          />
        </Grid>
      </Grid>

      {isFiltersOpen && (
        <FiltersModal
          open={isFiltersOpen}
          setOpen={setIsFiltersOpen}
          query={query}
          setQuery={setQuery}
          filters={["start_date", "end_date", "merchant_id"]}
          refetch={refetchTransferMerchantsData}
          selectOptions={{}}
          startDateKeyName="start_date"
          endDateKeyName="end_date"
          initialQuery={INITIAL_QUERY}
        />
      )}

      {isValidateTokenOpen && (
        <ValidateToken
          action="CREATE_TRANSFER_BETWEEN_MERCHANTS"
          body={transferBody}
          open={isValidateTokenOpen}
          setIsOpen={setIsValidateTokenOpen}
          setTokenState={setTokenState}
          tokenState={tokenState}
          success={isSuccess}
          error={error}
          submit={handleCreateTransfer}
        />
      )}

      {isTransferModalOpen && (
        <MutateModal
          type="create"
          open={isTransferModalOpen}
          setOpen={setIsTransferModalOpen}
          fields={[
            {
              label: "merchant_origin",
              required: true,
              asyncOption: {
                options: merchantsData?.items,
                optionLabel: "name",
                optionValue: "id",
                bodyProp: "debit_merchant_id",
              },
            },
            {
              label: "debit_balance_type",
              required: true,
              selectOption: true,
            },
            {
              label: "merchant_destination",
              required: true,
              asyncOption: {
                options: merchantsData?.items,
                optionLabel: "name",
                optionValue: "id",
                bodyProp: "credit_merchant_id",
              },
            },
            {
              label: "credit_balance_type",
              required: true,
              selectOption: true,
            },
            { label: "value", required: true },
          ]}
          body={transferBody}
          setBody={setTransferBody}
          selectOptions={{
            debit_balance_type: [
              "balance_reserved",
              "balance_to_payment",
              "balance_to_transactions",
            ],
            credit_balance_type: [
              "balance_reserved",
              "balance_to_payment",
              "balance_to_transactions",
            ],
          }}
          modalName={t("table.transfer")}
          submit={() => {
            setIsValidateTokenOpen(true);
          }}
          submitLoading={false}
          error={false}
          success={false}
          submitText={`${t("buttons.create")}`}
        />
      )}

      <Toast
        actionSuccess={t("messages.create")}
        actionError={t("messages.create")}
        error={error}
        success={isSuccess}
      />
      {isViewModalOpen && (
        <ViewModal
          item={currentItem}
          loading={isTransferMerchantsDataFetching}
          modalName={`${t("modal.user")}: ${currentItem?.name}`}
          open={isViewModalOpen}
          setOpen={setIsViewModalOpen}
        />
      )}
    </Row>
  );
};
