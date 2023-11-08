/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  EyeFilled,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { Grid } from "@mui/material";
import { CustomTable } from "@src/components/CustomTable";
import { FiltersModal } from "@src/components/FiltersModal";
import { FilterChips } from "@src/components/FiltersModal/filterChips";
import { ExportReportsModal } from "@src/components/Modals/exportReportsModal";
import { Toast } from "@src/components/Toast";
import { ValidateToken } from "@src/components/ValidateToken";
import { queryClient } from "@src/services/queryClient";
import { useGetRowsMerchantManualEntryCategory } from "@src/services/register/merchant/manualEntryCategory/getManualEntryCategory";
import { CreateMerchantManualTransaction } from "@src/services/types/moviments/merchant/createManualTransaction.interface";
import {
  GetMerchantMovimentsItem,
  GetMerchantMovimentsQuery,
} from "@src/services/types/moviments/merchant/getMoviments";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { Button, Divider, Statistic } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetPreManualEntry } from "@src/services/moviments/preManual/getPreManual";
import { CreateMovimentModal } from "../components/createMovimentModal";
import { useCreatePreManualTransaction } from "@src/services/moviments/preManual/createPreManualTransaction";
import { ViewModal } from "@src/components/Modals/viewGenericModal";
import { ApproveModal } from "./components/approveModal";
import { MutateModal } from "@src/components/Modals/mutateGenericModal";
import { useApprovePreManualTransaction } from "@src/services/moviments/preManual/approvePreManual";
import { useCreatePreMerchantManualReports } from "@src/services/moviments/preManual/createReportPreManual";
import { useUpdatePreManualTransaction } from "@src/services/moviments/preManual/updatePreManualTransaction";
import { useDeletePreManualTransaction } from "@src/services/moviments/preManual/deletePreManualTransaction";

