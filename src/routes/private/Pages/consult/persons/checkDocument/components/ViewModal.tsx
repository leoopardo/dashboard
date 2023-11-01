/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch, SetStateAction, useState } from "react";
import { Drawer, Spin } from "antd";
import { useTranslation } from "react-i18next";
import { ColumnInterface, CustomTable } from "@src/components/CustomTable";
import { useGetCheckCpfDetails } from "@src/services/consult/persons/checkDocumentsDetails";

interface viewProps {
  modalName: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  cpf?: string;
}

export const ViewModal = ({ open, setOpen, modalName, cpf }: viewProps) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState<any>({})
  const [, setCurrentItem] = useState()
  const { CheckCpfData, isCheckCpfDataFetching, CheckCpfDataError } =
    useGetCheckCpfDetails(cpf);
    
  const columns: ColumnInterface[] = [
    { name: "merchant_name", type: "text" },
    { name: "reason", type: "text", sort: true },
  ];

  return (
    <Drawer
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      bodyStyle={{ overflowX: "hidden", padding: 0 }}
      title={modalName}
    >
      {isCheckCpfDataFetching && <Spin tip={t("messages.loading")} />}
      <CustomTable
        query={query}
        setCurrentItem={setCurrentItem}
        setQuery={setQuery}
        data={CheckCpfData}
        items={CheckCpfData?.items}
        error={CheckCpfDataError}
        columns={columns}
        loading={isCheckCpfDataFetching}
        label={["merchant_name"]}
        actions={[]}
      />
    </Drawer>
  );
};
