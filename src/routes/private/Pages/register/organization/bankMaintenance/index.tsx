/* eslint-disable react-hooks/exhaustive-deps */
import { EditFilled } from "@ant-design/icons";
import { ColumnInterface, CustomTable } from "@components/CustomTable";
import { Grid } from "@mui/material";
import { MutateModal } from "@src/components/Modals/mutateGenericModal";
import { queryClient } from "@src/services/queryClient";
import { useGetOrganizationBankMaintenece } from "@src/services/register/organization/bankMaitenence/getBanks";
import { useUpdateBank } from "@src/services/register/organization/bankMaitenence/updateBank";
import {
  BankMaintenenceItem,
  BankMaintenenceQuery,
} from "@src/services/types/register/organization/bankMaintenence.interface";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { useEffect, useState } from "react";
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

  const [updateBody, setUpdateBody] = useState<BankMaintenenceItem | null>(
    currentItem
  );
  const { updateBank, updateBankError, updateBankLoading, updateBankSuccess } =
    useUpdateBank(updateBody, currentItem?.id);

  const columns: ColumnInterface[] = [
    { name: "icon_url", type: "icon" },
    { name: "label_name", type: "text",sort: true },
    { name: "priority", type: "text" },
    { name: "agency", type: "text" },
    { name: "account", type: "text" },
    { name: "status", type: "status" },
    { name: "bank_fee", type: "text" },
    { name: "cash_in", type: "boolean" },
    { name: "cash_out", type: "boolean" },
    { name: "created_at", type: "date",sort: true },
  ];

  useEffect(() => {
    refetchBankMainteneceData();
  }, [query]);
  useEffect(() => {
    setUpdateBody(currentItem);
  }, [currentItem]);

  return (
    <Grid container style={{ padding: "25px" }}>
      <Grid container>
        <Grid item xs={12}>
          {" "}
          <CustomTable
            query={query}
            setCurrentItem={setCurrentItem}
            setQuery={setQuery}
            data={BankMainteneceData}
            items={BankMainteneceData?.itens}
            error={BankMainteneceDataError}
            columns={columns}
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
            label={["label_name"]}
          />
        </Grid>
      </Grid>
      {isUpdateBankModalOpen && (
        <MutateModal
          type="update"
          open={isUpdateBankModalOpen}
          setOpen={setIsUpdateBankModalOpen}
          fields={[
            { label: "label_name", required: false },
            { label: "icon_url", required: false },
            { label: "priority", required: false },
            { label: "bank_fee", required: false },
            { label: "internal_account_number", required: false },
            { label: "cash_in", required: false },
            { label: "cash_out", required: false },
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
        />
      )}
    </Grid>
  );
};