export const PreManual = () => {
  const { t } = useTranslation();
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;

  const INITIAL_QUERY: GetMerchantMovimentsQuery = {
    page: 1,
    limit: 25,
    sort_field: "createdAt",
    sort_order: "DESC",
    start_date: moment(new Date())
      .startOf("day")
      .add(3, "hours")
      .format("YYYY-MM-DDTHH:mm:ss.SSS"),
    end_date: moment(new Date())
      .add(1, "day")
      .startOf("day")
      .add(3, "hours")
      .format("YYYY-MM-DDTHH:mm:ss.SSS"),
  };
  const [tokenState, setTokenState] = useState<string>("");
  const [query, setQuery] = useState<GetMerchantMovimentsQuery>(INITIAL_QUERY);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [currentItem, setCurrentItem] =
    useState<GetMerchantMovimentsItem | null>(null);
  const [operationInOpen, setOperationInIOpen] = useState<boolean>(false);
  const [operationOutOpen, setOperationOutOpen] = useState<boolean>(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const [operationInTokenModalOpen, setOperationInTokenModalOpen] =
    useState<boolean>(false);
  const [operationInBody, setOperationInBody] =
    useState<CreateMerchantManualTransaction | null>(null);
  const [updateBody, setUpdateBody] =
    useState<CreateMerchantManualTransaction | null>(null);

  const [selectedRows, setSelectedRows] = useState<any[] | []>([]);
  const {
    isPreManualDataFetching,
    preManualData,
    preManualDataError,
    refetchPreManualData,
  } = useGetPreManualEntry(query);
  const {
    preManualReportsError,
    preManualReportsIsLoading,
    preManualReportsIsSuccess,
    preManualReportsMutate,
  } = useCreatePreMerchantManualReports(query);

  const selectedRowsId = (array: any[]) => {
    const ids = array.map((item) => item?._id);
    return ids;
  };

  const {
    approvePreManualError,
    approvePreManualLoading,
    approvePreManualMutate,
    approvePreManualSuccess,
    approvePreManualReset
  } = useApprovePreManualTransaction({
    pre_entry_account_ids: selectedRowsId(selectedRows),
    validation_token: tokenState,
  });

  const {
    deletePreManualTransactionError,
    deletePreManualTransactionIsSuccess,
    deletePreManualTransactionMutate,
  } = useDeletePreManualTransaction(currentItem?._id);

  const {
    updatePreManualTransactionError,
    updatePreManualTransactionIsLoading,
    updatePreManualTransactionIsSuccess,
    updatePreManualTransactionMutate,
  } = useUpdatePreManualTransaction(updateBody);

  const { categoryData } = useGetRowsMerchantManualEntryCategory({
    limit: 200,
    page: 1,
    sort_field: "created_at",
    sort_order: "DESC",
  });

  const { mutate, error, isSuccess } =
    useCreatePreManualTransaction(operationInBody);

  const onSubmitIn = () => {
    setOperationInIOpen(false);
    mutate();
  };

  useEffect(() => {
    refetchPreManualData();
  }, [query]);

  useEffect(() => {
    setUpdateBody({
      pre_entry_id: currentItem?._id,
      merchant_id: currentItem?.merchant_id,
      category_id: currentItem?.category_id,
      description: currentItem?.description,
      value: currentItem?.value,
      type: currentItem?.type as CreateMerchantManualTransaction["type"],
    });
  }, [currentItem]);

  useEffect(() => {
    setOperationInBody((state) => ({ ...state, validation_token: tokenState }));
  }, [tokenState]);

  useEffect(() => {
    setSelectedRows([])
  }, [approvePreManualSuccess])

  return (
    <Grid container style={{ padding: "25px" }}>
      <Grid
        container
        item
        xs={12}
        style={{ display: "flex", justifyContent: "center" }}
      >
        {preManualData &&
          Object.keys(preManualData).map((key) => {
            switch (key) {
              case "total_in_processing":
              case "total_in_canceled":
              case "total_in_success":
                return (
                  <Grid
                    key={key}
                    item
                    xs={5}
                    md="auto"
                    style={{
                      margin: "10px",
                    }}
                  >
                    <Statistic
                      valueStyle={{ color: "#3f8600", fontSize: "20px" }}
                      prefix={<ArrowUpOutlined />}
                      title={t(`table.${key}`)}
                      loading={isPreManualDataFetching}
                      value={new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(preManualData[key] || 0)}
                    />
                  </Grid>
                );
              case "total_out_processing":
              case "total_out_canceled":
              case "total_out_success":
                return (
                  <Grid
                    key={key}
                    item
                    xs={5}
                    md="auto"
                    style={{ margin: "10px" }}
                  >
                    <Statistic
                      valueStyle={{ color: "#cf1322", fontSize: "20px" }}
                      prefix={<ArrowDownOutlined />}
                      title={t(`table.${key}`)}
                      loading={isPreManualDataFetching}
                      value={new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(preManualData[key] || 0)}
                    />
                  </Grid>
                );
              default:
                return;
            }
          })}
        {!permissions.transactions.merchant?.pre_manual_transactions
          ?.merchant_pre_manual_transactions_create && (
          <Grid container item xs={12} md={4} lg={2} rowSpacing={1}>
            <Grid item xs={12}>
              <Button
                style={{ width: "100%", minWidth: "200px" }}
                size="large"
                type="default"
                shape="round"
                onClickCapture={() => setOperationInIOpen(true)}
              >
                <ArrowUpOutlined /> {t("buttons.register_in")}
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                style={{ width: "100%", minWidth: "200px" }}
                size="large"
                type="default"
                shape="round"
                danger
                onClickCapture={() => setOperationOutOpen(true)}
              >
                <ArrowDownOutlined />
                {t("buttons.register_out")}
              </Button>
            </Grid>
          </Grid>
        )}
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          <Divider />
        </Grid>
      </Grid>
      <Grid
        container
        style={{ display: "flex", alignItems: "center" }}
        spacing={1}
      >
        <Grid item xs={12} md={2} lg={2}>
          <Button
            size="large"
            style={{ width: "100%" }}
            loading={isPreManualDataFetching}
            type="primary"
            onClick={() => setIsFiltersOpen(true)}
          >
            {t("table.filters")}
          </Button>
        </Grid>
        <Grid item xs={12} md={3} lg={4}>
          <FilterChips
            startDateKeyName="start_date"
            endDateKeyName="end_date"
            query={query}
            setQuery={setQuery}
            haveInitialDate
          />
        </Grid>
        <Grid item xs={12} md={2} lg={2}>
          <Button
            type="dashed"
            loading={isPreManualDataFetching}
            danger
            onClick={() => {
              setQuery(INITIAL_QUERY);
            }}
            style={{
              height: 40,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FilterAltOffOutlinedIcon style={{ marginRight: 10 }} />
            {t("table.clear_filters")}
          </Button>
        </Grid>
        {!permissions.transactions.merchant?.pre_manual_transactions
          ?.merchant_pre_manual_transactions_export_csv && (
          <Grid item xs={12} md={3} lg={2}>
            <ExportReportsModal
              disabled={!preManualData?.total || preManualDataError}
              mutateReport={() => preManualReportsMutate()}
              error={preManualReportsError}
              success={preManualReportsIsSuccess}
              loading={preManualReportsIsLoading}
              reportPath="moviment/pre_manual/reports"
            />
          </Grid>
        )}

        {!permissions.transactions.merchant?.pre_manual_transactions
          ?.merchant_pre_manual_transactions_approve && (
          <Grid item xs={12} md={3} lg={2}>
            <ApproveModal
              disabled={selectedRows.length === 0}
              loading={approvePreManualLoading}
              reset={approvePreManualReset}
              setIsValidateTokenOpen={setOperationInTokenModalOpen}
            />
          </Grid>
        )}
      </Grid>

      <Grid container style={{ marginTop: "15px" }}>
        <Grid item xs={12}>
          <CustomTable
            query={query}
            setCurrentItem={setCurrentItem}
            setQuery={setQuery}
            data={preManualData}
            items={preManualData?.items}
            error={preManualDataError}
            checkbox
            setSelectedRows={setSelectedRows}
            selectedKeys={selectedRows}
            rowKey="_id"
            columns={[
              { name: "_id", type: "id" },
              { name: "category_name", type: "text", sort: true },
              { name: "user_name", type: "text" },
              { name: "type", type: "translate" },
              { name: "value", type: "value" },
              { name: "createdAt", type: "date", sort: true },
            ]}
            loading={isPreManualDataFetching}
            refetch={() => refetchPreManualData()}
            actions={[
              {
                label: "details",
                icon: <EyeFilled style={{ fontSize: "20px" }} />,
                onClick: () => setIsViewModalOpen(true),
              },
              !permissions.transactions.merchant?.pre_manual_transactions
                ?.merchant_pre_manual_transactions_update && {
                label: "edit",
                icon: <EditOutlined style={{ fontSize: "20px" }} />,
                onClick: () => {
                  setIsUpdateModalOpen(true);
                },
              },
              {
                label: "delete",
                icon: <DeleteOutlined style={{ fontSize: "20px" }} />,
                onClick: () => setConfirmDelete(true),
              },
            ]}
            isConfirmOpen={confirmDelete}
            setIsConfirmOpen={setConfirmDelete}
            itemToAction={currentItem?._id}
            onConfirmAction={() => deletePreManualTransactionMutate()}
            removeTotal
            label={["user_name", "type"]}
          />
        </Grid>
      </Grid>
      {isFiltersOpen && (
        <FiltersModal
          open={isFiltersOpen}
          setOpen={setIsFiltersOpen}
          query={query}
          setQuery={setQuery}
          haveInitialDate
          filters={[
            "start_date",
            "end_date",
            "status",
            "aggregator_id",
            "partner_id",
            "merchant_id",
            "category_id",
            "type",
          ]}
          refetch={refetchPreManualData}
          selectOptions={{
            status: ["PROCESSING", "SUCCESS", "CANCELED"],
            category_id:
              categoryData?.items?.map((category) => {
                return { label: category?.name, value: category?.id };
              }) || [],
            type: ["in", "out"],
          }}
          startDateKeyName="start_date"
          endDateKeyName="end_date"
          initialQuery={INITIAL_QUERY}
        />
      )}

      {isUpdateModalOpen && (
        <MutateModal
          type="update"
          open={isUpdateModalOpen}
          setOpen={setIsUpdateModalOpen}
          fields={[
            { label: "merchant_id", required: false },
            {
              label: "category_id",
              required: false,
              selectOption: true,
              noTranslate: true,
            },
            { label: "value", required: false },
            { label: "type", required: false, selectOption: true },
            { label: "description", required: false },
          ]}
          body={updateBody}
          selectOptions={{
            type: [
              { label: "in", value: "in" },
              { label: "out", value: "out" },
            ],
            category_id:
              categoryData?.items?.map((category) => {
                return { label: category?.name, value: category?.id };
              }) || [],
          }}
          setBody={setUpdateBody}
          modalName={t("modal.update_responsible")}
          submit={updatePreManualTransactionMutate}
          submitLoading={updatePreManualTransactionIsLoading}
          error={updatePreManualTransactionError}
          success={updatePreManualTransactionIsSuccess}
        />
      )}

      {operationInOpen && (
        <CreateMovimentModal
          open={operationInOpen}
          setOpen={setOperationInIOpen}
          category="merchant"
          type="in"
          onSubmit={onSubmitIn}
          body={operationInBody}
          setBody={setOperationInBody}
        />
      )}
      {operationOutOpen && (
        <CreateMovimentModal
          open={operationOutOpen}
          setOpen={setOperationOutOpen}
          category="merchant"
          type="out"
          onSubmit={onSubmitIn}
          body={operationInBody}
          setBody={setOperationInBody}
        />
      )}

      {operationInTokenModalOpen && (
        <ValidateToken
          open={operationInTokenModalOpen}
          setIsOpen={setOperationInTokenModalOpen}
          action="PRE_ENTRY_ACCOUNT_APPROVE"
          body={operationInBody}
          setTokenState={setTokenState}
          tokenState={tokenState}
          error={approvePreManualError}
          success={approvePreManualSuccess}
          submit={() => {
            approvePreManualMutate();
          }}
        />
      )}

      {isViewModalOpen && (
        <ViewModal
          open={isViewModalOpen}
          setOpen={setIsViewModalOpen}
          item={currentItem}
          loading={false}
          modalName={t("modal.report_details")}
        />
      )}

      <Toast
        actionSuccess={t("messages.created")}
        actionError={t("messages.create")}
        error={error}
        success={isSuccess}
      />
      <Toast
        actionSuccess={t("messages.updated")}
        actionError={t("messages.update")}
        error={updatePreManualTransactionError}
        success={updatePreManualTransactionIsSuccess}
      />
      <Toast
        actionSuccess={t("messages.deleted")}
        actionError={t("messages.delete")}
        error={deletePreManualTransactionError}
        success={deletePreManualTransactionIsSuccess}
      />
    </Grid>
  );
};
