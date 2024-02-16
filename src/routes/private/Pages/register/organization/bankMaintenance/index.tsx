/* eslint-disable react-hooks/exhaustive-deps */
import { EditFilled, InfoCircleOutlined } from "@ant-design/icons";
import { CustomTable } from "@components/CustomTable";
import { Grid } from "@mui/material";
import { MutateModal } from "@src/components/Modals/mutateGenericModal";
import { Toast } from "@src/components/Toast";
import { TuorComponent } from "@src/components/Tuor";
import { queryClient } from "@src/services/queryClient";
import { useGetOrganizationBankMaintenece } from "@src/services/register/organization/bankMaitenence/getBanks";
import { useUpdateBank } from "@src/services/register/organization/bankMaitenence/updateBank";
import {
  BankMaintenenceItem,
  BankMaintenenceQuery,
} from "@src/services/types/register/organization/bankMaintenence.interface";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { Button, Tooltip } from "antd";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const INITIAL_QUERY: BankMaintenenceQuery = {
  limit: 25,
  page: 1,
  sort_field: "id",
  sort_order: "DESC",
};

export const BankMaintenence = () => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;

  const [query, setQuery] = useState<BankMaintenenceQuery>(INITIAL_QUERY);
  const { t } = useTranslation();
  const [isUpdateBankModalOpen, setIsUpdateBankModalOpen] =
    useState<boolean>(false);

  const {
    BankMainteneceData,
    BankMainteneceDataError,
    isBankMainteneceDataFetching,
    refetchBankMainteneceData,
  } = useGetOrganizationBankMaintenece(query);
  const [currentItem, setCurrentItem] = useState<BankMaintenenceItem | null>(
    null
  );

  const [updateBody, setUpdateBody] = useState<BankMaintenenceItem | null>({
    label_name: currentItem?.label_name,
    icon_url: currentItem?.icon_url,
    priority: Number(currentItem?.priority),
    bank_fee: Number(currentItem?.bank_fee),
    agency: Number(currentItem?.agency),
    account: Number(currentItem?.account),
    internal_account_number: Number(currentItem?.internal_account_number),
    cash_in: currentItem?.cash_in,
    cash_out: currentItem?.cash_out,
    status: currentItem?.status,
    fastpix_in: currentItem?.fastpix_in,
    account_name: currentItem?.account_name,
    account_document: currentItem?.account_document,
  });
  const { updateBank, updateBankError, updateBankLoading, updateBankSuccess, reset } =
    useUpdateBank(
      { ...updateBody, id: undefined, bank: undefined, created_at: undefined },
      currentItem?.id
    );

  const [isTuorOpen, setIsTuorOpen] = useState<boolean>(false);
  const refLogo = useRef(null);
  const refBankName = useRef(null);
  const refPriority = useRef(null);
  const refAgency = useRef(null);
  const refAccount = useRef(null);
  const refStatus = useRef(null);
  const refBankFee = useRef(null);
  const refCashIn = useRef(null);
  const refCashOut = useRef(null);
  const refCreatedAt = useRef(null);

  useEffect(() => {
    refetchBankMainteneceData();
  }, [query]);
  useEffect(() => {
     setUpdateBody(currentItem);
  }, [currentItem, isUpdateBankModalOpen]);

  return (
    <Grid container style={{ padding: "25px" }}>
      <Grid
        item
        xs={12}
        md={12}
        style={{ display: "flex", justifyContent: "flex-end" }}
      >
        <Tooltip title={t("buttons.help")}>
          <Button type="link" onClick={() => setIsTuorOpen((state) => !state)}>
            <InfoCircleOutlined />
          </Button>
        </Tooltip>
      </Grid>

      <Grid container>
        <Grid item xs={12}>
          <CustomTable
            query={query}
            setCurrentItem={setCurrentItem}
            setQuery={setQuery}
            data={BankMainteneceData}
            items={BankMainteneceData?.itens}
            error={BankMainteneceDataError}
            columns={[
              { name: "icon_url", type: "icon", key: refLogo },
              {
                name: "label_name",
                type: "text",
                sort: true,
                key: refBankName,
              },
              { name: "priority", type: "text", key: refPriority },
              { name: "agency", type: "text", key: refAgency },
              { name: "account", type: "text", key: refAccount },
              { name: "status", type: "status", key: refStatus },
              { name: "bank_fee", type: "text", key: refBankFee },
              { name: "cash_in", type: "boolean", key: refCashIn },
              { name: "cash_out", type: "boolean", key: refCashOut },
              { name: "fastpix_in", type: "boolean",  },
              {
                name: "created_at",
                type: "date",
                sort: true,
                key: refCreatedAt,
              },
            ]}
            actions={
              permissions.register.paybrokers.banks_maintain
                .banks_maintain_update
                ? [
                    {
                      label: "edit",
                      icon: <EditFilled />,
                      onClick: () => {
                        setIsUpdateBankModalOpen(true);
                      },
                    },
                  ]
                : undefined
            }
            loading={isBankMainteneceDataFetching}
            label={["label_name", "cash_in", "cash_out", ]}
          />
        </Grid>
      </Grid>

        <MutateModal
          type="update"
          open={isUpdateBankModalOpen}
          setOpen={setIsUpdateBankModalOpen}
          fields={[
            { label: "label_name", required: true },
            { label: "icon_url", required: false },
            { label: "priority", required: false },
            { label: "bank_fee", required: false },
            { label: "agency", required: false },
            { label: "account", required: false },
            { label: "internal_account_number", required: false },
            { label: "cash_in", required: false },
            { label: "cash_out", required: false },
            { label: "status", required: false },
            { label: "fastpix_in", required: false },
            { label: "account_name", required: false },
            { label: "account_document", required: false },
          ]}
          body={updateBody}
          setBody={setUpdateBody}
          modalName={t("modal.update_bank")}
          submit={updateBank}
          submitLoading={updateBankLoading}
          error={updateBankError}
          success={updateBankSuccess}
          clear={reset}
        />
        
      <TuorComponent
        open={isTuorOpen}
        setOpen={setIsTuorOpen}
        steps={[
          {
            title: t("table.icon_url"),
            description: t("wiki.logo_description"),
            target: () => refLogo.current,
          },
          {
            title: t("table.bank_name"),
            description: t("wiki.bank_name_description"),
            target: () => refBankName.current,
          },
          {
            title: t("table.priority"),
            description: t("wiki.priority_description"),
            target: () => refPriority.current,
          },
          {
            title: t("table.agency"),
            description: t("wiki.agency_description"),
            target: () => refAgency.current,
          },
          {
            title: t("table.account"),
            description: t("wiki.account_description"),
            target: () => refAccount.current,
          },
          {
            title: t("table.status"),
            description: t("wiki.status_description"),
            target: () => refStatus.current,
          },
          {
            title: t("table.bank_fee"),
            description: t("wiki.bank_fee_description"),
            target: () => refBankFee.current,
          },
          {
            title: t("table.cash_in"),
            description: t("wiki.cash_in_description"),
            target: () => refCashIn.current,
          },
          {
            title: t("table.cash_out"),
            description: t("wiki.cash_out_description"),
            target: () => refCashOut.current,
          },
          {
            title: t("table.createdAt"),
            description: t("wiki.created_at_description"),
            target: () => refCreatedAt.current,
          },
        ]}
        pageStep={{
          title: t("menus.bank_maintain"),
          description: t("wiki.bank_maintain_description"),
        }}
      />
      <Toast
        actionError={t("messages.update")}
        actionSuccess={t("messages.updated")}
        error={updateBankError}
        success={updateBankSuccess}
      />
    </Grid>
  );
};
